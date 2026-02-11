'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SentryTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testCaptureMessage = () => {
    Sentry.captureMessage('Test: Structured log message', {
      level: 'info',
      tags: { test_type: 'manual_test', component: 'test_page' },
      extra: { timestamp: new Date().toISOString() }
    })
    addResult('✅ Sent structured log message to Sentry')
  }

  const testCaptureError = () => {
    try {
      throw new Error('Test: This is a sample error for Sentry testing')
    } catch (error) {
      Sentry.captureException(error, {
        level: 'error',
        tags: { test_type: 'error_test' },
        extra: { test_context: 'Manual error test from test page' }
      })
      addResult('✅ Sent test error to Sentry')
    }
  }

  const testMetrics = () => {
    // Counter metric
    Sentry.metrics.increment('test.button.clicks', 1, {
      tags: { test_type: 'metrics_test' }
    })

    // Gauge metric
    Sentry.metrics.gauge('test.value', 42, {
      tags: { unit: 'number' }
    })

    // Distribution metric
    Sentry.metrics.distribution('test.duration', Math.random() * 100, {
      tags: { test_type: 'performance' },
      unit: 'millisecond'
    })

    addResult('✅ Sent test metrics to Sentry (counter, gauge, distribution)')
  }

  const testAllFeatures = () => {
    testCaptureMessage()
    setTimeout(() => {
      testMetrics()
      setTimeout(() => {
        testCaptureError()
        addResult('🎉 All tests completed! Check your Sentry dashboard.')
      }, 500)
    }, 500)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c14] via-[#1e1a2a] to-[#2a2438] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#e8e4f0] mb-2">
            Sentry Integration Test
          </h1>
          <p className="text-[#9086a3]">
            Test the Sentry integration by sending sample events and metrics
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {/* Test Actions */}
          <Card className="bg-[#2a2438] border-[#362552] p-6">
            <h2 className="text-xl font-semibold text-[#e8e4f0] mb-4">
              Test Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={testCaptureMessage}
                className="bg-[#7553ff] hover:bg-[#8c6fff] text-white"
              >
                📝 Test Structured Logging
              </Button>

              <Button
                onClick={testMetrics}
                className="bg-[#7553ff] hover:bg-[#8c6fff] text-white"
              >
                📊 Test Custom Metrics
              </Button>

              <Button
                onClick={testCaptureError}
                className="bg-[#ff45a8] hover:bg-[#ff6bb8] text-white"
              >
                ⚠️ Test Error Capture
              </Button>

              <Button
                onClick={testAllFeatures}
                className="bg-gradient-to-r from-[#7553ff] to-[#ff45a8] hover:opacity-90 text-white"
              >
                🚀 Test All Features
              </Button>
            </div>
          </Card>

          {/* Configuration Info */}
          <Card className="bg-[#2a2438] border-[#362552] p-6">
            <h2 className="text-xl font-semibold text-[#e8e4f0] mb-4">
              Configuration Status
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#9086a3]">DSN Configured:</span>
                <span className={process.env.NEXT_PUBLIC_SENTRY_DSN ? 'text-green-400' : 'text-red-400'}>
                  {process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#9086a3]">Environment:</span>
                <span className="text-[#e8e4f0]">
                  {process.env.NODE_ENV || 'development'}
                </span>
              </div>
              {process.env.NEXT_PUBLIC_SENTRY_DSN && (
                <div className="flex items-center gap-2">
                  <span className="text-[#9086a3]">DSN:</span>
                  <code className="text-xs text-[#7553ff] bg-[#1e1a2a] px-2 py-1 rounded">
                    {process.env.NEXT_PUBLIC_SENTRY_DSN.slice(0, 50)}...
                  </code>
                </div>
              )}
            </div>
          </Card>

          {/* Test Results */}
          <Card className="bg-[#2a2438] border-[#362552] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#e8e4f0]">
                Test Results
              </h2>
              {testResults.length > 0 && (
                <Button
                  onClick={clearResults}
                  variant="outline"
                  className="text-xs border-[#362552] text-[#9086a3] hover:bg-[#1e1a2a]"
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-2 min-h-[200px]">
              {testResults.length === 0 ? (
                <p className="text-[#9086a3] text-sm text-center py-8">
                  No tests run yet. Click a button above to start testing.
                </p>
              ) : (
                testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm text-[#e8e4f0] bg-[#1e1a2a] px-3 py-2 rounded font-mono"
                  >
                    {result}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Instructions */}
          <Card className="bg-[#2a2438] border-[#362552] p-6">
            <h2 className="text-xl font-semibold text-[#e8e4f0] mb-4">
              📖 Instructions
            </h2>
            <ol className="space-y-3 text-sm text-[#9086a3]">
              <li className="flex gap-2">
                <span className="text-[#7553ff] font-semibold">1.</span>
                <span>Click any test button above to send events to Sentry</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#7553ff] font-semibold">2.</span>
                <span>Open your Sentry dashboard at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-[#7553ff] hover:underline">sentry.io</a></span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#7553ff] font-semibold">3.</span>
                <span>Navigate to Issues → All Issues to see captured errors</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#7553ff] font-semibold">4.</span>
                <span>Check Insights → Metrics to view custom metrics</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#7553ff] font-semibold">5.</span>
                <span>View Performance to see transaction data</span>
              </li>
            </ol>
          </Card>

          {/* Active Features */}
          <Card className="bg-[#2a2438] border-[#362552] p-6">
            <h2 className="text-xl font-semibold text-[#e8e4f0] mb-4">
              🎯 Active Sentry Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-[#e8e4f0]">Error Tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-[#e8e4f0]">Performance Monitoring</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-[#e8e4f0]">Session Replay</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-[#e8e4f0]">Custom Metrics</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-[#e8e4f0]">Structured Logging</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-[#e8e4f0]">Source Maps Upload</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-[#7553ff] hover:text-[#8c6fff] text-sm underline"
          >
            ← Back to SentryOS Desktop
          </a>
        </div>
      </div>
    </div>
  )
}
