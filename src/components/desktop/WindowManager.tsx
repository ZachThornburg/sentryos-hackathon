'use client'

import { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import * as Sentry from '@sentry/nextjs'
import { WindowState } from './types'

interface WindowManagerContextType {
  windows: WindowState[]
  openWindow: (window: Omit<WindowState, 'zIndex' | 'isFocused'>) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  topZIndex: number
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null)

export function useWindowManager() {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider')
  }
  return context
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [topZIndex, setTopZIndex] = useState(100)

  const openWindow = useCallback((window: Omit<WindowState, 'zIndex' | 'isFocused'>) => {
    Sentry.captureMessage('Window opened', {
      level: 'info',
      tags: { window_id: window.id, window_title: window.title }
    })
    Sentry.metrics.increment('desktop.windows.opened', 1, {
      tags: { window_type: window.id.split('-')[0] }
    })

    setTopZIndex(currentZ => {
      const newZ = currentZ + 1
      setWindows(prev => {
        const existing = prev.find(w => w.id === window.id)
        if (existing) {
          if (existing.isMinimized) {
            Sentry.captureMessage('Window restored from minimize', {
              level: 'info',
              tags: { window_id: window.id }
            })
            return prev.map(w =>
              w.id === window.id
                ? { ...w, isMinimized: false, isFocused: true, zIndex: newZ }
                : { ...w, isFocused: false }
            )
          }
          Sentry.captureMessage('Window refocused', {
            level: 'info',
            tags: { window_id: window.id }
          })
          return prev.map(w =>
            w.id === window.id
              ? { ...w, isFocused: true, zIndex: newZ }
              : { ...w, isFocused: false }
          )
        }
        // Track active window count
        Sentry.metrics.gauge('desktop.windows.active', prev.length + 1, {
          tags: { unit: 'windows' }
        })
        return [
          ...prev.map(w => ({ ...w, isFocused: false })),
          { ...window, zIndex: newZ, isFocused: true }
        ]
      })
      return newZ
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    Sentry.captureMessage('Window closed', {
      level: 'info',
      tags: { window_id: id }
    })
    Sentry.metrics.increment('desktop.windows.closed', 1, {
      tags: { window_type: id.split('-')[0] }
    })

    setWindows(prev => {
      const newCount = prev.length - 1
      Sentry.metrics.gauge('desktop.windows.active', newCount, {
        tags: { unit: 'windows' }
      })
      return prev.filter(w => w.id !== id)
    })
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    Sentry.captureMessage('Window minimized', {
      level: 'info',
      tags: { window_id: id }
    })
    Sentry.metrics.increment('desktop.windows.minimized', 1)

    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    ))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const window = prev.find(w => w.id === id)
      const newMaxState = !window?.isMaximized

      Sentry.captureMessage(newMaxState ? 'Window maximized' : 'Window unmaximized', {
        level: 'info',
        tags: { window_id: id }
      })
      Sentry.metrics.increment('desktop.windows.maximize_toggle', 1, {
        tags: { action: newMaxState ? 'maximize' : 'restore' }
      })

      return prev.map(w =>
        w.id === id ? { ...w, isMaximized: newMaxState } : w
      )
    })
  }, [])

  const restoreWindow = useCallback((id: string) => {
    setTopZIndex(currentZ => {
      const newZ = currentZ + 1
      setWindows(prev => prev.map(w =>
        w.id === id
          ? { ...w, isMinimized: false, isFocused: true, zIndex: newZ }
          : { ...w, isFocused: false }
      ))
      return newZ
    })
  }, [])

  const focusWindow = useCallback((id: string) => {
    setTopZIndex(currentZ => {
      const newZ = currentZ + 1
      setWindows(prev => prev.map(w =>
        w.id === id
          ? { ...w, isFocused: true, zIndex: newZ }
          : { ...w, isFocused: false }
      ))
      return newZ
    })
  }, [])

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    Sentry.metrics.increment('desktop.windows.moved', 1)
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, x, y } : w
    ))
  }, [])

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    Sentry.metrics.increment('desktop.windows.resized', 1)
    Sentry.metrics.distribution('desktop.window.size', width * height, {
      tags: { unit: 'pixels' }
    })
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, width, height } : w
    ))
  }, [])

  return (
    <WindowManagerContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      topZIndex
    }}>
      {children}
    </WindowManagerContext.Provider>
  )
}
