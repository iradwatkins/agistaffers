'use client'

import ProductCard from './ProductCard'
import { getProductsBySlug, type Product } from '@/lib/products'

interface PricingSectionProps {
  slug: string
  title?: string
  description?: string
}

export default function PricingSection({
  slug,
  title = 'Choose Your Plan',
  description = 'Select the perfect solution for your needs'
}: PricingSectionProps) {
  const products = getProductsBySlug(slug)

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              featured={index === 1} // Feature the middle product
            />
          ))}
        </div>
      </div>
    </section>
  )
}
