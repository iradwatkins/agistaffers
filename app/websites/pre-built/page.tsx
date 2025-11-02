'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, Shield, TrendingUp, Clock, Package, Check, Sparkles, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function PreBuiltWebsitesPage() {
  const pricingTiers = [
    {
      name: "Starter Store",
      price: "$497",
      description: "Perfect for launching your first online business",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Professional e-commerce template",
        "Up to 100 products",
        "Mobile-responsive design",
        "Secure payment processing",
        "Basic SEO optimization",
        "SSL certificate included",
        "Email support",
        "3 months free hosting"
      ]
    },
    {
      name: "Growth Store",
      price: "$997",
      description: "For businesses ready to scale and grow",
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "Premium e-commerce template",
        "Unlimited products",
        "Advanced mobile optimization",
        "Multiple payment gateways",
        "Advanced SEO & AI optimization",
        "Custom domain & SSL",
        "Priority email & chat support",
        "6 months free hosting",
        "Email marketing integration",
        "Inventory management",
        "Customer accounts & wishlists"
      ]
    },
    {
      name: "Enterprise Store",
      price: "$2,497",
      description: "Full-featured store with premium support",
      color: "from-orange-500 to-red-500",
      features: [
        "Custom-designed store",
        "Unlimited everything",
        "AI-powered personalization",
        "Multi-currency & languages",
        "Advanced analytics dashboard",
        "Custom integrations",
        "Dedicated account manager",
        "12 months free hosting",
        "Marketing automation suite",
        "Advanced inventory & shipping",
        "B2B features available",
        "API access"
      ]
    }
  ]

  const industries = [
    { name: "Fashion & Apparel", desc: "Clothing, Accessories, Shoes" },
    { name: "Health & Beauty", desc: "Cosmetics, Supplements, Wellness" },
    { name: "Electronics", desc: "Gadgets, Accessories, Tech" },
    { name: "Home & Living", desc: "Furniture, Decor, Kitchen" },
    { name: "Food & Beverage", desc: "Specialty Foods, Drinks, Snacks" },
    { name: "Digital Products", desc: "Courses, eBooks, Software" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-indigo-500/10 text-indigo-700 border-indigo-500/20">
                PRE-BUILT E-COMMERCE STORES
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6"
            >
              Your Store. Live in 48 Hours.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8"
            >
              Skip the months of development. Get a professional e-commerce store that's ready to sell. We handle the tech, you handle the sales.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
                See Pricing Below
              </Button>
              <Button variant="outline">
                View Demo Stores
                <ShoppingBag className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative rounded-2xl overflow-hidden max-w-5xl mx-auto"
          >
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
              alt="E-commerce store dashboard"
              className="w-full h-96 object-cover"
              width="1200"
              height="384"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-3xl md:text-4xl font-black text-white drop-shadow-lg"
              >
                Launch Your Online Store Today
              </motion.h2>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Rocket, title: "Launch in 48 Hours", desc: "Your store goes live in 2 days or less. We handle everything from setup to launch." },
              { icon: Shield, title: "Secure & Reliable", desc: "PCI-compliant payment processing and enterprise-grade security built in." },
              { icon: TrendingUp, title: "Built to Convert", desc: "Optimized checkout flows and proven designs that turn visitors into customers." },
              { icon: Clock, title: "24/7 Support", desc: "Get help whenever you need it with our round-the-clock support team." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 w-fit mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              No hidden fees. No surprise charges. Just one payment and your store is live.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative"
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-1">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <Card className={`p-8 h-full ${tier.popular ? 'border-purple-500/50 shadow-xl' : 'border-border/50'} hover:shadow-2xl transition-all duration-300`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <div className="mb-2">
                      <span className={`text-4xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                        {tier.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">One-time setup</p>
                    <p className="text-muted-foreground mt-2">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${tier.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    Buy Now
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              All plans include free domain for 1 year • SSL certificate • 99.9% uptime guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Pre-Built for Every Industry</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our collection of conversion-optimized templates designed for your specific industry.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 hover:border-indigo-500/20">
                  <Package className="h-8 w-8 text-indigo-500 mb-3" />
                  <h3 className="text-lg font-bold mb-2">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground">{industry.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-12 w-12 text-indigo-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Start Selling Online?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who launched their stores with us. Your e-commerce success story starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-lg px-8 py-6">
                <Link href="/leads?service=pre-built-store">
                  Start Building Today
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Questions? Let's Talk
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
