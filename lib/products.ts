export interface Product {
  id: string
  name: string
  shortName: string
  description: string
  type: 'subscription' | 'one-time'
  price: number // in cents
  billingPeriod?: 'monthly' | 'annual'
  features: string[]
  icon: string
  gradient: string
  slug: string
}

export const products: Product[] = [
  // AI Assistant Subscriptions
  {
    id: 'ai-assistant-starter',
    name: 'AI Assistant - Starter',
    shortName: 'Starter Assistant',
    description: 'Your 24/7 AI assistant to handle customer inquiries, qualify leads, and provide instant support.',
    type: 'subscription',
    price: 4999, // $49.99
    billingPeriod: 'monthly',
    features: [
      'Up to 1,000 conversations per month',
      'Email and chat support integration',
      'Basic customization',
      'Response analytics dashboard',
      '24/7 AI availability'
    ],
    icon: 'Bot',
    gradient: 'from-blue-500 to-cyan-500',
    slug: 'ai-assistants'
  },
  {
    id: 'ai-assistant-pro',
    name: 'AI Assistant - Professional',
    shortName: 'Pro Assistant',
    description: 'Advanced AI assistant with deeper customization and integration capabilities.',
    type: 'subscription',
    price: 14999, // $149.99
    billingPeriod: 'monthly',
    features: [
      'Up to 5,000 conversations per month',
      'Multi-channel integration (email, chat, SMS)',
      'Advanced customization and training',
      'Priority support',
      'Custom workflows',
      'Advanced analytics and reporting'
    ],
    icon: 'Bot',
    gradient: 'from-blue-500 to-cyan-500',
    slug: 'ai-assistants'
  },
  {
    id: 'ai-assistant-enterprise',
    name: 'AI Assistant - Enterprise',
    shortName: 'Enterprise Assistant',
    description: 'Full-scale AI assistant solution for large organizations with unlimited capabilities.',
    type: 'subscription',
    price: 49999, // $499.99
    billingPeriod: 'monthly',
    features: [
      'Unlimited conversations',
      'All-channel integration',
      'White-label solution',
      'Dedicated account manager',
      'Custom AI model training',
      'API access',
      'SLA guarantee'
    ],
    icon: 'Bot',
    gradient: 'from-blue-500 to-cyan-500',
    slug: 'ai-assistants'
  },

  // Workflow Automation Services
  {
    id: 'workflow-automation-starter',
    name: 'Workflow Automation - Starter Package',
    shortName: 'Automation Starter',
    description: 'Automate up to 3 repetitive business processes and reclaim your time.',
    type: 'one-time',
    price: 199900, // $1,999
    features: [
      'Up to 3 workflow automations',
      'App integrations (Zapier, Make, etc.)',
      'Process mapping and optimization',
      '30 days of support',
      'Documentation and training'
    ],
    icon: 'Workflow',
    gradient: 'from-purple-500 to-pink-500',
    slug: 'workflow-automation'
  },
  {
    id: 'workflow-automation-pro',
    name: 'Workflow Automation - Professional Package',
    shortName: 'Automation Pro',
    description: 'Comprehensive automation solution for complex business processes.',
    type: 'one-time',
    price: 499900, // $4,999
    features: [
      'Up to 10 workflow automations',
      'Advanced integrations and custom APIs',
      'Complex process design',
      'Database and CRM integration',
      '90 days of support',
      'Ongoing optimization consulting'
    ],
    icon: 'Workflow',
    gradient: 'from-purple-500 to-pink-500',
    slug: 'workflow-automation'
  },
  {
    id: 'workflow-automation-monthly',
    name: 'Workflow Automation - Monthly Retainer',
    shortName: 'Automation Retainer',
    description: 'Ongoing automation support with continuous optimization and new workflows.',
    type: 'subscription',
    price: 199900, // $1,999/month
    billingPeriod: 'monthly',
    features: [
      '20 hours of automation work per month',
      'New workflow creation',
      'Existing workflow optimization',
      'Priority support',
      'Monthly strategy session',
      'Rollover unused hours (up to 10)'
    ],
    icon: 'Workflow',
    gradient: 'from-purple-500 to-pink-500',
    slug: 'workflow-automation'
  },

  // AI SEO Services
  {
    id: 'ai-seo-starter',
    name: 'AI SEO - Content Boost Package',
    shortName: 'SEO Content Boost',
    description: 'AI-powered content strategy to improve your search rankings and authority.',
    type: 'one-time',
    price: 149900, // $1,499
    features: [
      '10 AI-optimized content pieces',
      'Keyword research and strategy',
      'Google and AI search optimization',
      'Content distribution plan',
      '60 days of performance tracking'
    ],
    icon: 'Search',
    gradient: 'from-green-500 to-emerald-500',
    slug: 'content-seo'
  },
  {
    id: 'ai-seo-monthly',
    name: 'AI SEO - Monthly Content Service',
    shortName: 'Monthly SEO',
    description: 'Continuous AI-powered content creation and SEO optimization.',
    type: 'subscription',
    price: 99900, // $999/month
    billingPeriod: 'monthly',
    features: [
      '20 content pieces per month',
      'Ongoing keyword optimization',
      'Multi-platform distribution',
      'Performance analytics',
      'Monthly strategy calls',
      'AI search engine optimization (ChatGPT, Gemini, etc.)'
    ],
    icon: 'Search',
    gradient: 'from-green-500 to-emerald-500',
    slug: 'content-seo'
  },
  {
    id: 'ai-seo-authority',
    name: 'AI SEO - Authority Builder',
    shortName: 'Authority SEO',
    description: 'Comprehensive SEO strategy to establish you as the industry authority.',
    type: 'one-time',
    price: 499900, // $4,999
    features: [
      'Complete SEO audit and strategy',
      '50 high-authority content pieces',
      'Backlink acquisition strategy',
      'Technical SEO optimization',
      'AI search prominence',
      '6 months of performance tracking',
      'Quarterly strategy reviews'
    ],
    icon: 'Search',
    gradient: 'from-green-500 to-emerald-500',
    slug: 'content-seo'
  },

  // Custom AI Prompt Packages
  {
    id: 'prompt-engineering-basic',
    name: 'Custom AI Prompts - Basic Package',
    shortName: 'Basic Prompts',
    description: 'Tailored AI prompts to turn generic AI into your specialized assistant.',
    type: 'one-time',
    price: 49900, // $499
    features: [
      '5 custom AI prompts for your business',
      'Prompt optimization and testing',
      'Integration guides for ChatGPT, Claude, etc.',
      'Usage documentation',
      '30 days of revision support'
    ],
    icon: 'Brain',
    gradient: 'from-orange-500 to-red-500',
    slug: 'prompt-engineering'
  },
  {
    id: 'prompt-engineering-pro',
    name: 'Custom AI Prompts - Professional Package',
    shortName: 'Pro Prompts',
    description: 'Comprehensive suite of custom AI prompts for your entire workflow.',
    type: 'one-time',
    price: 149900, // $1,499
    features: [
      '20 custom AI prompts',
      'Workflow-specific prompt chains',
      'GPT/Claude custom assistant setup',
      'Team training session',
      'Prompt library and templates',
      '90 days of optimization support'
    ],
    icon: 'Brain',
    gradient: 'from-orange-500 to-red-500',
    slug: 'prompt-engineering'
  },
  {
    id: 'prompt-engineering-enterprise',
    name: 'Custom AI Prompts - Enterprise Solution',
    shortName: 'Enterprise Prompts',
    description: 'Full custom AI assistant development with ongoing optimization.',
    type: 'subscription',
    price: 299900, // $2,999/month
    billingPeriod: 'monthly',
    features: [
      'Unlimited custom prompts',
      'Custom AI assistant development',
      'API integration support',
      'Dedicated prompt engineer',
      'Monthly optimization sessions',
      'Priority support',
      'White-label solutions'
    ],
    icon: 'Brain',
    gradient: 'from-orange-500 to-red-500',
    slug: 'prompt-engineering'
  }
]

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByType(type: 'subscription' | 'one-time'): Product[] {
  return products.filter(p => p.type === type)
}

export function getProductsBySlug(slug: string): Product[] {
  return products.filter(p => p.slug === slug)
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
