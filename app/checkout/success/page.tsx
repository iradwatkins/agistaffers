'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-500/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-3xl">Payment Successful!</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you for your purchase. Your order has been confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderId && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono text-sm font-medium">{orderId}</p>
              </div>
            )}

            <div className="space-y-3 text-sm text-left">
              <h3 className="font-semibold text-center mb-3">What happens next?</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="mr-2">📧</span>
                  <p className="text-muted-foreground">
                    You'll receive a confirmation email with your order details and next steps.
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">👤</span>
                  <p className="text-muted-foreground">
                    Our team will reach out within 24 hours to begin your onboarding process.
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">🚀</span>
                  <p className="text-muted-foreground">
                    We'll work together to get your AI solution up and running.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/">
                  Return Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="mailto:support@agistaffers.com">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
