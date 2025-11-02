'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Bot,
  Search,
  Brain,
  ChartLine,
  CircleCheckBig,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  ChartColumn,
  Megaphone
} from 'lucide-react'
import Link from 'next/link'
import PricingSection from '@/components/pricing/PricingSection'

const stats = [
  {
    value: '+312%',
    label: 'Average Traffic Increase',
    description: 'in 6 months'
  },
  {
    value: '4.5x',
    label: 'AI Search Citations',
    description: 'more mentions'
  },
  {
    value: '87%',
    label: 'First Page Rankings',
    description: 'of keywords'
  },
  {
    value: '8:1',
    label: 'ROI Average',
    description: 'return on investment'
  }
]

const services = [
  {
    icon: Bot,
    title: 'AI Search Optimization',
    description: 'Get quoted by ChatGPT, Claude, and Perplexity. We optimize your content for AI-powered search engines.',
    features: [
      'AI snippet optimization',
      'LLM training data inclusion',
      'Conversational search ranking'
    ]
  },
  {
    icon: Search,
    title: 'Traditional SEO Mastery',
    description: 'Dominate Google with battle-tested strategies. First page rankings that actually convert.',
    features: [
      'Keyword research & strategy',
      'Technical SEO audit',
      'Link building campaigns'
    ]
  },
  {
    icon: Brain,
    title: 'Content Intelligence',
    description: 'AI-powered content that ranks and resonates. Every piece optimized for both humans and algorithms.',
    features: [
      'AI content generation',
      'Topic cluster mapping',
      'Semantic SEO optimization'
    ]
  },
  {
    icon: ChartLine,
    title: 'Performance Analytics',
    description: 'Real-time insights that drive decisions. Track rankings, traffic, and conversions in one dashboard.',
    features: [
      'Rank tracking',
      'Traffic analytics',
      'Conversion optimization'
    ]
  }
]

const processSteps = [
  {
    number: 1,
    title: 'Deep Dive Audit',
    description: 'We analyze your current presence across traditional and AI search platforms.'
  },
  {
    number: 2,
    title: 'Strategy Blueprint',
    description: 'Custom roadmap targeting both Google rankings and AI model citations.'
  },
  {
    number: 3,
    title: 'Content Domination',
    description: 'Create and optimize content that search engines and AI models can\'t ignore.'
  },
  {
    number: 4,
    title: 'Scale & Optimize',
    description: 'Continuously improve rankings while expanding your digital footprint.'
  }
]

const differentiators = [
  {
    icon: Bot,
    title: 'AI-First Approach',
    description: 'While others chase Google algorithms, we\'re optimizing for AI models that are becoming the primary search interface.'
  },
  {
    icon: Target,
    title: 'Precision Targeting',
    description: 'We don\'t spray and pray. Every strategy is laser-focused on keywords and topics that actually drive revenue.'
  },
  {
    icon: Zap,
    title: 'Speed of Implementation',
    description: 'See results in weeks, not months. Our automation tools and AI systems work 24/7 to accelerate your growth.'
  }
]

export default function SEOPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-green-500/10 text-green-700 border-green-500/20">
              SEO THAT ACTUALLY WORKS
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Don't Just Be Found. Be the First Thing They Talk About.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              We make sure your voice cuts through the noise. Our AI doesn't just help you rank on Google,
              we make sure ChatGPT and Perplexity are quoting you like gospel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                asChild
              >
                <Link href="/leads?service=seo">
                  Get Free SEO Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  View Case Studies
                  <ChartColumn className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mt-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">SEO Services That Deliver Results</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine traditional SEO mastery with cutting-edge AI optimization. Your competition is still figuring out ChatGPT while you're already ranking in it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-green-500/20">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                          <p className="text-muted-foreground mb-4">{service.description}</p>
                          <ul className="space-y-2">
                            {service.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2">
                                <CircleCheckBig className="h-5 w-5 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Our Battle-Tested Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four steps to search domination. No fluff, just results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-black text-green-500/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-green-500/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-xl overflow-hidden mb-16 max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1432888622747-4eb9a8c9df47?w=1200&q=80"
              alt="SEO Analytics"
              className="w-full h-96 object-cover"
              width="1200"
              height="384"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                Data-Driven SEO That Delivers Results
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">Why We're Different</h2>
              <div className="space-y-6">
                {differentiators.map((diff) => {
                  const Icon = diff.icon
                  return (
                    <div key={diff.title} className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Icon className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{diff.title}</h3>
                        <p className="text-muted-foreground">{diff.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Google Rankings</span>
                      <Badge className="bg-green-500/10 text-green-700">+287%</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '87%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">AI Citations</span>
                      <Badge className="bg-green-500/10 text-green-700">+450%</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '95%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Organic Traffic</span>
                      <Badge className="bg-green-500/10 text-green-700">+312%</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '78%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        slug="seo"
        title="Choose Your SEO Package"
        description="From quick wins to complete search domination"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Dominate Search?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get your free SEO audit and discover exactly how we'll get you ranking everywhere your customers are searching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-lg px-8 py-6"
                asChild
              >
                <Link href="/leads?service=seo">
                  Get My Free Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  Schedule a Call
                  <Megaphone className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
