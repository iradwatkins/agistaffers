'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Mail,
  Calendar,
  FileText,
  Database,
  Zap,
  TrendingDown,
  DollarSign,
  Gauge,
  CircleCheckBig,
  ArrowRight,
  Sparkles,
  Settings,
  TestTube,
  Rocket
} from 'lucide-react'
import Link from 'next/link'
import PricingSection from '@/components/pricing/PricingSection'

const stats = [
  {
    value: '73%',
    label: 'Time Saved',
    description: 'Average time reduction on repetitive tasks'
  },
  {
    value: '95%',
    label: 'Error Reduction',
    description: 'Fewer mistakes with automated workflows'
  },
  {
    value: '$50K+',
    label: 'Cost Savings',
    description: 'Average annual savings per business'
  },
  {
    value: '10x',
    label: 'Processing Speed',
    description: 'Faster than manual processing'
  }
]

const automationTypes = [
  {
    icon: Mail,
    title: 'Email & Communication Automation',
    description: 'Automatically sort, respond to, and manage your inbox. Never miss an important message again.',
    features: [
      'Auto-categorization & tagging',
      'Smart reply suggestions',
      'Follow-up reminders',
      'Multi-channel integration'
    ]
  },
  {
    icon: Calendar,
    title: 'Scheduling & Calendar Automation',
    description: 'Let AI handle your calendar. Book meetings, send reminders, and optimize your schedule automatically.',
    features: [
      'Smart scheduling',
      'Automatic reminders',
      'Meeting preparation',
      'Conflict resolution'
    ]
  },
  {
    icon: FileText,
    title: 'Document Processing',
    description: 'Extract, process, and organize data from documents instantly. No more manual data entry.',
    features: [
      'OCR & data extraction',
      'Document classification',
      'Auto-filing & organization',
      'Version control'
    ]
  },
  {
    icon: Database,
    title: 'Data Management & Reporting',
    description: 'Automated data syncing, cleaning, and reporting. Get insights without the manual work.',
    features: [
      'Automated data entry',
      'Real-time syncing',
      'Custom reports',
      'Data validation'
    ]
  }
]

const processSteps = [
  {
    number: 1,
    icon: Settings,
    title: 'Map Your Workflows',
    description: 'We analyze your current processes to identify automation opportunities and bottlenecks.'
  },
  {
    number: 2,
    icon: Zap,
    title: 'Design & Build',
    description: 'Custom automation workflows designed specifically for your business needs and tools.'
  },
  {
    number: 3,
    icon: TestTube,
    title: 'Test & Optimize',
    description: 'Rigorous testing to ensure reliability, then fine-tune for maximum efficiency.'
  },
  {
    number: 4,
    icon: Rocket,
    title: 'Deploy & Monitor',
    description: 'Launch your automations and continuously monitor performance for improvements.'
  }
]

const integrations = [
  { name: 'Slack', logo: '💬' },
  { name: 'Gmail', logo: '📧' },
  { name: 'Salesforce', logo: '☁️' },
  { name: 'HubSpot', logo: '🎯' },
  { name: 'Zapier', logo: '⚡' },
  { name: 'Google Sheets', logo: '📊' },
  { name: 'Trello', logo: '📋' },
  { name: 'Asana', logo: '✓' }
]

export default function WorkflowAutomationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-700 border-purple-500/20">
              WORKFLOW AUTOMATION
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Escape the Busywork. Build Something Cool.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Those mind-numbing tasks you do every day? Consider them gone.
              We build custom automation that handles the boring stuff while you focus on growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                asChild
              >
                <Link href="/leads?service=workflow-automation">
                  Automate My Workflows
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  See Examples
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xl font-bold mb-1">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">What We Automate</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From simple tasks to complex workflows, we automate it all
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {automationTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-purple-500/20">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
                          <p className="text-muted-foreground mb-4">{type.description}</p>
                          <ul className="space-y-2">
                            {type.features.map((feature) => (
                              <li key={feature} className="flex items-center gap-2">
                                <CircleCheckBig className="h-5 w-5 text-purple-500" />
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
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From concept to deployment in just a few weeks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Works With Your Favorite Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We integrate with 500+ platforms and tools you already use
            </p>
          </motion.div>

          <div className="relative rounded-xl overflow-hidden mb-12 max-w-4xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
              alt="Integration Dashboard"
              className="w-full h-80 object-cover"
              width="1200"
              height="320"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-purple-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{integration.logo}</div>
                    <p className="font-semibold">{integration.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-muted-foreground mt-8"
          >
            + hundreds more through Zapier, Make, and custom API integrations
          </motion.p>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    Calculate Your Savings
                  </h2>
                  <p className="text-muted-foreground">
                    See how much time and money automation could save your business
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-background/50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">$2,500+</div>
                    <p className="text-sm text-muted-foreground">Monthly savings on labor</p>
                  </div>
                  <div className="text-center p-6 bg-background/50 rounded-lg">
                    <Gauge className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">120+ hrs</div>
                    <p className="text-sm text-muted-foreground">Time saved per month</p>
                  </div>
                  <div className="text-center p-6 bg-background/50 rounded-lg">
                    <TrendingDown className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                    <div className="text-2xl font-bold mb-1">95%</div>
                    <p className="text-sm text-muted-foreground">Fewer errors</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    asChild
                  >
                    <Link href="/leads?service=workflow-automation">
                      Get Custom Calculation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection
        slug="workflow-automation"
        title="Choose Your Automation Package"
        description="From quick wins to enterprise-wide transformation"
      />

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Automate?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop wasting time on repetitive tasks. Let's build automation that works for you.
              Book a free consultation and we'll show you exactly what's possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-lg px-8 py-6"
                asChild
              >
                <Link href="/leads?service=workflow-automation">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  See What We Can Automate
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
