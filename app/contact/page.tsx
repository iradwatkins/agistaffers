'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Mail, Phone, MessageCircle, Send, HelpCircle } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
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
    // Handle form submission
    console.log('Form submitted:', formData)
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
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-500 text-white border-0">
                GET IN TOUCH
              </Badge>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Build Your <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Digital Empire</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to escape the mundane and build something extraordinary? We're here to make it happen.
            </p>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden mb-8 max-w-4xl mx-auto"
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80"
              alt="Team collaboration"
              className="w-full h-80 object-cover"
              width="1200"
              height="320"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <Card className="p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">Address</h3>
                <p className="text-sm text-muted-foreground">
                  251 Little Falls Drive<br />
                  Wilmington, DE 19808
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
            >
              <Card className="p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  support@agistaffers.com
                </p>
                <p className="text-xs text-muted-foreground">
                  We'll respond within 24 hours
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <Card className="p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  404-668-2401
                </p>
                <p className="text-xs text-muted-foreground">
                  Mon-Fri 9am-6pm EST
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
            >
              <Card className="p-6 text-center hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">WhatsApp (DR)</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  404-668-2401
                </p>
                <p className="text-xs text-muted-foreground">
                  Dominican Republic
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">Start Your Project</h2>
                <p className="text-muted-foreground">
                  Fill out the form and we'll get back to you within 24 hours with a custom strategy.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
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
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <input
                      type="text"
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
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting this form, you agree to our terms and privacy policy. We promise not to spam you.
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to common questions. Still need help? Just ask!
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How quickly can you start?",
                a: "We can typically start within 48 hours for most projects. Pre-built stores launch in 2 days, custom projects begin within a week."
              },
              {
                q: "Do you offer payment plans?",
                a: "Yes! We offer flexible payment options including monthly plans for larger projects."
              },
              {
                q: "What if I'm not satisfied?",
                a: "We offer a 30-day money-back guarantee on all pre-built stores and milestone-based approvals for custom projects."
              },
              {
                q: "Do you provide ongoing support?",
                a: "Absolutely! All our services include support, with options for ongoing maintenance and updates."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Ready to Start?
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              Most projects begin with a free consultation to understand your needs.
            </p>
            <p className="text-lg font-semibold text-primary">
              Let's Talk
            </p>
            <p className="text-muted-foreground mt-4">
              Every minute you wait is a minute your competition gets ahead. Let's change that today.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
