'use client'

import { useState, useEffect, useRef } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, ExternalLink, Settings, FileText, Presentation, Video, Mail, Calculator, Shield, Search, X, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Types
type AssetType = 'deck' | 'one-pager' | 'template' | 'demo-script' | 'battle-card' | 'case-study' | 'calculator' | 'guide' | 'email' | 'video'

interface Asset {
  id: string
  title: string
  description: string
  type: AssetType
  link: string
  tags: string[]
  stage: string
}

const stages = [
  { id: 'qualify', label: 'Qualify New Customer' },
  { id: 'poc', label: 'Proof of Concept' },
  { id: 'technical-win', label: 'Technical Win' },
  { id: 'finalize', label: 'Finalize Contracts' },
  { id: 'closing', label: 'Closing the Deal' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'qbr', label: 'QBR' },
  { id: 'renewal', label: 'Renewal' },
  { id: 'expansion', label: 'Expansion' },
]

// Sample assets (3 per stage)
const sampleAssets: Asset[] = [
  // Qualify New Customer
  {
    id: 'q1',
    title: 'Discovery Call Template',
    description: 'Structured questions to understand customer pain points, tech stack, and monitoring maturity',
    type: 'template',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'Template'],
    stage: 'qualify'
  },
  {
    id: 'q2',
    title: 'Sentry Value Proposition Deck',
    description: '10-slide deck covering error monitoring, performance, and session replay value',
    type: 'deck',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'Deck', 'Error Monitoring', 'Performance Monitoring'],
    stage: 'qualify'
  },
  {
    id: 'q3',
    title: 'Competitive Battle Card',
    description: 'Sentry vs. competitors - key differentiators and objection handling',
    type: 'battle-card',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'Battle Card', 'Enterprise'],
    stage: 'qualify'
  },

  // Proof of Concept
  {
    id: 'p1',
    title: 'POC Success Plan Template',
    description: '30/60/90 day POC framework with success criteria and milestones',
    type: 'template',
    link: '#',
    tags: ['Pre-Sale', 'Solutions Engineering', 'Template', 'Technical'],
    stage: 'poc'
  },
  {
    id: 'p2',
    title: 'Technical Implementation Guide',
    description: 'Step-by-step guide for installing and configuring Sentry SDKs',
    type: 'guide',
    link: '#',
    tags: ['Pre-Sale', 'Solutions Engineering', 'Technical Guide', 'Error Monitoring'],
    stage: 'poc'
  },
  {
    id: 'p3',
    title: 'Demo Environment Setup Video',
    description: 'Video walkthrough of setting up a sample app with Sentry instrumentation',
    type: 'video',
    link: '#',
    tags: ['Pre-Sale', 'Solutions Engineering', 'Video', 'Demo Script'],
    stage: 'poc'
  },

  // Technical Win
  {
    id: 't1',
    title: 'Architecture Review Deck',
    description: 'Technical deep-dive on Sentry architecture, security, and scalability',
    type: 'deck',
    link: '#',
    tags: ['Pre-Sale', 'Solutions Engineering', 'Deck', 'Technical', 'Enterprise'],
    stage: 'technical-win'
  },
  {
    id: 't2',
    title: 'Security & Compliance One-Pager',
    description: 'SOC2, GDPR, and data privacy overview for security reviews',
    type: 'one-pager',
    link: '#',
    tags: ['Pre-Sale', 'Solutions Engineering', 'One-Pager', 'Enterprise'],
    stage: 'technical-win'
  },
  {
    id: 't3',
    title: 'Integration Catalog',
    description: 'List of all supported SDKs, frameworks, and third-party integrations',
    type: 'guide',
    link: '#',
    tags: ['Pre-Sale', 'Solutions Engineering', 'Technical Guide'],
    stage: 'technical-win'
  },

  // Finalize Contracts
  {
    id: 'f1',
    title: 'Pricing Calculator',
    description: 'Interactive tool to calculate cost based on events, seats, and products',
    type: 'calculator',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'ROI Calculator', 'Business'],
    stage: 'finalize'
  },
  {
    id: 'f2',
    title: 'Enterprise Contract Template',
    description: 'Standard enterprise agreement with MSA and SOW templates',
    type: 'template',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'Template', 'Enterprise'],
    stage: 'finalize'
  },
  {
    id: 'f3',
    title: 'Business Value Summary',
    description: 'One-pager showing ROI, productivity gains, and MTTR improvements',
    type: 'one-pager',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'One-Pager', 'Business', 'Executive'],
    stage: 'finalize'
  },

  // Closing the Deal
  {
    id: 'c1',
    title: 'Executive Sponsor Email',
    description: 'Template email for executive outreach to accelerate deal closure',
    type: 'email',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'Email Template', 'Executive'],
    stage: 'closing'
  },
  {
    id: 'c2',
    title: 'Customer Success Story',
    description: 'Case study showing 40% reduction in MTTR for similar company',
    type: 'case-study',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'Case Study', 'Enterprise'],
    stage: 'closing'
  },
  {
    id: 'c3',
    title: 'Legal FAQ Document',
    description: 'Answers to common legal questions from procurement teams',
    type: 'guide',
    link: '#',
    tags: ['Pre-Sale', 'Sales', 'Technical Guide', 'Enterprise'],
    stage: 'closing'
  },

  // Onboarding
  {
    id: 'o1',
    title: 'Onboarding Kickoff Deck',
    description: '30-day onboarding plan with implementation milestones',
    type: 'deck',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Deck', 'Technical'],
    stage: 'onboarding'
  },
  {
    id: 'o2',
    title: 'Admin Training Guide',
    description: 'Step-by-step guide for customer admins on project setup and configuration',
    type: 'guide',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Technical Guide'],
    stage: 'onboarding'
  },
  {
    id: 'o3',
    title: 'Best Practices Checklist',
    description: 'Configuration checklist for optimal alerting, performance, and workflows',
    type: 'template',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Template', 'Technical'],
    stage: 'onboarding'
  },

  // QBR
  {
    id: 'qbr1',
    title: 'QBR Deck Template',
    description: 'Quarterly business review presentation showing value delivered',
    type: 'deck',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Deck', 'Business', 'Executive'],
    stage: 'qbr'
  },
  {
    id: 'qbr2',
    title: 'Health Score Calculator',
    description: 'Tool to assess customer health based on usage, adoption, and satisfaction',
    type: 'calculator',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'ROI Calculator'],
    stage: 'qbr'
  },
  {
    id: 'qbr3',
    title: 'Executive Summary Report',
    description: 'One-page summary of key metrics, wins, and upcoming initiatives',
    type: 'one-pager',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'One-Pager', 'Executive'],
    stage: 'qbr'
  },

  // Renewal
  {
    id: 'r1',
    title: 'Renewal Conversation Guide',
    description: 'Framework for renewal discussions with value recap and pricing',
    type: 'template',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Template', 'Business'],
    stage: 'renewal'
  },
  {
    id: 'r2',
    title: 'Value Delivered Report',
    description: 'Year-over-year analysis of errors caught, performance improvements, and ROI',
    type: 'one-pager',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'One-Pager', 'Business', 'Executive'],
    stage: 'renewal'
  },
  {
    id: 'r3',
    title: 'Risk Mitigation Playbook',
    description: 'Strategies for addressing at-risk renewals and winning back champions',
    type: 'guide',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Technical Guide'],
    stage: 'renewal'
  },

  // Expansion
  {
    id: 'e1',
    title: 'Expansion Opportunity Email',
    description: 'Template for introducing additional Sentry products to existing customers',
    type: 'email',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Email Template', 'Session Replay', 'Profiling'],
    stage: 'expansion'
  },
  {
    id: 'e2',
    title: 'Product Adoption Deck',
    description: 'Slide deck showing value of Session Replay and Profiling products',
    type: 'deck',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'Deck', 'Session Replay', 'Profiling'],
    stage: 'expansion'
  },
  {
    id: 'e3',
    title: 'ROI Impact Analysis',
    description: 'Calculator showing incremental value of additional products and users',
    type: 'calculator',
    link: '#',
    tags: ['Post-Sale', 'CSM', 'ROI Calculator', 'Business'],
    stage: 'expansion'
  },
]

const assetTypeIcons: Record<AssetType, any> = {
  'deck': Presentation,
  'one-pager': FileText,
  'template': FileText,
  'demo-script': Video,
  'battle-card': Shield,
  'case-study': FileText,
  'calculator': Calculator,
  'guide': FileText,
  'email': Mail,
  'video': Video,
}

const assetTypeLabels: Record<AssetType, string> = {
  'deck': 'Presentation',
  'one-pager': 'One-Pager',
  'template': 'Template',
  'demo-script': 'Demo Script',
  'battle-card': 'Battle Card',
  'case-study': 'Case Study',
  'calculator': 'Calculator',
  'guide': 'Guide',
  'email': 'Email Template',
  'video': 'Video',
}

// Available filter categories
const filterCategories = [
  // Role/Team
  { id: 'enterprise', label: 'Enterprise', group: 'Role' },
  { id: 'smb', label: 'SMB', group: 'Role' },
  { id: 'sales', label: 'Sales', group: 'Role' },
  { id: 'solutions-engineering', label: 'Solutions Engineering', group: 'Role' },
  { id: 'csm', label: 'CSM', group: 'Role' },
  // Stage Type
  { id: 'pre-sale', label: 'Pre-Sale', group: 'Stage' },
  { id: 'post-sale', label: 'Post-Sale', group: 'Stage' },
  { id: 'technical', label: 'Technical', group: 'Stage' },
  { id: 'business', label: 'Business', group: 'Stage' },
  { id: 'executive', label: 'Executive', group: 'Stage' },
  // Content Types
  { id: 'deck', label: 'Deck', group: 'Type' },
  { id: 'template', label: 'Template', group: 'Type' },
  { id: 'guide', label: 'Guide', group: 'Type' },
  { id: 'video', label: 'Video', group: 'Type' },
  { id: 'calculator', label: 'Calculator', group: 'Type' },
  // Products
  { id: 'error-monitoring', label: 'Error Monitoring', group: 'Product' },
  { id: 'performance-monitoring', label: 'Performance Monitoring', group: 'Product' },
  { id: 'session-replay', label: 'Session Replay', group: 'Product' },
  { id: 'profiling', label: 'Profiling', group: 'Product' },
]

type UserType = 'AE' | 'CSM' | 'SE' | 'SC' | 'Manager' | null

export default function CatalogPage() {
  const [activeStage, setActiveStage] = useState('qualify')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [userType, setUserType] = useState<UserType>(null)
  const [showUserTypeModal, setShowUserTypeModal] = useState(true)
  const [searchCount, setSearchCount] = useState(0)
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [showErrorSimulator, setShowErrorSimulator] = useState(false)

  const sessionStartTime = useRef<number>(Date.now())
  const lastClickTime = useRef<number>(0)
  const clickCount = useRef<number>(0)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)

  // Determine if we should search across all stages
  const isSearching = searchQuery.trim() !== '' || selectedCategories.length > 0

  // Set user context in Sentry when user type is selected
  useEffect(() => {
    if (userType) {
      Sentry.setUser({
        id: `user-${Date.now()}`,
        username: `${userType}-user`,
        userType: userType,
      })
      Sentry.setTag('user_type', userType)

      Sentry.captureMessage('User started session', {
        level: 'info',
        tags: { user_type: userType, event: 'session_start' }
      })

      Sentry.metrics.increment('catalog.session.started', 1, {
        tags: { user_type: userType }
      })
    }
  }, [userType])

  // Track session duration on unmount
  useEffect(() => {
    return () => {
      if (userType) {
        const sessionDuration = (Date.now() - sessionStartTime.current) / 1000
        Sentry.metrics.distribution('catalog.session.duration', sessionDuration, {
          tags: { user_type: userType },
          unit: 'second'
        })
      }
    }
  }, [userType])

  // Rage click detection
  const detectRageClick = () => {
    const now = Date.now()
    if (now - lastClickTime.current < 500) {
      clickCount.current++
      if (clickCount.current >= 3) {
        Sentry.captureMessage('Rage click detected', {
          level: 'warning',
          tags: {
            user_type: userType || 'unknown',
            frustration: 'rage_click',
            location: window.location.pathname
          }
        })
        Sentry.metrics.increment('catalog.frustration.rage_click', 1, {
          tags: { user_type: userType || 'unknown' }
        })
        clickCount.current = 0
      }
    } else {
      clickCount.current = 1
    }
    lastClickTime.current = now

    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, 1000)
  }

  // Track search events
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setSearchCount(prev => prev + 1)

      Sentry.captureMessage('User searched catalog', {
        level: 'info',
        tags: {
          user_type: userType || 'unknown',
          search_query: query
        }
      })

      Sentry.metrics.increment('catalog.search.performed', 1, {
        tags: { user_type: userType || 'unknown' }
      })
    }
  }

  // Track asset downloads/clicks
  const handleAssetClick = (asset: Asset) => {
    detectRageClick()

    const timeSinceSession = (Date.now() - sessionStartTime.current) / 1000

    // Track time to first download
    if (!hasDownloaded) {
      setHasDownloaded(true)
      Sentry.metrics.distribution('catalog.time_to_first_download', timeSinceSession, {
        tags: { user_type: userType || 'unknown' },
        unit: 'second'
      })

      Sentry.captureMessage('First asset downloaded', {
        level: 'info',
        tags: {
          user_type: userType || 'unknown',
          asset_id: asset.id,
          asset_title: asset.title,
          asset_type: asset.type,
          stage: asset.stage
        },
        extra: {
          time_to_first_download_seconds: timeSinceSession,
          search_count_before_download: searchCount
        }
      })
    }

    // Track search to download ratio
    if (searchCount > 0) {
      Sentry.metrics.gauge('catalog.searches_before_download', searchCount, {
        tags: { user_type: userType || 'unknown', asset_type: asset.type }
      })
    }

    // Track asset click
    Sentry.captureMessage('Asset clicked', {
      level: 'info',
      tags: {
        user_type: userType || 'unknown',
        asset_id: asset.id,
        asset_title: asset.title,
        asset_type: asset.type,
        asset_stage: asset.stage
      }
    })

    Sentry.metrics.increment('catalog.asset.clicked', 1, {
      tags: {
        user_type: userType || 'unknown',
        asset_id: asset.id,
        asset_type: asset.type,
        stage: asset.stage
      }
    })
  }

  // Error simulation functions
  const simulateSearchError = () => {
    const error = new Error('Search functionality temporarily unavailable')
    Sentry.captureException(error, {
      level: 'error',
      tags: {
        user_type: userType || 'unknown',
        error_type: 'search_error',
        simulated: 'true'
      },
      extra: {
        search_query: searchQuery,
        context: 'User attempted to search but service failed'
      }
    })
    alert('Simulated Error: Search failed')
  }

  const simulateDownloadError = () => {
    const error = new Error('Asset download failed - file not accessible')
    Sentry.captureException(error, {
      level: 'error',
      tags: {
        user_type: userType || 'unknown',
        error_type: 'download_error',
        simulated: 'true'
      }
    })
    alert('Simulated Error: Download failed')
  }

  const simulateTabLoadError = () => {
    const error = new Error('Tab content failed to load - timeout error')
    Sentry.captureException(error, {
      level: 'error',
      tags: {
        user_type: userType || 'unknown',
        error_type: 'tab_load_error',
        simulated: 'true',
        stage: activeStage
      }
    })
    alert('Simulated Error: Tab failed to load')
  }

  const simulateButtonClickError = () => {
    const error = new Error('Button click handler failed - undefined function')
    Sentry.captureException(error, {
      level: 'error',
      tags: {
        user_type: userType || 'unknown',
        error_type: 'ui_interaction_error',
        simulated: 'true'
      }
    })
    alert('Simulated Error: Button click failed')
  }

  // Filter assets by stage (or all stages if searching), search, and categories
  const currentAssets = sampleAssets.filter(asset => {
    // Filter by stage (skip this filter if searching/filtering)
    if (!isSearching && asset.stage !== activeStage) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = asset.title.toLowerCase().includes(query)
      const matchesDescription = asset.description.toLowerCase().includes(query)
      const matchesTags = asset.tags.some(tag => tag.toLowerCase().includes(query))
      if (!matchesTitle && !matchesDescription && !matchesTags) return false
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      const hasMatchingTag = asset.tags.some(tag =>
        selectedCategories.some(cat =>
          tag.toLowerCase().replace(/\s+/g, '-') === cat ||
          tag.toLowerCase() === cat.replace(/-/g, ' ')
        )
      )
      if (!hasMatchingTag) return false
    }

    return true
  })

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c14] via-[#1e1a2a] to-[#2a2438]">
      {/* User Type Selection Modal */}
      {showUserTypeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <Card className="bg-[#2a2438] border-[#362552] p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-[#e8e4f0] mb-2">Welcome to GTM Asset Catalog</h2>
            <p className="text-[#9086a3] mb-6">Select your role to get started</p>

            <div className="space-y-3">
              {(['AE', 'CSM', 'SE', 'SC', 'Manager'] as UserType[]).map((type) => (
                <Button
                  key={type}
                  onClick={() => {
                    setUserType(type)
                    setShowUserTypeModal(false)
                  }}
                  className="w-full bg-[#7553ff] hover:bg-[#8c6fff] text-white justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  {type === 'AE' && 'Account Executive'}
                  {type === 'CSM' && 'Customer Success Manager'}
                  {type === 'SE' && 'Solutions Engineer'}
                  {type === 'SC' && 'Solutions Consultant'}
                  {type === 'Manager' && 'Manager'}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#362552] bg-[#1e1a2a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7553ff] to-[#ff45a8] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#e8e4f0]">
                  GTM Asset Catalog
                </h1>
                <p className="text-sm text-[#9086a3]">
                  Resources for every stage of the customer journey
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userType && (
                <Badge className="bg-[#7553ff]/20 text-[#7553ff] border-[#7553ff]/30">
                  <User className="w-3 h-3 mr-1" />
                  {userType}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowErrorSimulator(!showErrorSimulator)}
                className="border-[#ff45a8]/30 text-[#ff45a8] hover:bg-[#ff45a8]/10"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Error Simulator
              </Button>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-[#362552] text-[#e8e4f0] hover:bg-[#2a2438]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Error Simulator Panel */}
      {showErrorSimulator && (
        <div className="bg-[#ff45a8]/10 border-b border-[#ff45a8]/30">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-[#ff45a8] font-semibold">Simulate Errors:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={simulateSearchError}
                className="border-[#ff45a8]/30 text-[#e8e4f0] hover:bg-[#ff45a8]/20 text-xs"
              >
                Search Error
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={simulateDownloadError}
                className="border-[#ff45a8]/30 text-[#e8e4f0] hover:bg-[#ff45a8]/20 text-xs"
              >
                Download Error
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={simulateTabLoadError}
                className="border-[#ff45a8]/30 text-[#e8e4f0] hover:bg-[#ff45a8]/20 text-xs"
              >
                Tab Load Error
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={simulateButtonClickError}
                className="border-[#ff45a8]/30 text-[#e8e4f0] hover:bg-[#ff45a8]/20 text-xs"
              >
                Button Click Error
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Tabs */}
      <div className="border-b border-[#362552] bg-[#1e1a2a]/50 backdrop-blur-sm sticky top-[73px] z-40">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
                  ${activeStage === stage.id
                    ? 'text-[#7553ff] border-b-2 border-[#7553ff] bg-[#7553ff]/5'
                    : 'text-[#9086a3] hover:text-[#e8e4f0] hover:bg-[#2a2438]/50'
                  }
                `}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9086a3]" />
            <Input
              type="text"
              placeholder="Search assets by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 bg-[#2a2438] border-[#362552] text-[#e8e4f0] placeholder:text-[#9086a3] h-12"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9086a3] hover:text-[#e8e4f0]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#9086a3]">
                Filter by category ({selectedCategories.length} selected)
              </p>
              {(searchQuery || selectedCategories.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-[#362552] text-[#9086a3] hover:bg-[#2a2438] h-8"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {filterCategories.map((category) => (
                <Badge
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`cursor-pointer transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'bg-[#7553ff] text-white border-[#7553ff] hover:bg-[#8c6fff]'
                      : 'bg-[#2a2438] text-[#9086a3] border-[#362552] hover:border-[#7553ff]/50 hover:text-[#e8e4f0]'
                  }`}
                  variant="outline"
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Info & Results Count */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#e8e4f0] mb-2">
            {isSearching ? 'Search Results' : stages.find(s => s.id === activeStage)?.label}
          </h2>
          <p className="text-[#9086a3]">
            {currentAssets.length} {currentAssets.length === 1 ? 'resource' : 'resources'}
            {isSearching ? ' found across all stages' : ' available for this stage'}
          </p>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAssets.map((asset) => {
            const Icon = assetTypeIcons[asset.type]
            const assetStage = stages.find(s => s.id === asset.stage)
            return (
              <Card
                key={asset.id}
                className="bg-[#2a2438] border-[#362552] hover:border-[#7553ff]/50 transition-all group"
              >
                <div className="p-6">
                  {/* Asset Type Icon & Stage Badge (when searching) */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#7553ff]/10 rounded-lg flex items-center justify-center group-hover:bg-[#7553ff]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#7553ff]" />
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Badge className="bg-[#7553ff]/10 text-[#7553ff] border-[#7553ff]/20">
                        {assetTypeLabels[asset.type]}
                      </Badge>
                      {isSearching && assetStage && (
                        <Badge variant="outline" className="text-xs border-[#362552] text-[#9086a3]">
                          {assetStage.label}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-[#e8e4f0] mb-2 group-hover:text-[#7553ff] transition-colors">
                    {asset.title}
                  </h3>
                  <p className="text-sm text-[#9086a3] mb-4 line-clamp-2">
                    {asset.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {asset.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-[#362552] text-[#9086a3]"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {asset.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-[#362552] text-[#9086a3]"
                      >
                        +{asset.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-[#7553ff] hover:bg-[#8c6fff] text-white"
                    onClick={() => handleAssetClick(asset)}
                    asChild
                  >
                    <a href={asset.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Resource
                    </a>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {currentAssets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#7553ff]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#7553ff]" />
            </div>
            <h3 className="text-xl font-semibold text-[#e8e4f0] mb-2">
              No resources yet
            </h3>
            <p className="text-[#9086a3] mb-4">
              Resources for this stage will be added soon.
            </p>
            <Link href="/admin">
              <Button className="bg-[#7553ff] hover:bg-[#8c6fff] text-white">
                Add Resources
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
