import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: {
    websites: number
    storage: number // in GB
    bandwidth: number // in GB
    customDomains: boolean
    ssl: boolean
    support: string
  }
  stripePriceId?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses',
    price: 19,
    currency: 'usd',
    interval: 'month',
    features: [
      '1 Website',
      '10 GB Storage',
      '100 GB Bandwidth',
      'Free SSL Certificate',
      'Basic Templates',
      'Email Support'
    ],
    limits: {
      websites: 1,
      storage: 10,
      bandwidth: 100,
      customDomains: true,
      ssl: true,
      support: 'email'
    },
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing businesses',
    price: 49,
    currency: 'usd',
    interval: 'month',
    features: [
      '5 Websites',
      '50 GB Storage',
      '500 GB Bandwidth',
      'Free SSL Certificates',
      'Premium Templates',
      'Priority Email Support',
      'Advanced Analytics',
      'Custom CSS/JS'
    ],
    limits: {
      websites: 5,
      storage: 50,
      bandwidth: 500,
      customDomains: true,
      ssl: true,
      support: 'priority'
    },
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 149,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited Websites',
      '500 GB Storage',
      'Unlimited Bandwidth',
      'Free SSL Certificates',
      'All Templates',
      '24/7 Phone Support',
      'Advanced Analytics',
      'Custom CSS/JS',
      'API Access',
      'White Label Option'
    ],
    limits: {
      websites: -1, // unlimited
      storage: 500,
      bandwidth: -1, // unlimited
      customDomains: true,
      ssl: true,
      support: '24/7'
    },
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID
  }
]

export class StripeService {
  // Create a Stripe customer
  static async createCustomer(email: string, name?: string, metadata?: any) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          platform: 'agistaffers'
        }
      })
      
      return customer
    } catch (error) {
      console.error('Error creating Stripe customer:', error)
      throw error
    }
  }

  // Create a checkout session
  static async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: any
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        subscription_data: {
          trial_period_days: 14, // 14-day free trial
          metadata
        },
        allow_promotion_codes: true
      })
      
      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  // Create a billing portal session
  static async createBillingPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })
      
      return session
    } catch (error) {
      console.error('Error creating billing portal session:', error)
      throw error
    }
  }

  // Get subscription status
  static async getSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      return subscription
    } catch (error) {
      console.error('Error retrieving subscription:', error)
      throw error
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string, immediately = false) {
    try {
      if (immediately) {
        // Cancel immediately
        const subscription = await stripe.subscriptions.cancel(subscriptionId)
        return subscription
      } else {
        // Cancel at end of billing period
        const subscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        })
        return subscription
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  // Resume subscription
  static async resumeSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })
      return subscription
    } catch (error) {
      console.error('Error resuming subscription:', error)
      throw error
    }
  }

  // Update subscription
  static async updateSubscription(subscriptionId: string, newPriceId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations',
      })
      
      return updatedSubscription
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  }

  // Get usage for metered billing
  static async reportUsage(
    subscriptionItemId: string,
    quantity: number,
    timestamp?: number
  ) {
    try {
      const usageRecord = await stripe.subscriptionItems.createUsageRecord(
        subscriptionItemId,
        {
          quantity,
          timestamp: timestamp || Math.floor(Date.now() / 1000),
          action: 'increment', // or 'set' for absolute value
        }
      )
      
      return usageRecord
    } catch (error) {
      console.error('Error reporting usage:', error)
      throw error
    }
  }

  // Create an invoice
  static async createInvoice(customerId: string, items: any[]) {
    try {
      const invoice = await stripe.invoices.create({
        customer: customerId,
        auto_advance: true, // Auto-finalize the invoice
        collection_method: 'charge_automatically',
      })

      // Add invoice items
      for (const item of items) {
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: item.amount,
          currency: item.currency || 'usd',
          description: item.description,
        })
      }

      // Finalize and send the invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
      
      return finalizedInvoice
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  }

  // Handle webhook events
  static async handleWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription
          await this.handleSubscriptionUpdate(subscription)
          break

        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object as Stripe.Subscription
          await this.handleSubscriptionCancellation(deletedSubscription)
          break

        case 'invoice.payment_succeeded':
          const invoice = event.data.object as Stripe.Invoice
          await this.handlePaymentSuccess(invoice)
          break

        case 'invoice.payment_failed':
          const failedInvoice = event.data.object as Stripe.Invoice
          await this.handlePaymentFailure(failedInvoice)
          break

        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session
          await this.handleCheckoutComplete(session)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }
    } catch (error) {
      console.error('Error handling webhook event:', error)
      throw error
    }
  }

  // Handle subscription update
  private static async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    
    // Update customer record in database
    await prisma.customer.update({
      where: { stripeId: customerId },
      data: {
        plan: subscription.items.data[0].price.metadata.plan || 'starter',
        status: subscription.status,
      }
    })
  }

  // Handle subscription cancellation
  private static async handleSubscriptionCancellation(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string
    
    // Update customer status
    await prisma.customer.update({
      where: { stripeId: customerId },
      data: {
        status: 'canceled',
        plan: 'free'
      }
    })
    
    // Optionally disable customer sites
    await prisma.customerSite.updateMany({
      where: {
        customer: {
          stripeId: customerId
        }
      },
      data: {
        status: 'suspended'
      }
    })
  }

  // Handle payment success
  private static async handlePaymentSuccess(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    
    // Create invoice record
    await prisma.invoice.create({
      data: {
        customer: {
          connect: {
            stripeId: customerId
          }
        },
        invoiceNumber: invoice.number!,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'paid',
        dueDate: new Date(invoice.due_date! * 1000),
        paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
        billingPeriod: `${new Date(invoice.period_start * 1000).toISOString()} - ${new Date(invoice.period_end * 1000).toISOString()}`,
        stripeInvoiceId: invoice.id,
        items: invoice.lines.data.map(item => ({
          description: item.description,
          amount: item.amount / 100,
          quantity: item.quantity
        }))
      }
    })
  }

  // Handle payment failure
  private static async handlePaymentFailure(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string
    
    // Update customer status
    await prisma.customer.update({
      where: { stripeId: customerId },
      data: {
        status: 'payment_failed'
      }
    })
    
    // Send payment failure email
    // TODO: Implement email notification
  }

  // Handle checkout complete
  private static async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string
    
    // Update customer with subscription info
    await prisma.customer.update({
      where: { stripeId: customerId },
      data: {
        status: 'active'
      }
    })
  }

  // Create coupon
  static async createCoupon(
    code: string,
    percentOff?: number,
    amountOff?: number,
    duration: 'once' | 'repeating' | 'forever' = 'once',
    durationInMonths?: number
  ) {
    try {
      const coupon = await stripe.coupons.create({
        id: code,
        percent_off: percentOff,
        amount_off: amountOff,
        currency: amountOff ? 'usd' : undefined,
        duration,
        duration_in_months: durationInMonths,
        max_redemptions: 100,
      })
      
      return coupon
    } catch (error) {
      console.error('Error creating coupon:', error)
      throw error
    }
  }

  // Validate coupon
  static async validateCoupon(code: string) {
    try {
      const coupon = await stripe.coupons.retrieve(code)
      return {
        valid: coupon.valid,
        percentOff: coupon.percent_off,
        amountOff: coupon.amount_off,
        duration: coupon.duration
      }
    } catch (error) {
      return { valid: false }
    }
  }
}