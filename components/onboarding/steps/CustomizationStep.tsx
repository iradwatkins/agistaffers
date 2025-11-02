'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Palette, 
  Type, 
  Layout,
  Sparkles,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Image as ImageIcon,
  Upload,
  Wand2
} from 'lucide-react'
import { motion } from 'framer-motion'

interface CustomizationStepProps {
  data: any
  template?: string
  onNext: (data?: any) => void
  onBack: () => void
}

const colorSchemes = [
  { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#60A5FA', accent: '#2563EB' },
  { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#A78BFA', accent: '#7C3AED' },
  { id: 'green', name: 'Forest Green', primary: '#10B981', secondary: '#34D399', accent: '#059669' },
  { id: 'red', name: 'Ruby Red', primary: '#EF4444', secondary: '#F87171', accent: '#DC2626' },
  { id: 'orange', name: 'Sunset Orange', primary: '#F97316', secondary: '#FB923C', accent: '#EA580C' },
  { id: 'pink', name: 'Rose Pink', primary: '#EC4899', secondary: '#F472B6', accent: '#DB2777' },
  { id: 'teal', name: 'Teal Wave', primary: '#14B8A6', secondary: '#2DD4BF', accent: '#0D9488' },
  { id: 'custom', name: 'Custom Colors', primary: '#000000', secondary: '#666666', accent: '#999999' }
]

const fontPairs = [
  { id: 'modern', name: 'Modern', heading: 'Inter', body: 'Inter' },
  { id: 'classic', name: 'Classic', heading: 'Playfair Display', body: 'Source Sans Pro' },
  { id: 'elegant', name: 'Elegant', heading: 'Cormorant Garamond', body: 'Montserrat' },
  { id: 'playful', name: 'Playful', heading: 'Fredoka', body: 'Open Sans' },
  { id: 'professional', name: 'Professional', heading: 'IBM Plex Sans', body: 'IBM Plex Sans' },
  { id: 'tech', name: 'Tech', heading: 'Space Grotesk', body: 'DM Sans' }
]

const layoutOptions = [
  { id: 'standard', name: 'Standard', description: 'Classic layout with header, content, footer' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with sticky navigation' },
  { id: 'minimal', name: 'Minimal', description: 'Clean, spacious design with focus on content' },
  { id: 'bold', name: 'Bold', description: 'Eye-catching design with large imagery' }
]

export default function CustomizationStep({ 
  data, 
  template, 
  onNext, 
  onBack 
}: CustomizationStepProps) {
  const [customization, setCustomization] = useState({
    colorScheme: data.colorScheme || 'blue',
    customColors: data.customColors || { primary: '#3B82F6', secondary: '#60A5FA', accent: '#2563EB' },
    fontPair: data.fontPair || 'modern',
    layout: data.layout || 'standard',
    darkMode: data.darkMode ?? true,
    animations: data.animations ?? true,
    roundedCorners: data.roundedCorners || 8,
    spacing: data.spacing || 'normal',
    headerImage: data.headerImage || null,
    favicon: data.favicon || null
  })

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  const handleColorSchemeChange = (schemeId: string) => {
    const scheme = colorSchemes.find(s => s.id === schemeId)
    if (scheme) {
      setCustomization(prev => ({
        ...prev,
        colorScheme: schemeId,
        customColors: {
          primary: scheme.primary,
          secondary: scheme.secondary,
          accent: scheme.accent
        }
      }))
    }
  }

  const handleCustomColorChange = (colorType: string, value: string) => {
    setCustomization(prev => ({
      ...prev,
      colorScheme: 'custom',
      customColors: {
        ...prev.customColors,
        [colorType]: value
      }
    }))
  }

  const handleSliderChange = (property: string, value: number[]) => {
    setCustomization(prev => ({
      ...prev,
      [property]: value[0]
    }))
  }

  const handleToggle = (property: string, value: boolean) => {
    setCustomization(prev => ({
      ...prev,
      [property]: value
    }))
  }

  const handleImageUpload = (type: 'headerImage' | 'favicon', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCustomization(prev => ({
          ...prev,
          [type]: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContinue = () => {
    onNext(customization)
  }

  const currentColorScheme = colorSchemes.find(s => s.id === customization.colorScheme) || colorSchemes[0]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Customize your website</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Make it yours with colors, fonts, and style options
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customization Options */}
        <div className="space-y-6">
          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Scheme
              </CardTitle>
              <CardDescription>
                Choose a color palette for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {colorSchemes.map(scheme => (
                  <button
                    key={scheme.id}
                    onClick={() => handleColorSchemeChange(scheme.id)}
                    className={`
                      p-3 rounded-lg border-2 transition-all
                      ${customization.colorScheme === scheme.id 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.accent }}
                        />
                      </div>
                      <span className="text-sm font-medium">{scheme.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Color Inputs */}
              {customization.colorScheme === 'custom' && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Primary</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={customization.customColors.primary}
                          onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                          className="w-full h-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Secondary</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={customization.customColors.secondary}
                          onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                          className="w-full h-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Accent</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={customization.customColors.accent}
                          onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                          className="w-full h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Typography
              </CardTitle>
              <CardDescription>
                Select font pairing for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={customization.fontPair} 
                onValueChange={(value) => setCustomization(prev => ({ ...prev, fontPair: value }))}
              >
                <div className="space-y-3">
                  {fontPairs.map(pair => (
                    <div key={pair.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={pair.id} id={pair.id} />
                      <Label htmlFor={pair.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{pair.name}</span>
                        <p className="text-xs text-gray-500">
                          Heading: {pair.heading} • Body: {pair.body}
                        </p>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Layout & Style */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Layout & Style
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Layout Option */}
              <div className="space-y-2">
                <Label>Layout Style</Label>
                <RadioGroup 
                  value={customization.layout} 
                  onValueChange={(value) => setCustomization(prev => ({ ...prev, layout: value }))}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {layoutOptions.map(option => (
                      <div key={option.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={option.id} id={`layout-${option.id}`} className="mt-1" />
                        <Label htmlFor={`layout-${option.id}`} className="cursor-pointer">
                          <span className="font-medium text-sm">{option.name}</span>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Corner Radius */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Corner Radius</Label>
                  <span className="text-sm text-gray-500">{customization.roundedCorners}px</span>
                </div>
                <Slider
                  value={[customization.roundedCorners]}
                  onValueChange={(value) => handleSliderChange('roundedCorners', value)}
                  min={0}
                  max={24}
                  step={2}
                />
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode Support</Label>
                    <p className="text-xs text-gray-500">Enable dark theme option</p>
                  </div>
                  <Switch
                    checked={customization.darkMode}
                    onCheckedChange={(checked) => handleToggle('darkMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-xs text-gray-500">Enable smooth transitions</p>
                  </div>
                  <Switch
                    checked={customization.animations}
                    onCheckedChange={(checked) => handleToggle('animations', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <Button
                    variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`
                ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : 'w-full'}
              `}>
                <div 
                  className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900"
                  style={{ borderRadius: `${customization.roundedCorners}px` }}
                >
                  {/* Preview Header */}
                  <div 
                    className="p-4 text-white"
                    style={{ backgroundColor: currentColorScheme.primary }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Your Business</span>
                      <div className="flex gap-4 text-sm">
                        <span>Home</span>
                        <span>About</span>
                        <span>Contact</span>
                      </div>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">Welcome to Your Website</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      This is how your website will look with your selected customization options.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className="p-4 text-white rounded"
                        style={{ 
                          backgroundColor: currentColorScheme.secondary,
                          borderRadius: `${customization.roundedCorners / 2}px`
                        }}
                      >
                        <h3 className="font-semibold">Feature One</h3>
                        <p className="text-sm opacity-90">Description here</p>
                      </div>
                      <div 
                        className="p-4 text-white rounded"
                        style={{ 
                          backgroundColor: currentColorScheme.accent,
                          borderRadius: `${customization.roundedCorners / 2}px`
                        }}
                      >
                        <h3 className="font-semibold">Feature Two</h3>
                        <p className="text-sm opacity-90">Description here</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      style={{ 
                        backgroundColor: currentColorScheme.primary,
                        borderRadius: `${customization.roundedCorners / 2}px`
                      }}
                    >
                      Call to Action
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestion */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Wand2 className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  AI Recommendation
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Based on your business type, we recommend the {colorSchemes[0].name} color scheme with {fontPairs[0].name} typography for optimal engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} size="lg" className="gap-2">
          Continue
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}