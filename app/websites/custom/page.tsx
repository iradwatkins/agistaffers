'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, Palette, Zap, Smartphone, BarChart, Send } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CustomWebsitesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    budget: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Custom project submitted:', formData)
  }

  const features = [
    { icon: Code, title: "100% Custom Code", desc: "Every line of code written specifically for you. Every pixel designed with purpose." },
    { icon: Palette, title: "Unique Design", desc: "Unique designs that capture your brand essence. No templates, no compromises." },
    { icon: Zap, title: "Advanced Development", desc: "Complex functionality, custom features, and integrations tailored to your needs." },
    { icon: Smartphone, title: "Mobile Optimized", desc: "Responsive designs that look stunning on every device, optimized for performance." },
    { icon: BarChart, title: "Analytics & Tracking", desc: "Built-in analytics to track performance and make data-driven decisions." }
  ]

  const processSteps = [
    { num: "1", title: "Discovery", desc: "We dive deep into your business, goals, and vision" },
    { num: "2", title: "Design", desc: "Create stunning mockups and prototypes for your approval" },
    { num: "3", title: "Development", desc: "Build your site with clean, scalable code" },
    { num: "4", title: "Launch", desc: "Deploy, optimize, and celebrate your new digital presence" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
                CUSTOM WEB DEVELOPMENT
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6"
            >
              Your Vision. <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Our Code.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            >
              When templates won't cut it, we build digital masterpieces from scratch. Custom websites that tell your story and drive real results.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button asChild className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg px-8 py-6">
                <Link href="#request-proposal">
                  Get Your Custom Quote
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative rounded-2xl overflow-hidden max-w-4xl mx-auto"
          >
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80"
              alt="Developer coding custom website"
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
                Built From Scratch, Just For You
              </motion.h2>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-6">What We Can Build</h2>
            <p className="text-xl text-muted-foreground mb-12">
              From simple portfolio sites to complex web applications, we have the expertise to bring your vision to life.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                "Corporate Websites & Portfolios",
                "E-Commerce Platforms",
                "Web Applications & SaaS",
                "Membership & Community Sites",
                "Booking & Reservation Systems",
                "Custom Dashboards & Tools"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Our Process</h2>
            <p className="text-xl text-muted-foreground">
              From concept to launch, we guide you every step of the way
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Proposal Section */}
      <section id="request-proposal" className="py-20 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">Ready to Start Your Custom Project?</h2>
              <p className="text-xl text-muted-foreground">
                Tell us about your project and we'll get back to you with a custom proposal.
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Website (if any)</label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Budget</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  >
                    <option value="">Select your budget</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000-25000">$10,000 - $25,000</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000+">$50,000+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Description *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tell us about your project, goals, desired features, and any specific requirements..."
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg py-6"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Request Custom Proposal
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  We'll review your project and send you a detailed proposal within 24 hours.
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Your Business is Unique
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Your website should be too. Let's create something that stands out from the crowd.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg px-8 py-6">
                <Link href="#request-proposal">
                  Start Your Project
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Schedule a Call
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
