'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Rocket, 
  Check, 
  Globe, 
  Shield, 
  Zap,
  Mail,
  Building,
  Palette,
  ExternalLink,
  Loader2,
  PartyPopper,
  ArrowRight,
  Copy,
  Share2
} from 'lucide-react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

interface LaunchStepProps {
  data: any
  wizardData: any
  onNext: (data?: any) => void
  onBack: () => void
}

export default function LaunchStep({ 
  data, 
  wizardData, 
  onNext, 
  onBack 
}: LaunchStepProps) {
  const [isLaunching, setIsLaunching] = useState(false)
  const [launchProgress, setLaunchProgress] = useState(0)
  const [launchSteps, setLaunchSteps] = useState([
    { id: 'create', label: 'Creating website', completed: false },
    { id: 'template', label: 'Applying template', completed: false },
    { id: 'customize', label: 'Applying customization', completed: false },
    { id: 'domain', label: 'Configuring domain', completed: false },
    { id: 'ssl', label: 'Setting up SSL certificate', completed: false },
    { id: 'optimize', label: 'Optimizing performance', completed: false },
    { id: 'publish', label: 'Publishing website', completed: false }
  ])
  const [launched, setLaunched] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Extract key information from wizard data
  const businessName = wizardData['business-info']?.businessName || 'Your Business'
  const businessType = wizardData['business-type']?.typeName || 'Business'
  const template = wizardData['template-selection']?.templateName || 'Template'
  const domain = wizardData['domain-setup']?.fullDomain || 
    wizardData['domain-setup']?.temporary || 
    'yourbusiness.agistaffers.com'
  const colorScheme = wizardData['customization']?.colorScheme || 'default'

  const handleLaunch = async () => {
    if (!agreedToTerms) return

    setIsLaunching(true)
    
    // Simulate launch process
    for (let i = 0; i < launchSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setLaunchSteps(prev => prev.map((step, idx) => ({
        ...step,
        completed: idx <= i
      })))
      setLaunchProgress(((i + 1) / launchSteps.length) * 100)
    }

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    setLaunched(true)
    setIsLaunching(false)

    // Call onNext after a delay
    setTimeout(() => {
      onNext({ launched: true, domain })
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  if (launched) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto"
          >
            <PartyPopper className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <h2 className="text-3xl font-bold">
            🎉 Congratulations!
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your website is now live and ready to grow your business
          </p>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your website is live at:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <a 
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {domain}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`https://${domain}`)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">SSL Secured</p>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Fast Loading</p>
                </div>
                <div className="text-center">
                  <Globe className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">SEO Ready</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold">What's Next?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">📝 Add Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start adding pages, blog posts, and products to your website
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">📊 Set Up Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track visitors and understand how people use your website
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">🎨 Fine-tune Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize every aspect of your website's appearance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">🚀 Promote Your Site</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share on social media and start driving traffic
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button size="lg" className="gap-2">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    )
  }

  if (isLaunching) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto"
          >
            <Rocket className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </motion.div>
          
          <h2 className="text-2xl font-bold">Launching your website...</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This will just take a moment
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <Progress value={launchProgress} className="h-2" />
            
            <div className="space-y-3">
              {launchSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  {step.completed ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  )}
                  <span className={`text-sm ${
                    step.completed ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Ready to launch!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your website details and go live
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="w-4 h-4" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Name:</span>
              <span className="font-medium">{businessName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className="font-medium">{businessType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-medium">{wizardData['business-info']?.email || 'Not provided'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Domain:</span>
              <span className="font-medium">{domain}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Template:</span>
              <span className="font-medium">{template}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Color:</span>
              <span className="font-medium capitalize">{colorScheme}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Included */}
      <Card>
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
          <CardDescription>Your website comes with everything you need</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Shield, label: 'Free SSL Certificate', description: 'Secure HTTPS encryption' },
              { icon: Zap, label: 'Lightning Fast', description: 'Global CDN for speed' },
              { icon: Globe, label: 'SEO Optimized', description: 'Search engine ready' },
              { icon: Mail, label: 'Contact Forms', description: 'Built-in form handling' },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{feature.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="terms" className="cursor-pointer">
                <span className="font-medium">I agree to the terms and conditions</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  By launching your website, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>,{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Acceptable Use Policy</a>.
                </p>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Button */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          size="lg" 
          onClick={handleLaunch}
          disabled={!agreedToTerms || isLaunching}
          className="gap-2"
        >
          <Rocket className="w-5 h-5" />
          Launch My Website
        </Button>
      </div>
    </div>
  )
}