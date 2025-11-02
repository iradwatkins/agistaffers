'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, Send } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function LeadsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    budget: '',
    details: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Lead submitted:', formData)
  }

  const services = [
    'SEO & AI Search',
    'AI Assistants',
    'Workflow Automation',
    'Prompt Engineering',
    'Pre-built Store',
    'Custom Website'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
                <Rocket className="mr-2 h-4 w-4" />
                START YOUR PROJECT
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-black mb-6"
            >
              Let's Build Something <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Extraordinary</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Fill out the form below and we'll get back to you within 24 hours with a custom strategy tailored to your business.
            </motion.p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-8 max-w-3xl mx-auto"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
              alt="Team brainstorming"
              className="w-full h-64 object-cover"
              width="1200"
              height="256"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
          </motion.div>

          {/* Lead Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 max-w-3xl mx-auto">
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <input
                      type="text"
                      placeholder="Your Company"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Services You're Interested In</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {services.map((service) => (
                      <label key={service} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-input"
                          checked={formData.services.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, services: [...formData.services, service]})
                            } else {
                              setFormData({...formData, services: formData.services.filter(s => s !== service)})
                            }
                          }}
                        />
                        <span className="text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Budget Range</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  >
                    <option value="">Select your budget</option>
                    <option value="under-1000">Under $1,000</option>
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000-25000">$10,000 - $25,000</option>
                    <option value="25000+">$25,000+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Details *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your project, goals, and any specific requirements..."
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 text-lg py-6"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Submit Your Project
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting this form, you agree to our terms and privacy policy. We'll respond within 24 hours.
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">What Happens Next?</h2>
            <p className="text-muted-foreground">
              Here's our simple 4-step process to get your project started
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "1", title: "We Review", desc: "Within 24 hours, we'll review your project details" },
              { num: "2", title: "Strategy Call", desc: "We'll schedule a free consultation to discuss your needs" },
              { num: "3", title: "Custom Proposal", desc: "You'll receive a detailed proposal with timeline and pricing" },
              { num: "4", title: "Launch", desc: "Once approved, we start building your solution" }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-black text-xl">
                    {step.num}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help! Reach out directly or check out our FAQ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-primary to-purple-500">
                <Link href="/contact">
                  Contact Us Directly
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
