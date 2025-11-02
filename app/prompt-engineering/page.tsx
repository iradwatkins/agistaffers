'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Target,
  Code,
  WandSparkles,
  MessageSquare,
  CircleCheckBig,
  ArrowRight,
  Sparkles,
  Brain,
  Cpu,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import PricingSection from '@/components/pricing/PricingSection'

const services = [
  {
    icon: Target,
    title: 'Custom AI Training',
    description: 'We train AI models specifically for your business, understanding your products, services, and unique voice.'
  },
  {
    icon: Code,
    title: 'Prompt Optimization',
    description: 'Transform generic AI into a specialist that delivers consistent, accurate results every time.'
  },
  {
    icon: WandSparkles,
    title: 'Workflow Integration',
    description: 'Seamlessly integrate custom prompts into your existing tools and workflows.'
  },
  {
    icon: MessageSquare,
    title: 'Response Fine-Tuning',
    description: 'Perfect the tone, style, and accuracy of AI responses to match your brand exactly.'
  }
]

const useCases = [
  'Legal document analysis',
  'Medical report generation',
  'Technical documentation',
  'Creative content writing',
  'Customer service responses',
  'Data analysis & insights'
]

export default function PromptEngineeringPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-orange-500/10 text-orange-700 border-orange-500/20">
              CUSTOM AI SOLUTIONS
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Your AI Is Generic.{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                We Make It a Specialist.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Stop using jack-of-all-trades AI. We engineer custom prompts and train AI models that understand your business like a 10-year veteran employee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                asChild
              >
                <Link href="/leads?service=prompt-engineering">
                  Get Custom AI Strategy
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  See Examples
                  <Brain className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">AI That Actually Works For You</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We don't just write prompts. We engineer AI systems that become invaluable members of your team.
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
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-orange-500/20">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                          <p className="text-muted-foreground">{service.description}</p>
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

      {/* From Generic to Genius */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-xl overflow-hidden mb-16 max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80"
              alt="AI Technology Visualization"
              className="w-full h-96 object-cover"
              width="1200"
              height="384"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                Transform Generic AI Into Industry Experts
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">From Generic to Genius</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Whether you need AI for legal analysis, medical documentation, or creative writing,
                we engineer prompts that deliver expert-level results.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={useCase}
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CircleCheckBig className="h-5 w-5 text-orange-500" />
                    <span>{useCase}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-orange-500/5 to-red-500/5 border-orange-500/20">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <Brain className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Before vs After</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Generic Prompt:</p>
                        <p className="text-sm italic">
                          "Generic AI Response: &quot;I can help you with various tasks...&quot;"
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <ArrowRight className="h-6 w-6 text-orange-500" />
                      </div>

                      <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                        <p className="text-sm text-muted-foreground mb-2">Custom Prompt:</p>
                        <p className="text-sm font-semibold">
                          "Your Custom AI: &quot;Based on your customer's purchase history and the seasonal trend data, I recommend...&quot;"
                        </p>
                      </div>
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
        slug="prompt-engineering"
        title="Choose Your Custom AI Package"
        description="From single-use prompts to enterprise AI training"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/5 to-red-500/5">
        <div class Name="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Sparkles className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-black mb-2">Get Your Custom AI Strategy</h2>
                  <p className="text-muted-foreground">
                    Tell us about your needs and we'll show you exactly how custom AI can transform your business.
                  </p>
                </div>

                <div className="text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                    asChild
                  >
                    <Link href="/leads?service=prompt-engineering">
                      Start Your Custom AI Project
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    We'll respond within 24 hours with a custom AI implementation plan for your business.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">Stop Fighting With Dumb AI</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              It's time your AI understood your business as well as you do. Let's build something that actually works.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Cpu className="h-8 w-8 text-orange-500 animate-pulse" />
              <Zap className="h-6 w-6 text-yellow-500" />
              <Brain className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
