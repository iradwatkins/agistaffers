'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { getProductById, formatPrice, type Product } from '@/lib/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import SquarePaymentForm from '@/components/checkout/SquarePaymentForm'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId)
      setProduct(foundProduct || null)
    }
    setLoading(false)
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>
              The product you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Checkout</h1>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>

                {product.type === 'subscription' && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      Subscription: Billed {product.billingPeriod}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Included Features:</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                    {product.type === 'subscription' && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{product.billingPeriod}
                      </span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>
                  Complete your purchase securely with Square
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SquarePaymentForm product={product} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
