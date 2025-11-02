'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { type Product, formatPrice } from '@/lib/products'

interface ProductCardProps {
  product: Product
  index?: number
  featured?: boolean
}

export default function ProductCard({ product, index = 0, featured = false }: ProductCardProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "h-full",
        featured && "md:scale-105 z-10"
      )}
    >
      <Card className={cn(
        "h-full flex flex-col border-border/50 relative overflow-hidden",
        "hover:border-primary/50 transition-all duration-300",
        "hover:shadow-xl hover:shadow-primary/10",
        featured && "border-primary shadow-lg shadow-primary/20"
      )}>
        {/* Background gradient overlay */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-32 opacity-20",
          "bg-gradient-to-br",
          product.gradient
        )}></div>

        {featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary">Most Popular</Badge>
          </div>
        )}

        <CardHeader className="relative z-10">
          {product.type === 'subscription' && (
            <Badge variant="outline" className="w-fit mb-2">
              Subscription
            </Badge>
          )}

          <CardTitle className="text-2xl">{product.shortName}</CardTitle>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
            {product.type === 'subscription' && product.billingPeriod && (
              <span className="text-muted-foreground">/{product.billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
            )}
          </div>

          <CardDescription className="mt-3">
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 relative z-10">
          <ul className="space-y-3">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="relative z-10">
          <Button
            asChild
            className={cn(
              "w-full group",
              featured
                ? "bg-gradient-to-r " + product.gradient
                : "variant-outline"
            )}
            size="lg"
          >
            <Link href={`/checkout?product=${product.id}`}>
              Buy Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
