/**
 * Payment Gateway Service
 * 
 * IMPORTANT: AGI Staffers uses Square EXCLUSIVELY for processing customer payments
 * - All subscriptions and one-time payments go through AGI Staffers' Square account
 * - Customers pay with credit/debit cards processed by Square
 * - PayPal and Bank Deposits are alternative methods for specific regions only
 * 
 * The payment provider fields below are for:
 * 1. AGI Staffers' payment processing (Square primary)
 * 2. Alternative regional methods (PayPal for international, Bank Deposits for DR)
 * 
 * Note: Customers may have their own Stripe/Square/PayPal for THEIR businesses,
 * but that's separate from how they pay AGI Staffers
 */

import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { Square, Environment } from 'square'
import { encrypt, decrypt } from '@/lib/encryption'

export type PaymentProvider = 'square' | 'paypal' | 'bank_deposit'

export interface PaymentGatewayConfig {
  provider: PaymentProvider
  customerId: string
  country?: string
}

export interface PaymentMethodData {
  provider: PaymentProvider
  accountDetails: any
  isDefault?: boolean
}

export interface BankDepositData {
  amount: number
  currency: string
  bankName: string
  accountNumber?: string
  transactionRef: string
  receiptFile?: File
}

// Regional Payment Rules for AGI Staffers
export const PAYMENT_RULES = {
  US: {
    // US customers pay AGI Staffers via Square (credit/debit cards)
    allowedProviders: ['square'] as PaymentProvider[],
    defaultProvider: 'square' as PaymentProvider,
    requiresVerification: false,
    description: 'Credit/debit cards processed through Square'
  },
  DO: { // Dominican Republic
    // DR customers can use PayPal or Bank Deposits to pay AGI Staffers
    allowedProviders: ['paypal', 'bank_deposit'] as PaymentProvider[],
    defaultProvider: 'bank_deposit' as PaymentProvider,
    requiresVerification: true,
    bankDepositRequired: true,
    verificationMessage: 'Bank deposits require receipt upload and manual verification (24-48 hours)'
  },
  INTERNATIONAL: {
    // Other countries use PayPal to pay AGI Staffers
    allowedProviders: ['paypal'] as PaymentProvider[],
    defaultProvider: 'paypal' as PaymentProvider,
    requiresVerification: false,
    description: 'PayPal for international customers'
  }
}

// Initialize payment providers
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const square = new Square({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox
})

export class PaymentGatewayService {
  
  // Get allowed payment methods based on country
  static getAvailableProviders(country?: string): PaymentProvider[] {
    const countryCode = country?.toUpperCase()
    
    if (countryCode === 'DO') {
      return PAYMENT_RULES.DO.allowedProviders
    }
    
    // Default to US rules
    return PAYMENT_RULES.US.allowedProviders
  }
  
  // Check if bank deposit is required for a country
  static isBankDepositRequired(country?: string): boolean {
    const countryCode = country?.toUpperCase()
    return countryCode === 'DO' && PAYMENT_RULES.DO.bankDepositRequired
  }
  
  // Get payment rules for a country
  static getPaymentRules(country?: string) {
    const countryCode = country?.toUpperCase()
    return countryCode === 'DO' ? PAYMENT_RULES.DO : PAYMENT_RULES.US
  }

  // Create a customer on a payment provider
  static async createCustomer(config: PaymentGatewayConfig) {
    const { provider, customerId } = config
    
    // Get customer data
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })
    
    if (!customer) {
      throw new Error('Customer not found')
    }
    
    let providerCustomerId: string | null = null
    
    switch (provider) {
      case 'stripe':
        const stripeCustomer = await stripe.customers.create({
          email: customer.email,
          name: customer.contactName || customer.companyName || undefined,
          metadata: {
            customerId: customer.id,
            platform: 'agistaffers'
          }
        })
        providerCustomerId = stripeCustomer.id
        
        // Update customer with Stripe ID
        await prisma.customer.update({
          where: { id: customerId },
          data: { stripeId: stripeCustomer.id }
        })
        break
        
      case 'square':
        const squareCustomer = await square.customersApi.createCustomer({
          customer: {
            emailAddress: customer.email,
            companyName: customer.companyName || undefined,
            givenName: customer.contactName?.split(' ')[0],
            familyName: customer.contactName?.split(' ')[1],
            phoneNumber: customer.contactPhone || undefined,
            referenceId: customer.id
          }
        })
        providerCustomerId = squareCustomer.result.customer?.id || null
        break
        
      case 'paypal':
        // PayPal customer creation is handled during checkout
        // Store email as reference
        providerCustomerId = customer.email
        break
        
      case 'cashapp':
        // Cash App customer creation is handled during payment
        // Store phone or email as reference
        providerCustomerId = customer.contactPhone || customer.email
        break
        
      case 'bank_deposit':
        // No external customer creation needed for bank deposits
        providerCustomerId = `BD-${customer.id}`
        break
    }
    
    return providerCustomerId
  }

  // Save payment method
  static async savePaymentMethod(customerId: string, data: PaymentMethodData) {
    const { provider, accountDetails, isDefault = false } = data
    
    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })
    
    if (!customer) {
      throw new Error('Customer not found')
    }
    
    // Check if provider is allowed for customer's country
    const allowedProviders = this.getAvailableProviders(customer.country || 'US')
    if (!allowedProviders.includes(provider)) {
      throw new Error(`Payment provider ${provider} is not available in ${customer.country || 'US'}`)
    }
    
    // Create provider customer if needed
    let providerCustomerId = null
    if (provider !== 'bank_deposit') {
      providerCustomerId = await this.createCustomer({
        provider,
        customerId,
        country: customer.country || undefined
      })
    }
    
    // Encrypt sensitive account details
    const encryptedDetails = encrypt(JSON.stringify(accountDetails))
    
    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          customerId,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }
    
    // Create payment method
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        customerId,
        provider,
        providerCustomerId,
        accountDetails: encryptedDetails,
        isDefault,
        metadata: {
          country: customer.country,
          createdVia: 'web'
        }
      }
    })
    
    return paymentMethod
  }

  // Process payment with a specific provider
  static async processPayment(
    paymentMethodId: string,
    amount: number,
    currency: string = 'USD',
    description?: string
  ) {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      include: { customer: true }
    })
    
    if (!paymentMethod) {
      throw new Error('Payment method not found')
    }
    
    const accountDetails = JSON.parse(decrypt(paymentMethod.accountDetails))
    
    switch (paymentMethod.provider) {
      case 'stripe':
        return await this.processStripePayment(
          paymentMethod.providerCustomerId!,
          amount,
          currency,
          description
        )
        
      case 'square':
        return await this.processSquarePayment(
          accountDetails,
          amount,
          currency,
          description
        )
        
      case 'paypal':
        return await this.processPayPalPayment(
          accountDetails,
          amount,
          currency,
          description
        )
        
      case 'cashapp':
        return await this.processCashAppPayment(
          accountDetails,
          amount,
          currency,
          description
        )
        
      case 'bank_deposit':
        throw new Error('Bank deposits must be processed through createBankDeposit method')
        
      default:
        throw new Error(`Unsupported payment provider: ${paymentMethod.provider}`)
    }
  }

  // Process Stripe payment
  private static async processStripePayment(
    customerId: string,
    amount: number,
    currency: string,
    description?: string
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        description,
        automatic_payment_methods: {
          enabled: true,
        },
      })
      
      return {
        success: true,
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
        provider: 'stripe'
      }
    } catch (error) {
      console.error('Stripe payment error:', error)
      throw error
    }
  }

  // Process Square payment
  private static async processSquarePayment(
    accountDetails: any,
    amount: number,
    currency: string,
    description?: string
  ) {
    try {
      const payment = await square.paymentsApi.createPayment({
        sourceId: accountDetails.sourceId,
        amountMoney: {
          amount: BigInt(Math.round(amount * 100)),
          currency
        },
        idempotencyKey: `${Date.now()}-${Math.random()}`,
        note: description
      })
      
      return {
        success: true,
        transactionId: payment.result.payment?.id,
        status: payment.result.payment?.status,
        provider: 'square'
      }
    } catch (error) {
      console.error('Square payment error:', error)
      throw error
    }
  }

  // Process PayPal payment (placeholder - requires PayPal SDK)
  private static async processPayPalPayment(
    accountDetails: any,
    amount: number,
    currency: string,
    description?: string
  ) {
    // TODO: Integrate PayPal SDK
    // For now, return a mock response
    console.log('PayPal payment processing:', { accountDetails, amount, currency, description })
    
    return {
      success: true,
      transactionId: `PAYPAL-${Date.now()}`,
      status: 'pending',
      provider: 'paypal',
      redirectUrl: 'https://www.paypal.com/checkout/...'
    }
  }

  // Process Cash App payment (placeholder - requires Cash App API)
  private static async processCashAppPayment(
    accountDetails: any,
    amount: number,
    currency: string,
    description?: string
  ) {
    // TODO: Integrate Cash App API
    // For now, return a mock response
    console.log('Cash App payment processing:', { accountDetails, amount, currency, description })
    
    return {
      success: true,
      transactionId: `CASHAPP-${Date.now()}`,
      status: 'pending',
      provider: 'cashapp',
      redirectUrl: '$cashtag'
    }
  }

  // Create bank deposit record (for Dominican Republic)
  static async createBankDeposit(customerId: string, data: BankDepositData) {
    const { amount, currency, bankName, accountNumber, transactionRef } = data
    
    // Create bank deposit record
    const bankDeposit = await prisma.bankDeposit.create({
      data: {
        customerId,
        amount,
        currency,
        bankName,
        accountNumber: accountNumber ? accountNumber.slice(-4) : null, // Store only last 4 digits
        transactionRef,
        status: 'pending',
        metadata: {
          requiresVerification: true,
          estimatedVerificationTime: '24-48 hours'
        }
      }
    })
    
    return bankDeposit
  }

  // Upload receipt for bank deposit
  static async uploadBankDepositReceipt(
    bankDepositId: string,
    receiptUrl: string
  ) {
    const bankDeposit = await prisma.bankDeposit.update({
      where: { id: bankDepositId },
      data: {
        receiptUrl,
        metadata: {
          receiptUploadedAt: new Date().toISOString()
        }
      }
    })
    
    return bankDeposit
  }

  // Verify bank deposit (admin action)
  static async verifyBankDeposit(
    bankDepositId: string,
    verifiedBy: string,
    approved: boolean,
    rejectionReason?: string
  ) {
    const bankDeposit = await prisma.bankDeposit.update({
      where: { id: bankDepositId },
      data: {
        status: approved ? 'verified' : 'rejected',
        verifiedBy,
        verifiedAt: new Date(),
        rejectionReason: approved ? null : rejectionReason
      }
    })
    
    // If approved and linked to an invoice, update invoice status
    if (approved && bankDeposit.invoiceId) {
      await prisma.invoice.update({
        where: { id: bankDeposit.invoiceId },
        data: {
          status: 'paid',
          paidAt: new Date()
        }
      })
    }
    
    return bankDeposit
  }

  // Get customer's payment methods
  static async getCustomerPaymentMethods(customerId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        paymentMethods: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!customer) {
      throw new Error('Customer not found')
    }
    
    // Filter by country rules
    const allowedProviders = this.getAvailableProviders(customer.country || 'US')
    const paymentMethods = customer.paymentMethods.filter(
      pm => allowedProviders.includes(pm.provider as PaymentProvider)
    )
    
    return paymentMethods
  }

  // Get pending bank deposits for verification (admin)
  static async getPendingBankDeposits() {
    const deposits = await prisma.bankDeposit.findMany({
      where: { status: 'pending' },
      include: {
        customer: true,
        invoice: true
      },
      orderBy: { createdAt: 'asc' }
    })
    
    return deposits
  }

  // Handle webhook from payment provider
  static async handleWebhook(provider: PaymentProvider, eventType: string, payload: any) {
    // Store webhook event
    const webhook = await prisma.gatewayWebhook.create({
      data: {
        provider,
        eventType,
        eventId: payload.id || `${provider}-${Date.now()}`,
        payload,
        status: 'pending'
      }
    })
    
    try {
      // Process based on provider
      switch (provider) {
        case 'stripe':
          await this.handleStripeWebhook(eventType, payload)
          break
        case 'square':
          await this.handleSquareWebhook(eventType, payload)
          break
        case 'paypal':
          await this.handlePayPalWebhook(eventType, payload)
          break
        case 'cashapp':
          await this.handleCashAppWebhook(eventType, payload)
          break
      }
      
      // Mark webhook as processed
      await prisma.gatewayWebhook.update({
        where: { id: webhook.id },
        data: {
          status: 'processed',
          processedAt: new Date()
        }
      })
    } catch (error: any) {
      // Mark webhook as failed
      await prisma.gatewayWebhook.update({
        where: { id: webhook.id },
        data: {
          status: 'failed',
          error: error.message
        }
      })
      throw error
    }
  }

  // Handle Stripe webhook
  private static async handleStripeWebhook(eventType: string, payload: any) {
    console.log('Processing Stripe webhook:', eventType)
    // Implementation depends on specific Stripe events
  }

  // Handle Square webhook
  private static async handleSquareWebhook(eventType: string, payload: any) {
    console.log('Processing Square webhook:', eventType)
    // Implementation depends on specific Square events
  }

  // Handle PayPal webhook
  private static async handlePayPalWebhook(eventType: string, payload: any) {
    console.log('Processing PayPal webhook:', eventType)
    // Implementation depends on specific PayPal events
  }

  // Handle Cash App webhook
  private static async handleCashAppWebhook(eventType: string, payload: any) {
    console.log('Processing Cash App webhook:', eventType)
    // Implementation depends on specific Cash App events
  }
}

// Export singleton instance
export default PaymentGatewayService