'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Plane, Target, Zap, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
              <Plane className="mr-2 h-4 w-4" />
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              From <span className="font-serif italic text-black dark:text-white" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1em' }}>Airmen</span> to AGI STAFFERS
            </h1>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden mb-8"
          >
            <img
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80"
              alt="Military airplane taking off"
              className="w-full h-72 object-cover"
              width="1200"
              height="288"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-secondary/20 rounded-2xl p-8 mb-12">
              <p className="text-lg leading-relaxed mb-6">
                Ever heard the old military joke? <strong>"How many airmen does it take to write a report?"</strong> The punchline: One to find a pencil, one to sharpen it, one to grab the paper, and one to actually write the thing.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                It's a perfect example of a system with way more people than it needs. When we started AGI STAFFERS, that joke was our unofficial motto. We saw the world was full of businesses doing things the "hard way," with too many people and too much busywork. We decided to do something about it.
              </p>

              <div className="text-center my-8">
                <div className="inline-block bg-gradient-to-r from-primary to-purple-500 text-white px-6 py-3 rounded-full text-xl font-bold">
                  We built this company on a single, rebellious idea: do more with less.
                </div>
              </div>

              <p className="text-lg leading-relaxed mb-6">
                Today, we're living in the time of the singlepreneur. It's a world where one person can run a multi-million-dollar company from their phone. Imagine sitting on a beach, your company running 100% on its own, with an AI assistant handling all the billing and a custom agent notifying you of every key event. That's the dream we're selling—and building.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                We created AGI STAFFERS to bring this agentic AI to the common person. To give you the tools, the websites, and the "staffers" you need to build your business from scratch, all on your own terms.
              </p>

              <p className="text-lg leading-relaxed font-semibold text-primary">
                This isn't about replacing people. It's about empowering you to be limitless. We're here to put the solo entrepreneur back in the driver's seat.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 h-full text-center hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Do More With Less</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our core philosophy: eliminate busywork and focus on what truly matters for your business growth.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 h-full text-center hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Empower Solo Entrepreneurs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe one person can run a multi-million dollar company. We provide the AI tools to make it happen.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 h-full text-center hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Your Freedom First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Technology should give you more time and freedom, not chain you to more work. That's our promise.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              How we got from military paperwork to AI automation
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* 2020 - Left aligned */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-8 flex-row"
            >
              <div className="flex-1">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className="text-lg font-bold px-3 py-1">2020</Badge>
                    <h3 className="text-xl font-bold">The Spark</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Former airmen realized the business world had the same inefficiencies as military bureaucracy.
                  </p>
                </Card>
              </div>
              <div className="hidden md:block">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              <div className="flex-1"></div>
            </motion.div>

            {/* 2021 - Right aligned */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-8 flex-row-reverse"
            >
              <div className="flex-1">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className="text-lg font-bold px-3 py-1">2021</Badge>
                    <h3 className="text-xl font-bold">First AI Assistant</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Built our first AI staffer that automated 80% of customer service tasks for a small business.
                  </p>
                </Card>
              </div>
              <div className="hidden md:block">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              <div className="flex-1"></div>
            </motion.div>

            {/* 2022 - Left aligned */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-8 flex-row"
            >
              <div className="flex-1">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className="text-lg font-bold px-3 py-1">2022</Badge>
                    <h3 className="text-xl font-bold">Going Full-Time</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Demand grew so fast we had to choose: keep our day jobs or help more entrepreneurs. Easy choice.
                  </p>
                </Card>
              </div>
              <div className="hidden md:block">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              <div className="flex-1"></div>
            </motion.div>

            {/* 2023 - Right aligned */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-8 flex-row-reverse"
            >
              <div className="flex-1">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className="text-lg font-bold px-3 py-1">2023</Badge>
                    <h3 className="text-xl font-bold">The Singlepreneur Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Launched our complete platform: AI assistants, automation tools, and custom websites in one package.
                  </p>
                </Card>
              </div>
              <div className="hidden md:block">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              <div className="flex-1"></div>
            </motion.div>

            {/* 2024 - Left aligned */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-8 flex-row"
            >
              <div className="flex-1">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className="text-lg font-bold px-3 py-1">2024</Badge>
                    <h3 className="text-xl font-bold">Global Impact</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Now helping entrepreneurs in 15+ countries build businesses that run themselves.
                  </p>
                </Card>
              </div>
              <div className="hidden md:block">
                <div className="w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
              </div>
              <div className="flex-1"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Join the{' '}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Revolution?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop dreaming about freedom and start building it. Let us show you how AI can transform your business.
            </p>
            <Button asChild className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg px-8 py-6">
              <Link href="/leads">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
