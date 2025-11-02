'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Clock, Shield, Zap } from 'lucide-react'
import Image from 'next/image'

interface WelcomeStepProps {
  data: any
  onNext: (data?: any) => void
  onBack: () => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: Clock,
      title: '5-Minute Setup',
      description: 'Get your professional website live in minutes, not days'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with global CDN delivery'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse" />
            <Sparkles className="w-20 h-20 text-blue-600 relative" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold">
          Welcome to AGI Staffers! 🎉
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          You're just a few steps away from launching your professional website. 
          Our intelligent setup wizard will guide you through the process.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 py-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="text-center space-y-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* What to Expect */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg">What to Expect:</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">✓</span>
            <span>Choose from professionally designed templates tailored to your industry</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">✓</span>
            <span>Customize colors, fonts, and content to match your brand</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">✓</span>
            <span>Connect your domain or get a free subdomain</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">✓</span>
            <span>Launch your website with built-in SEO and analytics</span>
          </li>
        </ul>
      </div>

      {/* CTA Section */}
      <div className="text-center pt-4">
        <Button
          size="lg"
          onClick={() => onNext({ started: true })}
          className="gap-2"
        >
          Let's Get Started
          <Sparkles className="w-4 h-4" />
        </Button>
        
        <p className="text-xs text-gray-500 mt-4">
          No credit card required • Free 14-day trial
        </p>
      </div>
    </div>
  )
}