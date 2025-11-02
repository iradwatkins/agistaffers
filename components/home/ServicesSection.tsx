'use client'

import ServiceCard from '@/components/home/ServiceCard'
import Image from 'next/image'
import { Bot, Workflow, Search, Brain } from 'lucide-react'

const services = [
  {
    title: "AI Assistant Subscriptions",
    subtitle: "Your 24/7 team that never sleeps",
    description: "Get AI-powered assistants that handle customer inquiries, qualify leads, and provide support around the clock. Scale your business without scaling your payroll.",
    cta: "Get Started",
    link: "/ai-assistants",
    icon: Bot,
    gradient: "from-blue-500 to-cyan-500",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
  },
  {
    title: "AI Automation Services",
    subtitle: "Eliminate busywork forever",
    description: "We design and build custom automation systems that connect your apps, streamline workflows, and handle repetitive tasks automatically. Focus on what matters.",
    cta: "Automate Now",
    link: "/workflow-automation",
    icon: Workflow,
    gradient: "from-purple-500 to-pink-500",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
  },
  {
    title: "AI SEO Services",
    subtitle: "Dominate search and AI engines",
    description: "Our AI-powered SEO strategies ensure you rank #1 on Google and get quoted by ChatGPT, Gemini, and other AI engines. Be the authority in your space.",
    cta: "Boost Rankings",
    link: "/content-seo",
    icon: Search,
    gradient: "from-green-500 to-emerald-500",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    title: "Custom AI Prompt Packages",
    subtitle: "AI that actually understands your business",
    description: "Stop using generic AI. We build custom AI assistants with specialized prompts tailored to your industry, ready to deploy in your favorite chat app.",
    cta: "Get Custom AI",
    link: "/prompt-engineering",
    icon: Brain,
    gradient: "from-orange-500 to-red-500",
    imageUrl: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=800&q=80"
  }
]

export default function ServicesSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI Solutions That Actually Work
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our suite of AI-powered services designed to transform your business operations and drive growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={service.title} className="relative">
              <div className="mb-4 rounded-lg overflow-hidden h-48 relative">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <ServiceCard
                {...service}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
