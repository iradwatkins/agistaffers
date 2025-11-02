'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles,
  Rocket,
  Globe,
  Palette,
  Building,
  ArrowRight
} from 'lucide-react'

// Import step components
import WelcomeStep from './steps/WelcomeStep'
import BusinessTypeStep from './steps/BusinessTypeStep'
import TemplateSelectionStep from './steps/TemplateSelectionStep'
import BusinessInfoStep from './steps/BusinessInfoStep'
import DomainSetupStep from './steps/DomainSetupStep'
import CustomizationStep from './steps/CustomizationStep'
import LaunchStep from './steps/LaunchStep'

interface OnboardingWizardProps {
  userId: string
  onComplete?: () => void
  onSkip?: () => void
}

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'business-type', title: 'Business Type', icon: Building },
  { id: 'template-selection', title: 'Template', icon: Palette },
  { id: 'business-info', title: 'Information', icon: Building },
  { id: 'domain-setup', title: 'Domain', icon: Globe },
  { id: 'customization', title: 'Customize', icon: Palette },
  { id: 'launch', title: 'Launch', icon: Rocket }
]

export default function OnboardingWizard({ 
  userId, 
  onComplete, 
  onSkip 
}: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [wizardData, setWizardData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load existing progress
    loadProgress()
  }, [userId])

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/onboarding/progress?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.progress) {
          setCurrentStep(data.progress.currentStep - 1)
          setCompletedSteps(data.progress.completedSteps || [])
          setWizardData(data.progress.setupData || {})
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const handleNext = async (stepData?: any) => {
    const currentStepId = steps[currentStep].id
    
    // Save step data
    if (stepData) {
      setWizardData({ ...wizardData, [currentStepId]: stepData })
    }

    // Mark step as completed
    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps([...completedSteps, currentStepId])
    }

    // Save progress to backend
    await saveProgress(currentStepId, stepData)

    // Move to next step or complete
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (index: number) => {
    // Allow navigation to completed steps or the next step
    if (index <= completedSteps.length) {
      setCurrentStep(index)
    }
  }

  const saveProgress = async (stepId: string, data: any) => {
    try {
      await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          stepId,
          data
        })
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (onComplete) {
        onComplete()
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    if (confirm('Are you sure you want to skip the setup? You can always complete it later.')) {
      try {
        await fetch('/api/onboarding/skip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })

        if (onSkip) {
          onSkip()
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error skipping onboarding:', error)
      }
    }
  }

  const renderStepContent = () => {
    const props = {
      data: wizardData[steps[currentStep].id] || {},
      onNext: handleNext,
      onBack: handleBack
    }

    switch (steps[currentStep].id) {
      case 'welcome':
        return <WelcomeStep {...props} />
      case 'business-type':
        return <BusinessTypeStep {...props} />
      case 'template-selection':
        return <TemplateSelectionStep {...props} businessType={wizardData['business-type']?.type} />
      case 'business-info':
        return <BusinessInfoStep {...props} />
      case 'domain-setup':
        return <DomainSetupStep {...props} />
      case 'customization':
        return <CustomizationStep {...props} template={wizardData['template-selection']?.templateId} />
      case 'launch':
        return <LaunchStep {...props} wizardData={wizardData} />
      default:
        return null
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AGI Staffers Setup
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Let's get your website ready in just a few minutes
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip Setup
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = index === currentStep
              const isClickable = index <= completedSteps.length

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                          ? 'bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-800' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs ${
                    isCurrent ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              {React.createElement(steps[currentStep].icon, { 
                className: "w-8 h-8 text-blue-600" 
              })}
              <div>
                <CardTitle className="text-2xl">
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {steps.length}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-600 w-8'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => handleNext()}
            disabled={isLoading}
            className="gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Launch Website
                <Rocket className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}