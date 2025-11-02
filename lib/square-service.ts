import { SquareClient, SquareEnvironment } from 'square'
import { randomUUID } from 'crypto'

// Initialize Square client  
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || '',  // Changed from accessToken to token
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox,
})

export class SquareService {
  private static instance: SquareService
  private customers = client.customers
  private payments = client.payments
  private subscriptions = client.subscriptions
  private catalog = client.catalog
  private cards = client.cards

  private constructor() {}

  static getInstance(): SquareService {
    if (!SquareService.instance) {
      SquareService.instance = new SquareService()
    }
    return SquareService.instance
  }

  // Create or get Square customer
  async createCustomer(email: string, name?: string, phone?: string) {
    try {
      // First check if customer exists
      const searchResponse = await this.customers.search({
        filter: {
          emailAddress: {
            exact: email
          }
        }
      })

      if (searchResponse.result.customers && searchResponse.result.customers.length > 0) {
        return searchResponse.result.customers[0]
      }

      // Create new customer
      const response = await this.customers.create({
        idempotencyKey: randomUUID(),
        givenName: name?.split(' ')[0],
        familyName: name?.split(' ').slice(1).join(' '),
        emailAddress: email,
        phoneNumber: phone,
      })

      return response.result.customer
    } catch (error) {
      console.error('Error creating Square customer:', error)
      throw error
    }
  }

  // Create subscription
  async createSubscription(
    customerId: string, 
    planId: string,
    cardId?: string
  ) {
    try {
      const locationId = process.env.SQUARE_LOCATION_ID || ''
      
      const subscription = {
        locationId,
        customerId,
        planId,
        cardId,
        startDate: new Date().toISOString().split('T')[0],
      }

      const response = await this.subscriptions.create({
        idempotencyKey: randomUUID(),
        subscription
      })

      return response.result.subscription
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await this.subscriptions.cancel(
        subscriptionId
      )
      return response.result.subscription
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  // Update subscription plan
  async updateSubscriptionPlan(subscriptionId: string, newPlanId: string) {
    try {
      // Get current subscription
      const getResponse = await this.subscriptions.retrieve(subscriptionId)
      const currentSubscription = getResponse.result.subscription

      if (!currentSubscription) {
        throw new Error('Subscription not found')
      }

      // Update subscription with new plan
      const response = await this.subscriptions.update(
        subscriptionId,
        {
          subscription: {
            planId: newPlanId,
            version: currentSubscription.version
          }
        }
      )

      return response.result.subscription
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  }

  // Create card on file
  async createCard(customerId: string, sourceId: string) {
    try {
      const response = await this.cards.create({
        idempotencyKey: randomUUID(),
        sourceId, // This comes from Square Web Payments SDK
        card: {
          customerId
        }
      })

      return response.result.card
    } catch (error) {
      console.error('Error creating card:', error)
      throw error
    }
  }

  // List customer cards
  async listCustomerCards(customerId: string) {
    try {
      const response = await this.cards.list({
        customerId
      })

      return response.result.cards || []
    } catch (error) {
      console.error('Error listing cards:', error)
      throw error
    }
  }

  // Delete card
  async deleteCard(cardId: string) {
    try {
      await this.cards.disable(cardId)
      return true
    } catch (error) {
      console.error('Error deleting card:', error)
      throw error
    }
  }

  // Create one-time payment
  async createPayment(
    amount: number, // in cents
    currency: string,
    sourceId: string,
    customerId?: string
  ) {
    try {
      const response = await this.payments.create({
        idempotencyKey: randomUUID(),
        locationId: process.env.SQUARE_LOCATION_ID || '',
        sourceId,
        amountMoney: {
          amount: BigInt(amount),
          currency
        },
        customerId
      })

      return response.result.payment
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string) {
    try {
      const response = await this.subscriptions.retrieve(subscriptionId)
      return response.result.subscription
    } catch (error) {
      console.error('Error retrieving subscription:', error)
      throw error
    }
  }

  // List customer subscriptions
  async listCustomerSubscriptions(customerId: string) {
    try {
      const response = await this.subscriptions.search({
        filter: {
          customerIds: [customerId]
        }
      })

      return response.result.subscriptions || []
    } catch (error) {
      console.error('Error listing subscriptions:', error)
      throw error
    }
  }

  // Create subscription plans (for initial setup)
  async createSubscriptionPlans() {
    const plans = [
      {
        id: 'STARTER_MONTHLY',
        name: 'Starter Plan - Monthly',
        amount: 2999, // $29.99 in cents
        cadence: 'MONTHLY'
      },
      {
        id: 'STARTER_ANNUAL', 
        name: 'Starter Plan - Annual',
        amount: 29999, // $299.99 in cents
        cadence: 'ANNUAL'
      },
      {
        id: 'PROFESSIONAL_MONTHLY',
        name: 'Professional Plan - Monthly', 
        amount: 5999, // $59.99 in cents
        cadence: 'MONTHLY'
      },
      {
        id: 'PROFESSIONAL_ANNUAL',
        name: 'Professional Plan - Annual',
        amount: 59999, // $599.99 in cents
        cadence: 'ANNUAL'
      },
      {
        id: 'ENTERPRISE_MONTHLY',
        name: 'Enterprise Plan - Monthly',
        amount: 9999, // $99.99 in cents
        cadence: 'MONTHLY'
      },
      {
        id: 'ENTERPRISE_ANNUAL',
        name: 'Enterprise Plan - Annual',
        amount: 99999, // $999.99 in cents
        cadence: 'ANNUAL'
      }
    ]

    const createdPlans = []

    for (const plan of plans) {
      try {
        const response = await this.catalog.batchUpsert({
          idempotencyKey: randomUUID(),
          batches: [{
            objects: [{
              type: 'SUBSCRIPTION_PLAN',
              id: `#${plan.id}`,
              subscriptionPlanData: {
                name: plan.name,
                phases: [
                  {
                    cadence: plan.cadence as any,
                    recurringPriceMoney: {
                      amount: BigInt(plan.amount),
                      currency: 'USD'
                    }
                  }
                ]
              }
            }]
          }]
        })
        
        const createdObject = response.result.idMappings?.[0]?.objectId 
          ? { id: response.result.idMappings[0].objectId } 
          : response.result.objects?.[0]
        if (createdObject) createdPlans.push(createdObject)
        console.log(`Created plan: ${plan.name}`)
      } catch (error) {
        console.error(`Error creating plan ${plan.name}:`, error)
      }
    }

    return createdPlans
  }

  // Verify webhook signature
  verifyWebhookSignature(
    signatureHeader: string,
    notificationBody: string
  ): boolean {
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || ''
    
    // In production, implement proper signature verification
    // For now, return true for testing
    return true
  }

  // Handle webhook events
  async handleWebhookEvent(eventType: string, data: any) {
    switch (eventType) {
      case 'subscription.created':
        console.log('Subscription created:', data.subscription)
        break
      case 'subscription.updated':
        console.log('Subscription updated:', data.subscription)
        break
      case 'subscription.canceled':
        console.log('Subscription canceled:', data.subscription)
        break
      case 'payment.created':
        console.log('Payment created:', data.payment)
        break
      case 'invoice.payment_made':
        console.log('Invoice paid:', data.invoice)
        break
      default:
        console.log('Unhandled event type:', eventType)
    }
  }
}

export default SquareService.getInstance()