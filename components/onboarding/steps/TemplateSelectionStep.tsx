'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Eye, Check, Sparkles, Monitor, Smartphone, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface TemplateSelectionStepProps {
  data: any
  businessType?: string
  onNext: (data?: any) => void
  onBack: () => void
}

interface Template {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  preview: string
  mobilePreview: string
  rating: number
  reviews: number
  businessTypes: string[]
  premium: boolean
  new: boolean
}

// Template data - in production, this would come from an API
const templates: Template[] = [
  {
    id: 'dawn',
    name: 'Dawn',
    category: 'E-commerce',
    description: 'Clean, modern e-commerce template perfect for any online store',
    features: ['Product catalog', 'Shopping cart', 'Customer accounts', 'Blog'],
    preview: '/templates/dawn-preview.jpg',
    mobilePreview: '/templates/dawn-mobile.jpg',
    rating: 4.8,
    reviews: 324,
    businessTypes: ['retail', 'creative', 'other'],
    premium: false,
    new: false
  },
  {
    id: 'corporate',
    name: 'Corporate Pro',
    category: 'Business',
    description: 'Professional template for corporate and business websites',
    features: ['Service pages', 'Team profiles', 'Case studies', 'Contact forms'],
    preview: '/templates/corporate-preview.jpg',
    mobilePreview: '/templates/corporate-mobile.jpg',
    rating: 4.9,
    reviews: 256,
    businessTypes: ['professional', 'technology', 'other'],
    premium: false,
    new: false
  },
  {
    id: 'restaurant-elegant',
    name: 'Restaurant Elegant',
    category: 'Food & Dining',
    description: 'Sophisticated design for restaurants and fine dining',
    features: ['Menu display', 'Reservations', 'Gallery', 'Reviews'],
    preview: '/templates/restaurant-preview.jpg',
    mobilePreview: '/templates/restaurant-mobile.jpg',
    rating: 4.7,
    reviews: 189,
    businessTypes: ['restaurant'],
    premium: true,
    new: true
  },
  {
    id: 'medical',
    name: 'Medical Plus',
    category: 'Healthcare',
    description: 'Clean and trustworthy design for medical practices',
    features: ['Appointment booking', 'Service info', 'Doctor profiles', 'Patient portal'],
    preview: '/templates/medical-preview.jpg',
    mobilePreview: '/templates/medical-mobile.jpg',
    rating: 4.9,
    reviews: 145,
    businessTypes: ['health'],
    premium: true,
    new: false
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'Showcase your work with this stunning portfolio template',
    features: ['Project gallery', 'About section', 'Contact form', 'Blog'],
    preview: '/templates/portfolio-preview.jpg',
    mobilePreview: '/templates/portfolio-mobile.jpg',
    rating: 4.6,
    reviews: 412,
    businessTypes: ['creative', 'personal'],
    premium: false,
    new: false
  },
  {
    id: 'saas',
    name: 'SaaS Startup',
    category: 'Technology',
    description: 'Modern template for software and tech startups',
    features: ['Feature sections', 'Pricing tables', 'Demo booking', 'Documentation'],
    preview: '/templates/saas-preview.jpg',
    mobilePreview: '/templates/saas-mobile.jpg',
    rating: 4.8,
    reviews: 278,
    businessTypes: ['technology'],
    premium: true,
    new: true
  },
  {
    id: 'blog',
    name: 'Content Hub',
    category: 'Blog',
    description: 'Perfect for bloggers and content creators',
    features: ['Article layouts', 'Categories', 'Comments', 'Newsletter'],
    preview: '/templates/blog-preview.jpg',
    mobilePreview: '/templates/blog-mobile.jpg',
    rating: 4.5,
    reviews: 523,
    businessTypes: ['personal', 'other'],
    premium: false,
    new: false
  },
  {
    id: 'landing-page',
    name: 'Landing Page Pro',
    category: 'Marketing',
    description: 'High-converting landing page for campaigns',
    features: ['Hero sections', 'CTAs', 'Testimonials', 'Lead capture'],
    preview: '/templates/landing-preview.jpg',
    mobilePreview: '/templates/landing-mobile.jpg',
    rating: 4.7,
    reviews: 367,
    businessTypes: ['other'],
    premium: false,
    new: false
  }
]

export default function TemplateSelectionStep({ 
  data, 
  businessType, 
  onNext, 
  onBack 
}: TemplateSelectionStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(data.templateId || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  // Filter templates based on business type and search
  const filteredTemplates = templates.filter(template => {
    const matchesBusinessType = !businessType || 
      template.businessTypes.includes(businessType) ||
      template.businessTypes.includes('other')
    
    const matchesSearch = !searchTerm ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      template.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesBusinessType && matchesSearch && matchesCategory
  })

  // Get recommended templates for business type
  const recommendedTemplates = businessType 
    ? templates.filter(t => t.businessTypes.includes(businessType))
    : []

  const categories = ['all', ...new Set(templates.map(t => t.category))]

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowPreview(false)
  }

  const handleContinue = () => {
    if (selectedTemplate) {
      const selected = templates.find(t => t.id === selectedTemplate)
      onNext({
        templateId: selectedTemplate,
        templateName: selected?.name,
        templateCategory: selected?.category,
        features: selected?.features
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Template</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a professional template that matches your brand
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-8">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Recommended Templates */}
      {recommendedTemplates.length > 0 && !searchTerm && selectedCategory === 'all' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <p className="font-medium">Recommended for your business type</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedTemplates.slice(0, 3).map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={selectedTemplate === template.id}
                onSelect={handleSelect}
                onPreview={handlePreview}
                recommended
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="space-y-3">
        <p className="font-medium text-sm text-gray-600 dark:text-gray-400">
          {filteredTemplates.length} templates available
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={selectedTemplate === template.id}
              onSelect={handleSelect}
              onPreview={handlePreview}
            />
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedTemplate}
          size="lg"
        >
          Continue with {templates.find(t => t.id === selectedTemplate)?.name || 'Template'}
        </Button>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <PreviewModal
                template={previewTemplate}
                mode={previewMode}
                onModeChange={setPreviewMode}
                onClose={() => setShowPreview(false)}
                onSelect={() => {
                  handleSelect(previewTemplate.id)
                  setShowPreview(false)
                }}
                selected={selectedTemplate === previewTemplate.id}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Template Card Component
function TemplateCard({ 
  template, 
  selected, 
  onSelect, 
  onPreview,
  recommended = false
}: {
  template: Template
  selected: boolean
  onSelect: (id: string) => void
  onPreview: (template: Template) => void
  recommended?: boolean
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`
          relative overflow-hidden cursor-pointer transition-all
          ${selected ? 'ring-2 ring-blue-600' : 'hover:shadow-lg'}
        `}
        onClick={() => onSelect(template.id)}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          {recommended && (
            <Badge className="bg-yellow-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Recommended
            </Badge>
          )}
          {template.premium && (
            <Badge variant="secondary">Premium</Badge>
          )}
          {template.new && (
            <Badge className="bg-green-500 text-white">New</Badge>
          )}
        </div>

        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-2 right-2 z-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Preview Image */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative group">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400">
              {/* Placeholder for template preview */}
              <Monitor className="w-12 h-12" />
            </div>
          </div>
          
          {/* Preview button overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPreview(template)
              }}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </div>
        </div>

        {/* Template Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {template.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{template.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({template.reviews} reviews)</span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
              >
                {feature}
              </span>
            ))}
            {template.features.length > 3 && (
              <span className="text-xs px-2 py-1 text-gray-500">
                +{template.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Preview Modal Component
function PreviewModal({
  template,
  mode,
  onModeChange,
  onClose,
  onSelect,
  selected
}: {
  template: Template
  mode: 'desktop' | 'mobile'
  onModeChange: (mode: 'desktop' | 'mobile') => void
  onClose: () => void
  onSelect: () => void
  selected: boolean
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {template.category} • {template.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Device Toggle */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={mode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('desktop')}
              className="gap-2"
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </Button>
            <Button
              variant={mode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('mobile')}
              className="gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-8 overflow-auto">
        <div className={`
          mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden
          ${mode === 'mobile' ? 'max-w-sm' : 'max-w-full'}
        `}>
          {/* Placeholder for actual preview */}
          <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Monitor className="w-16 h-16 text-gray-400 mx-auto" />
              <p className="text-gray-500">Template Preview</p>
              <p className="text-sm text-gray-400">
                Live preview will load here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{template.rating}</span>
            <span className="text-sm text-gray-500">({template.reviews} reviews)</span>
          </div>
          {template.premium && (
            <Badge variant="secondary">Premium Template</Badge>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSelect} className="gap-2">
            {selected ? (
              <>
                <Check className="w-4 h-4" />
                Selected
              </>
            ) : (
              <>
                Use This Template
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}