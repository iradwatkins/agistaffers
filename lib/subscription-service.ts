import { prisma } from '@/lib/prisma'
import { Client, Environment } from 'square'

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox
})

export interface SubscriptionPlan {
  id: string
  name: 'starter' | 'professional' | 'enterprise'
  price: number
  interval: 'monthly' | 'annually'
  features: string[]
  squarePlanId?: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter_monthly',
    name: 'starter',
    price: 29.99,
    interval: 'monthly',
    features: [
      '1 Website',
      'Basic Templates',
      '5GB Storage',
      'SSL Certificate',
      'Email Support'
    ],
    squarePlanId: process.env.SQUARE_PLAN_STARTER_MONTHLY
  },
  {
    id: 'starter_annually',
    name: 'starter',
    price: 299.99,
    interval: 'annually',
    features: [
      '1 Website',
      'Basic Templates',
      '5GB Storage',
      'SSL Certificate',
      'Email Support',
      '2 Months Free'
    ],
    squarePlanId: process.env.SQUARE_PLAN_STARTER_ANNUAL
  },
  {
    id: 'professional_monthly',
    name: 'professional',
    price: 79.99,
    interval: 'monthly',
    features: [
      '5 Websites',
      'Premium Templates',
      '50GB Storage',
      'SSL Certificate',
      'Priority Support',
      'Custom Domain',
      'Analytics Dashboard'
    ],
    squarePlanId: process.env.SQUARE_PLAN_PRO_MONTHLY
  },
  {
    id: 'professional_annually',
    name: 'professional',
    price: 799.99,
    interval: 'annually',
    features: [
      '5 Websites',
      'Premium Templates',
      '50GB Storage',
      'SSL Certificate',
      'Priority Support',
      'Custom Domain',
      'Analytics Dashboard',
      '2 Months Free'
    ],
    squarePlanId: process.env.SQUARE_PLAN_PRO_ANNUAL
  },
  {
    id: 'enterprise_monthly',
    name: 'enterprise',
    price: 199.99,
    interval: 'monthly',
    features: [
      'Unlimited Websites',
      'All Templates',
      'Unlimited Storage',
      'SSL Certificate',
      'Dedicated Support',
      'Custom Domains',
      'Advanced Analytics',
      'API Access',
      'White Label Options'
    ],
    squarePlanId: process.env.SQUARE_PLAN_ENTERPRISE_MONTHLY
  },
  {
    id: 'enterprise_annually',
    name: 'enterprise',
    price: 1999.99,
    interval: 'annually',
    features: [
      'Unlimited Websites',
      'All Templates',
      'Unlimited Storage',
      'SSL Certificate',
      'Dedicated Support',
      'Custom Domains',
      'Advanced Analytics',
      'API Access',
      'White Label Options',
      '2 Months Free'
    ],
    squarePlanId: process.env.SQUARE_PLAN_ENTERPRISE_ANNUAL
  }
]

export class SubscriptionService {
  /**
   * Create a new subscription for a customer
   */
  async createSubscription(params: {
    customerId: string
    planId: string
    paymentMethod: 'square' | 'paypal' | 'bank_deposit'
    cardId?: string // Square card ID for credit card payments
  }) {
    const { customerId, planId, paymentMethod, cardId } = params
    
    // Get the plan details
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
    if (!plan) {
      throw new Error('Invalid subscription plan')
    }

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      throw new Error('Customer not found')
    }

    // Handle based on payment method
    if (paymentMethod === 'square' && plan.squarePlanId) {
      // Create Square subscription
      const subscription = await this.createSquareSubscription(
        customer,
        plan,
        cardId
      )

      // Store subscription in database
      await prisma.order.create({
        data: {
          customerId,
          orderNumber: `SUB-${Date.now()}`,
          plan: plan.name,
          status: 'active',
          paymentMethod,
          paymentProvider: 'square',
          paymentId: subscription.id,
          amount: plan.price,
          currency: 'USD',
          subscriptionId: subscription.id,
          subscriptionInterval: plan.interval,
          nextBillingDate: new Date(subscription.startDate || Date.now()),
          notes: `Square subscription created: ${plan.name} ${plan.interval}`
        }
      })

      return subscription
    } else if (paymentMethod === 'paypal') {
      // Create PayPal subscription (would integrate with PayPal API)
      return await this.createPayPalSubscription(customer, plan)
    } else if (paymentMethod === 'bank_deposit') {
      // Create manual subscription for bank deposits
      return await this.createManualSubscription(customer, plan)
    }

    throw new Error('Unsupported payment method for subscriptions')
  }

  /**
   * Create Square subscription
   */
  private async createSquareSubscription(
    customer: any,
    plan: SubscriptionPlan,
    cardId?: string
  ) {
    try {
      // Create or get Square customer
      let squareCustomerId = customer.paymentProviderCustomerId

      if (!squareCustomerId) {
        const { result: customerResult } = await squareClient.customersApi.createCustomer({
          givenName: customer.contactName?.split(' ')[0],
          familyName: customer.contactName?.split(' ')[1],
          emailAddress: customer.email,
          companyName: customer.companyName,
          phoneNumber: customer.phone,
          referenceId: customer.id
        })

        squareCustomerId = customerResult.customer?.id

        // Update customer with Square ID
        await prisma.customer.update({
          where: { id: customer.id },
          data: { paymentProviderCustomerId: squareCustomerId }
        })
      }

      // Create subscription
      const { result } = await squareClient.subscriptionsApi.createSubscription({
        locationId: process.env.SQUARE_LOCATION_ID!,
        customerId: squareCustomerId!,
        planVariationId: plan.squarePlanId!,
        cardId,
        startDate: new Date().toISOString().split('T')[0]
      })

      return result.subscription
    } catch (error) {
      console.error('Square subscription creation failed:', error)
      throw new Error('Failed to create Square subscription')
    }
  }

  /**
   * Create PayPal subscription (stub)
   */
  private async createPayPalSubscription(
    customer: any,
    plan: SubscriptionPlan
  ) {
    // This would integrate with PayPal Subscriptions API
    // For now, create a manual subscription record
    const subscription = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `SUB-PP-${Date.now()}`,
        plan: plan.name,
        status: 'pending',
        paymentMethod: 'paypal',
        paymentProvider: 'paypal',
        amount: plan.price,
        currency: 'USD',
        subscriptionInterval: plan.interval,
        nextBillingDate: new Date(),
        notes: `PayPal subscription pending setup: ${plan.name} ${plan.interval}`
      }
    })

    return subscription
  }

  /**
   * Create manual subscription for bank deposits
   */
  private async createManualSubscription(
    customer: any,
    plan: SubscriptionPlan
  ) {
    // Create order for manual payment
    const subscription = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `SUB-BD-${Date.now()}`,
        plan: plan.name,
        status: 'pending_deposit',
        paymentMethod: 'bank_deposit',
        paymentProvider: 'bank_deposit',
        amount: plan.price,
        currency: customer.country === 'DO' ? 'DOP' : 'USD',
        subscriptionInterval: plan.interval,
        nextBillingDate: new Date(),
        notes: `Bank deposit subscription: ${plan.name} ${plan.interval} - Awaiting initial payment`
      }
    })

    return subscription
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    // Get subscription details
    const order = await prisma.order.findFirst({
      where: { subscriptionId }
    })

    if (!order) {
      throw new Error('Subscription not found')
    }

    // Cancel based on provider
    if (order.paymentProvider === 'square' && order.subscriptionId) {
      try {
        await squareClient.subscriptionsApi.cancelSubscription(
          order.subscriptionId
        )
      } catch (error) {
        console.error('Square subscription cancellation failed:', error)
      }
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'cancelled',
        notes: `Subscription cancelled on ${new Date().toLocaleDateString()}`
      }
    })

    // Update customer status if no active subscriptions
    const activeSubscriptions = await prisma.order.count({
      where: {
        customerId: order.customerId,
        status: 'active'
      }
    })

    if (activeSubscriptions === 0) {
      await prisma.customer.update({
        where: { id: order.customerId },
        data: { status: 'cancelled' }
      })
    }
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(subscriptionId: string, newPlanId: string) {
    const order = await prisma.order.findFirst({
      where: { subscriptionId }
    })

    if (!order) {
      throw new Error('Subscription not found')
    }

    const newPlan = SUBSCRIPTION_PLANS.find(p => p.id === newPlanId)
    if (!newPlan) {
      throw new Error('Invalid plan')
    }

    // Update based on provider
    if (order.paymentProvider === 'square' && order.subscriptionId && newPlan.squarePlanId) {
      try {
        await squareClient.subscriptionsApi.updateSubscription(
          order.subscriptionId,
          {
            subscription: {
              planVariationId: newPlan.squarePlanId
            }
          }
        )
      } catch (error) {
        console.error('Square subscription update failed:', error)
        throw new Error('Failed to update Square subscription')
      }
    }

    // Update order record
    await prisma.order.update({
      where: { id: order.id },
      data: {
        plan: newPlan.name,
        amount: newPlan.price,
        subscriptionInterval: newPlan.interval,
        notes: `Subscription updated to ${newPlan.name} ${newPlan.interval}`
      }
    })
  }

  /**
   * Get customer's active subscriptions
   */
  async getCustomerSubscriptions(customerId: string) {
    const subscriptions = await prisma.order.findMany({
      where: {
        customerId,
        subscriptionId: { not: null },
        status: { in: ['active', 'pending', 'pending_deposit'] }
      },
      orderBy: { createdAt: 'desc' }
    })

    return subscriptions.map(sub => ({
      id: sub.id,
      subscriptionId: sub.subscriptionId,
      plan: sub.plan,
      status: sub.status,
      amount: sub.amount,
      currency: sub.currency,
      interval: sub.subscriptionInterval,
      nextBillingDate: sub.nextBillingDate,
      paymentMethod: sub.paymentMethod,
      createdAt: sub.createdAt
    }))
  }

  /**
   * Process subscription renewal
   */
  async processRenewal(subscriptionId: string) {
    const order = await prisma.order.findFirst({
      where: { subscriptionId }
    })

    if (!order) {
      throw new Error('Subscription not found')
    }

    // Create renewal invoice
    await prisma.invoice.create({
      data: {
        customerId: order.customerId,
        orderId: order.id,
        invoiceNumber: `INV-${Date.now()}`,
        amount: order.amount,
        currency: order.currency,
        status: order.paymentMethod === 'bank_deposit' ? 'pending' : 'processing',
        dueDate: order.nextBillingDate,
        paymentMethod: order.paymentMethod
      }
    })

    // Update next billing date
    const nextDate = new Date(order.nextBillingDate || Date.now())
    if (order.subscriptionInterval === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1)
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1)
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { nextBillingDate: nextDate }
    })
  }
}

export const subscriptionService = new SubscriptionService()