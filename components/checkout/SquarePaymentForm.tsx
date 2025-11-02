'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { type Product, formatPrice } from '@/lib/products'
import { useRouter } from 'next/navigation'

interface SquarePaymentFormProps {
  product: Product
}

export default function SquarePaymentForm({ product }: SquarePaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [card, setCard] = useState<any>(null)

  // Customer information
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    // Load Square Web Payments SDK
    const script = document.createElement('script')
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (scriptLoaded && (window as any).Square) {
      initializeCard()
    }
  }, [scriptLoaded])

  async function initializeCard() {
    const payments = (window as any).Square.payments(
      process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
      process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
    )

    try {
      const cardInstance = await payments.card()
      await cardInstance.attach('#card-container')
      setCard(cardInstance)
    } catch (e) {
      console.error('Failed to initialize card:', e)
      setError('Failed to load payment form. Please refresh the page.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!card) {
      setError('Payment form not ready')
      return
    }

    if (!email || !name) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Tokenize card
      const result = await card.tokenize()

      if (result.status === 'OK') {
        // Send payment to backend
        const response = await fetch('/api/checkout/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            productId: product.id,
            customerEmail: email,
            customerName: name,
            customerPhone: phone,
            amount: product.price,
            type: product.type,
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setSuccess(true)
          setTimeout(() => {
            router.push(`/checkout/success?orderId=${data.orderId}`)
          }, 2000)
        } else {
          setError(data.error || 'Payment failed. Please try again.')
        }
      } else {
        setError('Card tokenization failed. Please check your card details.')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground">Redirecting you to confirmation...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <Label>Card Information *</Label>
        <div
          id="card-container"
          className="border border-input rounded-md p-3 min-h-[120px] bg-background"
        ></div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/50 rounded-md p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || !scriptLoaded}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay {formatPrice(product.price)}</>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Secure payment powered by Square. Your payment information is encrypted and secure.
      </p>
    </form>
  )
}
