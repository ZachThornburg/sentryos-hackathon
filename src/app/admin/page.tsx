'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'

interface Asset {
  id: string
  title: string
  description: string
  type: string
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

const assetTypes = [
  'deck',
  'one-pager',
  'template',
  'demo-script',
  'battle-card',
  'case-study',
  'calculator',
  'guide',
  'email',
  'video',
]

const availableTags = [
  // Role/Team
  'Enterprise',
  'SMB',
  'Sales',
  'Solutions Engineering',
  'CSM',
  'Solutions Consulting',
  // Stage Type
  'Pre-Sale',
  'Post-Sale',
  'Technical',
  'Business',
  'Executive',
  // Content Type
  'Deck',
  'One-Pager',
  'Template',
  'Demo Script',
  'Battle Card',
  'Case Study',
  'ROI Calculator',
  'Technical Guide',
  'Email Template',
  'Video',
  // Products
  'Error Monitoring',
  'Performance Monitoring',
  'Session Replay',
  'Cron Monitoring',
  'Profiling',
]

export default function AdminPage() {
  const [showNewAssetForm, setShowNewAssetForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'deck',
    link: '',
    stage: 'qualify',
    tags: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save asset to database
    console.log('Saving asset:', formData)
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'deck',
      link: '',
      stage: 'qualify',
      tags: [],
    })
    setShowNewAssetForm(false)
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c14] via-[#1e1a2a] to-[#2a2438]">
      {/* Header */}
      <header className="border-b border-[#362552] bg-[#1e1a2a]/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/catalog">
                <Button
                  variant="outline"
                  className="border-[#362552] text-[#e8e4f0] hover:bg-[#2a2438]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Catalog
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#e8e4f0]">
                  Admin Panel
                </h1>
                <p className="text-sm text-[#9086a3]">
                  Manage GTM assets and resources
                </p>
              </div>
            </div>
            {!showNewAssetForm && (
              <Button
                onClick={() => setShowNewAssetForm(true)}
                className="bg-[#7553ff] hover:bg-[#8c6fff] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Asset
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* New Asset Form */}
        {showNewAssetForm && (
          <Card className="bg-[#2a2438] border-[#362552] mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#e8e4f0]">
                  Add New Asset
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowNewAssetForm(false)}
                  className="border-[#362552] text-[#9086a3] hover:bg-[#1e1a2a]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-[#e8e4f0]">
                    Asset Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Discovery Call Template"
                    className="bg-[#1e1a2a] border-[#362552] text-[#e8e4f0] mt-2"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-[#e8e4f0]">
                    Description *
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of what this asset is and when to use it..."
                    className="w-full mt-2 bg-[#1e1a2a] border border-[#362552] text-[#e8e4f0] rounded-md px-3 py-2 min-h-[100px] placeholder:text-[#9086a3]"
                    required
                  />
                </div>

                {/* Type & Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="type" className="text-[#e8e4f0]">
                      Asset Type *
                    </Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full mt-2 bg-[#1e1a2a] border border-[#362552] text-[#e8e4f0] rounded-md px-3 py-2"
                      required
                    >
                      {assetTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="stage" className="text-[#e8e4f0]">
                      Lifecycle Stage *
                    </Label>
                    <select
                      id="stage"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full mt-2 bg-[#1e1a2a] border border-[#362552] text-[#e8e4f0] rounded-md px-3 py-2"
                      required
                    >
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Link */}
                <div>
                  <Label htmlFor="link" className="text-[#e8e4f0]">
                    Link or File URL *
                  </Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://..."
                    className="bg-[#1e1a2a] border-[#362552] text-[#e8e4f0] mt-2"
                    required
                  />
                  <p className="text-xs text-[#9086a3] mt-1">
                    Google Drive, Notion, or any accessible URL
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-[#e8e4f0] mb-3 block">
                    Tags ({formData.tags.length} selected)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`cursor-pointer transition-all ${
                          formData.tags.includes(tag)
                            ? 'bg-[#7553ff] text-white border-[#7553ff]'
                            : 'bg-[#1e1a2a] text-[#9086a3] border-[#362552] hover:border-[#7553ff]/50'
                        }`}
                        variant="outline"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewAssetForm(false)}
                    className="border-[#362552] text-[#9086a3] hover:bg-[#1e1a2a]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#7553ff] hover:bg-[#8c6fff] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Asset
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        {!showNewAssetForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#2a2438] border-[#362552] p-6">
              <div className="text-3xl font-bold text-[#7553ff] mb-1">27</div>
              <div className="text-sm text-[#9086a3]">Total Assets</div>
            </Card>
            <Card className="bg-[#2a2438] border-[#362552] p-6">
              <div className="text-3xl font-bold text-[#ff45a8] mb-1">9</div>
              <div className="text-sm text-[#9086a3]">Lifecycle Stages</div>
            </Card>
            <Card className="bg-[#2a2438] border-[#362552] p-6">
              <div className="text-3xl font-bold text-[#7553ff] mb-1">10</div>
              <div className="text-sm text-[#9086a3]">Asset Types</div>
            </Card>
          </div>
        )}

        {/* Assets by Stage */}
        {!showNewAssetForm && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#e8e4f0]">
              Assets by Stage
            </h2>
            {stages.map((stage) => (
              <Card key={stage.id} className="bg-[#2a2438] border-[#362552]">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#e8e4f0]">
                      {stage.label}
                    </h3>
                    <Badge className="bg-[#7553ff]/10 text-[#7553ff] border-[#7553ff]/20">
                      3 assets
                    </Badge>
                  </div>
                  <p className="text-sm text-[#9086a3]">
                    Manage resources for the {stage.label.toLowerCase()} stage
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
