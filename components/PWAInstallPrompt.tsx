'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if running on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // For iOS, show custom install instructions
    if (isIOSDevice) {
      // Check if it's Safari
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
      if (isSafari && !localStorage.getItem('pwa-prompt-dismissed')) {
        setTimeout(() => setShowPrompt(true), 3000) // Show after 3 seconds
      }
      return
    }

    // For other browsers, listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt if not previously dismissed
      if (!localStorage.getItem('pwa-prompt-dismissed')) {
        setTimeout(() => setShowPrompt(true), 3000) // Show after 3 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      console.log('PWA was installed successfully')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferred prompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  const handleShowAgain = () => {
    localStorage.removeItem('pwa-prompt-dismissed')
    setShowPrompt(true)
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  // iOS-specific install instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
        <Card className="shadow-lg border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Install AGI Staffers App</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              Install our app for a better experience:
            </p>
            
            <ol className="text-sm space-y-1 mb-3">
              <li>1. Tap the <span className="font-semibold">Share</span> button</li>
              <li>2. Scroll down and tap <span className="font-semibold">Add to Home Screen</span></li>
              <li>3. Tap <span className="font-semibold">Add</span></li>
            </ol>

            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={handleDismiss}
              >
                Got it
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Standard install prompt for browsers that support it
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
      <Card className="shadow-lg border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Install AGI Staffers</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Install our app for quick access, offline support, and a native app experience!
          </p>

          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleInstallClick}
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Standalone component to show install button in settings or elsewhere
export function PWAInstallButton() {
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setCanInstall(false)
      setDeferredPrompt(null)
    }
  }

  if (!canInstall) {
    return null
  }

  return (
    <Button onClick={handleInstall} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Install App
    </Button>
  )
}