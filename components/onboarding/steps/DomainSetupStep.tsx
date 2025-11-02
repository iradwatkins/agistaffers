'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Globe, 
  Check, 
  X, 
  Loader2, 
  Info, 
  ExternalLink,
  Shield,
  Zap,
  Copy,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

interface DomainSetupStepProps {
  data: any
  onNext: (data?: any) => void
  onBack: () => void
}

type DomainOption = 'subdomain' | 'existing' | 'purchase' | 'skip'

export default function DomainSetupStep({ data, onNext, onBack }: DomainSetupStepProps) {
  const [domainOption, setDomainOption] = useState<DomainOption>(data.option || 'subdomain')
  const [subdomain, setSubdomain] = useState(data.subdomain || '')
  const [customDomain, setCustomDomain] = useState(data.customDomain || '')
  const [isChecking, setIsChecking] = useState(false)
  const [availability, setAvailability] = useState<'available' | 'taken' | null>(null)
  const [dnsRecords, setDnsRecords] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSubdomain(value)
    setAvailability(null)
    if (errors.subdomain) {
      setErrors({ ...errors, subdomain: '' })
    }
  }

  const checkSubdomainAvailability = async () => {
    if (!subdomain) {
      setErrors({ ...errors, subdomain: 'Please enter a subdomain' })
      return
    }

    if (subdomain.length < 3) {
      setErrors({ ...errors, subdomain: 'Subdomain must be at least 3 characters' })
      return
    }

    setIsChecking(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock availability check
    const taken = ['test', 'demo', 'admin', 'app'].includes(subdomain)
    setAvailability(taken ? 'taken' : 'available')
    setIsChecking(false)
  }

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value.toLowerCase())
    if (errors.customDomain) {
      setErrors({ ...errors, customDomain: '' })
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (domainOption === 'subdomain') {
      if (!subdomain) {
        newErrors.subdomain = 'Please enter a subdomain'
      } else if (availability !== 'available') {
        newErrors.subdomain = 'Please check subdomain availability'
      }
    } else if (domainOption === 'existing') {
      if (!customDomain) {
        newErrors.customDomain = 'Please enter your domain'
      } else if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(customDomain)) {
        newErrors.customDomain = 'Please enter a valid domain (e.g., example.com)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (domainOption === 'skip' || validateForm()) {
      const domainData: any = { option: domainOption }
      
      if (domainOption === 'subdomain') {
        domainData.subdomain = subdomain
        domainData.fullDomain = `${subdomain}.agistaffers.com`
      } else if (domainOption === 'existing') {
        domainData.customDomain = customDomain
        domainData.fullDomain = customDomain
      } else if (domainOption === 'skip') {
        domainData.fullDomain = null
        domainData.temporary = `site-${Date.now()}.agistaffers.com`
      }
      
      onNext(domainData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Set up your domain</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose how you want to access your website
        </p>
      </div>

      <RadioGroup value={domainOption} onValueChange={(value) => setDomainOption(value as DomainOption)}>
        <div className="space-y-4">
          {/* Free Subdomain Option */}
          <Card className={domainOption === 'subdomain' ? 'ring-2 ring-blue-600' : ''}>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <RadioGroupItem value="subdomain" id="subdomain" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="subdomain" className="text-base font-semibold cursor-pointer">
                    Use a free subdomain
                    <Badge className="ml-2 bg-green-100 text-green-700">Recommended</Badge>
                  </Label>
                  <CardDescription className="mt-1">
                    Get started immediately with a free AGI Staffers subdomain
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {domainOption === 'subdomain' && (
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Free SSL certificate included</span>
                </div>
                
                <div className="space-y-2">
                  <Label>Choose your subdomain</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={subdomain}
                        onChange={handleSubdomainChange}
                        placeholder="yourbusiness"
                        className={`pr-32 ${errors.subdomain ? 'border-red-500' : ''}`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        .agistaffers.com
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={checkSubdomainAvailability}
                      disabled={isChecking || !subdomain}
                    >
                      {isChecking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Check'
                      )}
                    </Button>
                  </div>
                  
                  {errors.subdomain && (
                    <p className="text-xs text-red-500">{errors.subdomain}</p>
                  )}
                  
                  {availability && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 text-sm ${
                        availability === 'available' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {availability === 'available' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Great! {subdomain}.agistaffers.com is available
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Sorry, this subdomain is already taken. Try another one.
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium">Your website will be available at:</p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      https://{subdomain || 'yourbusiness'}.agistaffers.com
                    </code>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Connect Existing Domain */}
          <Card className={domainOption === 'existing' ? 'ring-2 ring-blue-600' : ''}>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <RadioGroupItem value="existing" id="existing" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="existing" className="text-base font-semibold cursor-pointer">
                    Connect your existing domain
                  </Label>
                  <CardDescription className="mt-1">
                    Already have a domain? Connect it to your new website
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {domainOption === 'existing' && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter your domain</Label>
                  <Input
                    value={customDomain}
                    onChange={handleCustomDomainChange}
                    placeholder="example.com"
                    className={errors.customDomain ? 'border-red-500' : ''}
                  />
                  {errors.customDomain && (
                    <p className="text-xs text-red-500">{errors.customDomain}</p>
                  )}
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    You'll need to update your DNS records to point to our servers. We'll provide instructions after setup.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <p className="text-sm font-medium">You'll need to add these DNS records:</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-mono text-sm">A</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Value</p>
                        <p className="font-mono text-sm">72.60.28.175</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-mono text-sm">CNAME</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Value</p>
                        <p className="font-mono text-sm">www.agistaffers.com</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Purchase New Domain */}
          <Card className={domainOption === 'purchase' ? 'ring-2 ring-blue-600' : ''}>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <RadioGroupItem value="purchase" id="purchase" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="purchase" className="text-base font-semibold cursor-pointer">
                    Purchase a new domain
                    <Badge className="ml-2" variant="secondary">Coming Soon</Badge>
                  </Label>
                  <CardDescription className="mt-1">
                    Register a new domain directly through AGI Staffers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {domainOption === 'purchase' && (
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center space-y-3">
                  <Zap className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Domain purchasing will be available soon! For now, you can use a free subdomain or connect an existing domain.
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Browse domain registrars
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Skip for Now */}
          <Card className={domainOption === 'skip' ? 'ring-2 ring-blue-600' : ''}>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <RadioGroupItem value="skip" id="skip" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="skip" className="text-base font-semibold cursor-pointer">
                    Skip for now
                  </Label>
                  <CardDescription className="mt-1">
                    Set up your domain later (you'll get a temporary URL)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </RadioGroup>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleContinue} 
          size="lg"
          disabled={domainOption === 'purchase'}
          className="gap-2"
        >
          {domainOption === 'skip' ? 'Skip & Continue' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}