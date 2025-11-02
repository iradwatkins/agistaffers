'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface BusinessTypeStepProps {
  data: any
  onNext: (data?: any) => void
  onBack: () => void
}

const businessTypes = [
  {
    id: 'restaurant',
    name: 'Restaurant & Food',
    icon: '🍽️',
    description: 'Restaurants, cafes, bars, food delivery',
    popular: true,
    features: ['Menu display', 'Online ordering', 'Reservations', 'Gallery']
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: '🛍️',
    description: 'Online stores, boutiques, shops',
    popular: true,
    features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Inventory']
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: '💼',
    description: 'Consulting, legal, accounting, business',
    popular: false,
    features: ['Service listings', 'Appointment booking', 'Client portal', 'Resources']
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '🏥',
    description: 'Medical, dental, fitness, spa, wellness',
    popular: false,
    features: ['Appointment scheduling', 'Patient forms', 'Service info', 'Staff profiles']
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    icon: '🎨',
    description: 'Agency, photography, art, design studio',
    popular: false,
    features: ['Portfolio showcase', 'Project gallery', 'Client testimonials', 'Contact forms']
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Software, SaaS, IT services, startups',
    popular: true,
    features: ['Product demos', 'Documentation', 'Pricing plans', 'API info']
  },
  {
    id: 'education',
    name: 'Education & Training',
    icon: '📚',
    description: 'Schools, courses, coaching, training',
    popular: false,
    features: ['Course catalog', 'Student portal', 'Resources', 'Event calendar']
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    icon: '🤝',
    description: 'Charity, community, religious organizations',
    popular: false,
    features: ['Donation system', 'Event management', 'Volunteer signup', 'Impact stories']
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    icon: '🏠',
    description: 'Property listings, agents, rentals',
    popular: false,
    features: ['Property listings', 'Virtual tours', 'Agent profiles', 'Mortgage calculator']
  },
  {
    id: 'personal',
    name: 'Personal Brand',
    icon: '👤',
    description: 'Portfolio, resume, blog, personal site',
    popular: false,
    features: ['About section', 'Blog', 'Portfolio', 'Contact info']
  },
  {
    id: 'events',
    name: 'Events & Entertainment',
    icon: '🎭',
    description: 'Venues, entertainment, event planning',
    popular: false,
    features: ['Event calendar', 'Ticket booking', 'Gallery', 'Venue info']
  },
  {
    id: 'other',
    name: 'Other Business',
    icon: '📋',
    description: 'General business website',
    popular: false,
    features: ['Flexible layouts', 'Custom pages', 'Contact forms', 'Blog']
  }
]

export default function BusinessTypeStep({ data, onNext }: BusinessTypeStepProps) {
  const [selectedType, setSelectedType] = useState(data.type || '')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTypes = businessTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId)
  }

  const handleContinue = () => {
    if (selectedType) {
      const selected = businessTypes.find(t => t.id === selectedType)
      onNext({ 
        type: selectedType,
        typeName: selected?.name,
        features: selected?.features
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">What type of business do you have?</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We'll customize your website based on your industry
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search business types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Popular Types */}
      {!searchTerm && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Popular choices
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {businessTypes.filter(t => t.popular).map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`
                    p-4 cursor-pointer transition-all
                    ${selectedType === type.id 
                      ? 'ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:shadow-md'
                    }
                  `}
                  onClick={() => handleSelect(type.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{type.name}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Types Grid */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {searchTerm ? 'Search results' : 'All business types'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
          {filteredTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`
                  p-4 cursor-pointer transition-all
                  ${selectedType === type.id 
                    ? 'ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:shadow-md'
                  }
                `}
                onClick={() => handleSelect(type.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                    {selectedType === type.id && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Features preview */}
                  {selectedType === type.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t"
                    >
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Includes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {type.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}