'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Headphones,
  TrendingUp,
  Brain,
  MessageSquare,
  Clock,
  Zap,
  Globe,
  Shield,
  CircleCheckBig,
  ArrowRight,
  Sparkles,
  Users,
  Cpu
} from 'lucide-react'
import Link from 'next/link'
import PricingSection from '@/components/pricing/PricingSection'

const assistantTypes = [
  {
    icon: Headphones,
    title: 'Customer Support AI',
    description: '24/7 support that never sleeps. Handle thousands of inquiries simultaneously with human-like responses.',
    features: [
      'Instant response time',
      'Multi-language support',
      'Sentiment analysis',
      'Escalation protocols'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Sales AI Assistant',
    description: 'Your tireless sales team that qualifies leads, books meetings, and closes deals while you sleep.',
    features: [
      'Lead qualification',
      'Meeting scheduling',
      'Follow-up automation',
      'CRM integration'
    ]
  },
  {
    icon: Brain,
    title: 'Knowledge Base AI',
    description: 'Transform your documentation into an intelligent assistant that knows everything about your business.',
    features: [
      'Instant answers',
      'Document parsing',
      'Learning from interactions',
      'Custom training'
    ]
  },
  {
    icon: MessageSquare,
    title: 'Social Media AI',
    description: 'Engage with your audience 24/7. Reply to comments, DMs, and mentions with your brand voice.',
    features: [
      'Auto-responses',
      'Brand voice matching',
      'Engagement tracking',
      'Crisis detection'
    ]
  }
]

const benefits = [
  {
    icon: Clock,
    title: 'Available 24/7/365',
    description: 'Never miss a customer inquiry again. Your AI assistants work around the clock, even on holidays.'
  },
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'Zero wait time. Customers get immediate, accurate answers to their questions.'
  },
  {
    icon: Globe,
    title: 'Unlimited Scale',
    description: 'Handle 10 or 10,000 conversations simultaneously without breaking a sweat.'
  },
  {
    icon: Shield,
    title: 'Always Consistent',
    description: 'Perfect brand voice every time. No bad days, no mood swings, just consistent excellence.'
  }
]

const deploymentSteps = [
  {
    number: 1,
    title: 'Share Your Knowledge',
    description: 'Upload your FAQs, documentation, and training materials. Our AI learns everything about your business.'
  },
  {
    number: 2,
    title: 'Customize & Train',
    description: 'Set your brand voice, define workflows, and train the AI on your specific use cases and edge cases.'
  },
  {
    number: 3,
    title: 'Deploy & Scale',
    description: 'Launch on your website, social media, or support channels. Scale to thousands of conversations instantly.'
  }
]

export default function AIAssistantsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-700 border-blue-500/20">
              AI-POWERED WORKFORCE
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Your 24/7 Dream Team That Never Quits
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Deploy an army of AI assistants that handle customer support, sales, and engagement.
              They're smarter than chatbots, cheaper than humans, and they never ask for raises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                asChild
              >
                <Link href="/leads?service=ai-assistants">
                  Deploy My AI Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  See AI in Action
                  <Headphones className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Types of AI Assistants */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Types of AI Assistants</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect AI assistant for your business needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {assistantTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-blue-500/20">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
                          <p className="text-muted-foreground mb-4">{type.description}</p>
                          <ul className="space-y-2">
                            {type.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2">
                                <CircleCheckBig className="h-5 w-5 text-blue-500" />
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

      {/* Why AI Assistants */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Why AI Assistants Change Everything
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stop losing customers to slow response times. Stop paying for 24/7 human support.
              Start scaling intelligently.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Deploy in Days */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Deploy in Days, Not Months
              </h2>
              <div className="space-y-6">
                {deploymentSteps.map((step) => (
                  <div key={step.number} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-xl overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80"
                  alt="AI Assistant Dashboard"
                  className="w-full h-64 object-cover"
                  width="800"
                  height="256"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              </div>
              <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Active Conversations</p>
                          <p className="text-sm text-muted-foreground">Currently in progress</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-700">342</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold">Resolution Rate</p>
                          <p className="text-sm text-muted-foreground">Successfully resolved</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-700">87%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Cpu className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-semibold">AI Processing</p>
                          <p className="text-sm text-muted-foreground">Real-time processing</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/10 text-purple-700">Active</Badge>
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
        slug="ai-assistants"
        title="Choose Your AI Assistant Plan"
        description="Select the perfect solution for your customer support needs"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready for Your AI Dream Team?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that have already deployed AI assistants.
              Start with a free consultation and see the magic in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-lg px-8 py-6"
                asChild
              >
                <Link href="/leads?service=ai-assistants">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  Talk to an Expert
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
