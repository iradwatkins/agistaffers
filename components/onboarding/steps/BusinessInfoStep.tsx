'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Info,
  Upload,
  Image as ImageIcon 
} from 'lucide-react'

interface BusinessInfoStepProps {
  data: any
  onNext: (data?: any) => void
  onBack: () => void
}

export default function BusinessInfoStep({ data, onNext, onBack }: BusinessInfoStepProps) {
  const [formData, setFormData] = useState({
    businessName: data.businessName || '',
    tagline: data.tagline || '',
    description: data.description || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    country: data.country || 'United States',
    website: data.website || '',
    logo: data.logo || null,
    ...data
  })

  const [errors, setErrors] = useState<any>({})
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logo || null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }))
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, logo: 'Please upload an image file' })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, logo: 'Image must be less than 5MB' })
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        setFormData(prev => ({ ...prev, logo: reader.result }))
      }
      reader.readAsDataURL(file)
      
      // Clear error
      if (errors.logo) {
        setErrors((prev: any) => ({ ...prev, logo: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    if (formData.website && !/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tell us about your business</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We'll use this information to personalize your website
        </p>
      </div>

      <div className="grid gap-6">
        {/* Logo Upload */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <Label>Business Logo (Optional)</Label>
            </div>
            
            <div className="flex items-start gap-6">
              {/* Logo Preview */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Label 
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </Label>
                <p className="text-xs text-gray-500">
                  PNG, JPG or SVG. Max size 5MB. Recommended: 512x512px
                </p>
                {errors.logo && (
                  <p className="text-xs text-red-500">{errors.logo}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">
                  Business Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your Company Name"
                  className={errors.businessName ? 'border-red-500' : ''}
                />
                {errors.businessName && (
                  <p className="text-xs text-red-500">{errors.businessName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline (Optional)</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="Your business slogan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us what your business does..."
                rows={4}
              />
              <p className="text-xs text-gray-500">
                This will be used for your website's meta description and about section
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold">Contact Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@business.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Current Website (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.example.com"
                  className={`pl-10 ${errors.website ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.website && (
                <p className="text-xs text-red-500">{errors.website}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Location (Optional) */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold">Location (Optional)</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="United States"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900 dark:text-blue-100">
          <p className="font-medium mb-1">Why we need this information:</p>
          <ul className="space-y-1 text-blue-800 dark:text-blue-200">
            <li>• To personalize your website content and design</li>
            <li>• To set up contact forms and location maps</li>
            <li>• To optimize your site for local SEO</li>
            <li>• To comply with legal requirements for business websites</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} size="lg">
          Continue
        </Button>
      </div>
    </div>
  )
}