// Onboarding Service for AGI STAFFERS
// Manages the customer onboarding flow and progress tracking

import { prisma } from '@/lib/prisma'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  order: number
  completed: boolean
  required: boolean
  data?: any
}

export interface OnboardingProgress {
  userId: string
  currentStep: number
  completedSteps: string[]
  businessType?: string
  templateId?: string
  domainName?: string
  setupData: any
  completedAt?: Date
}

export class OnboardingService {
  private static steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AGI Staffers',
      description: 'Let\'s get your website set up in minutes',
      order: 1,
      completed: false,
      required: true
    },
    {
      id: 'business-type',
      title: 'Select Your Business Type',
      description: 'Choose the type that best describes your business',
      order: 2,
      completed: false,
      required: true
    },
    {
      id: 'template-selection',
      title: 'Choose Your Template',
      description: 'Pick a professional template for your website',
      order: 3,
      completed: false,
      required: true
    },
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Tell us about your business',
      order: 4,
      completed: false,
      required: true
    },
    {
      id: 'domain-setup',
      title: 'Connect Your Domain',
      description: 'Set up your custom domain or use a free subdomain',
      order: 5,
      completed: false,
      required: false
    },
    {
      id: 'customization',
      title: 'Customize Your Site',
      description: 'Add your logo, colors, and content',
      order: 6,
      completed: false,
      required: true
    },
    {
      id: 'launch',
      title: 'Launch Your Website',
      description: 'Review and publish your website',
      order: 7,
      completed: false,
      required: true
    }
  ]

  static async getProgress(userId: string): Promise<OnboardingProgress | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          onboardingCompleted: true,
          metadata: true
        }
      })

      if (!user) return null

      const metadata = user.metadata as any || {}
      
      return {
        userId,
        currentStep: metadata.onboardingStep || 1,
        completedSteps: metadata.completedSteps || [],
        businessType: metadata.businessType,
        templateId: metadata.templateId,
        domainName: metadata.domainName,
        setupData: metadata.setupData || {},
        completedAt: user.onboardingCompleted ? new Date() : undefined
      }
    } catch (error) {
      console.error('Error getting onboarding progress:', error)
      return null
    }
  }

  static async updateProgress(
    userId: string,
    stepId: string,
    data?: any
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) return false

      const metadata = (user.metadata as any) || {}
      const completedSteps = metadata.completedSteps || []

      if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId)
      }

      const currentStepIndex = this.steps.findIndex(s => s.id === stepId)
      const nextStep = currentStepIndex + 2 // +2 because order starts at 1

      const updatedMetadata = {
        ...metadata,
        completedSteps,
        onboardingStep: nextStep,
        setupData: {
          ...metadata.setupData,
          [stepId]: data
        }
      }

      // Update specific fields based on step
      if (stepId === 'business-type' && data?.type) {
        updatedMetadata.businessType = data.type
      }
      if (stepId === 'template-selection' && data?.templateId) {
        updatedMetadata.templateId = data.templateId
      }
      if (stepId === 'domain-setup' && data?.domain) {
        updatedMetadata.domainName = data.domain
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          metadata: updatedMetadata,
          onboardingCompleted: completedSteps.length >= 6
        }
      })

      return true
    } catch (error) {
      console.error('Error updating onboarding progress:', error)
      return false
    }
  }

  static async completeOnboarding(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          onboardingCompleted: true
        }
      })

      // Send welcome email
      await this.sendWelcomeEmail(user.email!)

      // Create default website
      await this.createDefaultWebsite(userId)

      return true
    } catch (error) {
      console.error('Error completing onboarding:', error)
      return false
    }
  }

  static async skipOnboarding(userId: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          onboardingCompleted: true,
          metadata: {
            onboardingSkipped: true,
            skippedAt: new Date()
          }
        }
      })

      return true
    } catch (error) {
      console.error('Error skipping onboarding:', error)
      return false
    }
  }

  static getSteps(): OnboardingStep[] {
    return this.steps
  }

  static getStep(stepId: string): OnboardingStep | undefined {
    return this.steps.find(s => s.id === stepId)
  }

  private static async sendWelcomeEmail(email: string): Promise<void> {
    // TODO: Implement email sending
    console.log(`Sending welcome email to ${email}`)
  }

  private static async createDefaultWebsite(userId: string): Promise<void> {
    try {
      const progress = await this.getProgress(userId)
      if (!progress) return

      const website = await prisma.customerSite.create({
        data: {
          customerId: userId,
          siteName: progress.setupData?.businessInfo?.name || 'My Website',
          domain: progress.domainName || `site-${userId}.agistaffers.com`,
          template: progress.templateId || 'dawn',
          settings: {
            businessType: progress.businessType,
            customization: progress.setupData?.customization || {}
          },
          status: 'ACTIVE'
        }
      })

      console.log(`Created default website for user ${userId}:`, website.id)
    } catch (error) {
      console.error('Error creating default website:', error)
    }
  }

  static getBusinessTypes() {
    return [
      {
        id: 'restaurant',
        name: 'Restaurant & Food Service',
        icon: '🍽️',
        templates: ['restaurant-elegant', 'cafe-modern', 'food-delivery']
      },
      {
        id: 'retail',
        name: 'Retail & E-commerce',
        icon: '🛍️',
        templates: ['dawn', 'shop-minimal', 'boutique']
      },
      {
        id: 'professional',
        name: 'Professional Services',
        icon: '💼',
        templates: ['corporate', 'consulting', 'law-firm']
      },
      {
        id: 'health',
        name: 'Health & Wellness',
        icon: '🏥',
        templates: ['medical', 'fitness', 'spa-wellness']
      },
      {
        id: 'creative',
        name: 'Creative & Design',
        icon: '🎨',
        templates: ['portfolio', 'agency', 'photography']
      },
      {
        id: 'technology',
        name: 'Technology & Software',
        icon: '💻',
        templates: ['saas', 'tech-startup', 'app-landing']
      },
      {
        id: 'education',
        name: 'Education & Training',
        icon: '📚',
        templates: ['course', 'school', 'training-center']
      },
      {
        id: 'nonprofit',
        name: 'Non-Profit & Community',
        icon: '🤝',
        templates: ['charity', 'church', 'community']
      },
      {
        id: 'realestate',
        name: 'Real Estate',
        icon: '🏠',
        templates: ['property', 'realtor', 'rental']
      },
      {
        id: 'other',
        name: 'Other Business',
        icon: '📋',
        templates: ['service-business', 'landing-page', 'blog']
      }
    ]
  }
}