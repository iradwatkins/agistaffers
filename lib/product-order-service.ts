import { prisma } from '@/lib/prisma'
import { paymentGatewayService } from '@/lib/payment-gateway-service'

export interface Product {
  id: string
  sku: string
  name: string
  type: 'automation' | 'template' | 'service' | 'integration'
  price: number
  currency: string
  description: string
  deliveryType: 'instant' | 'manual' | 'scheduled'
  metadata?: any
}

// Sample product catalog (would normally be in database)
export const PRODUCT_CATALOG: Product[] = [
  // Automations
  {
    id: 'auto-001',
    sku: 'AUTO-ONBOARD',
    name: 'Customer Onboarding Automation',
    type: 'automation',
    price: 299,
    currency: 'USD',
    description: 'Automated customer onboarding workflow with email sequences',
    deliveryType: 'instant'
  },
  {
    id: 'auto-002',
    sku: 'AUTO-SUPPORT',
    name: 'Support Ticket Automation',
    type: 'automation',
    price: 399,
    currency: 'USD',
    description: 'Automated support ticket routing and response system',
    deliveryType: 'instant'
  },
  {
    id: 'auto-003',
    sku: 'AUTO-INVENTORY',
    name: 'Inventory Management System',
    type: 'automation',
    price: 599,
    currency: 'USD',
    description: 'Complete inventory tracking and reorder automation',
    deliveryType: 'instant'
  },
  
  // Templates
  {
    id: 'tmpl-001',
    sku: 'TMPL-ECOM-PRO',
    name: 'E-Commerce Pro Template',
    type: 'template',
    price: 149,
    currency: 'USD',
    description: 'Professional e-commerce template with advanced features',
    deliveryType: 'instant'
  },
  {
    id: 'tmpl-002',
    sku: 'TMPL-LANDING',
    name: 'Landing Page Pack',
    type: 'template',
    price: 99,
    currency: 'USD',
    description: '5 high-converting landing page templates',
    deliveryType: 'instant'
  },
  
  // Services
  {
    id: 'svc-001',
    sku: 'SVC-MIGRATION',
    name: 'Website Migration Service',
    type: 'service',
    price: 299,
    currency: 'USD',
    description: 'Complete website migration from any platform',
    deliveryType: 'manual'
  },
  {
    id: 'svc-002',
    sku: 'SVC-SEO',
    name: 'SEO Optimization Package',
    type: 'service',
    price: 499,
    currency: 'USD',
    description: 'Complete SEO audit and optimization',
    deliveryType: 'scheduled'
  },
  {
    id: 'svc-003',
    sku: 'SVC-CUSTOM',
    name: 'Custom Development (10 hours)',
    type: 'service',
    price: 999,
    currency: 'USD',
    description: '10 hours of custom development work',
    deliveryType: 'manual'
  }
]

export class ProductOrderService {
  /**
   * Create a one-time product order
   */
  async createProductOrder(params: {
    customerId: string
    productId: string
    paymentMethod: string
    quantity?: number
  }) {
    const { customerId, productId, paymentMethod, quantity = 1 } = params
    
    // Get product details
    const product = PRODUCT_CATALOG.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      throw new Error('Customer not found')
    }

    const totalAmount = product.price * quantity

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId,
        orderNumber: `ORD-${Date.now()}`,
        orderType: 'one_time',
        productType: product.type,
        productName: product.name,
        productSku: product.sku,
        amount: totalAmount,
        currency: product.currency,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        items: JSON.stringify([{
          productId: product.id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          quantity,
          total: totalAmount
        }]),
        metadata: {
          deliveryType: product.deliveryType,
          description: product.description
        }
      }
    })

    // Process payment based on method
    if (paymentMethod === 'bank_deposit' && customer.country === 'DO') {
      // For Dominican Republic bank deposits
      await this.handleBankDepositOrder(order, customer)
    } else {
      // Process instant payment
      await this.processInstantPayment(order, customer, paymentMethod)
    }

    return order
  }

  /**
   * Process instant payment for one-time product
   */
  private async processInstantPayment(
    order: any,
    customer: any,
    paymentMethod: string
  ) {
    try {
      // Use payment gateway service to process payment
      const payment = await paymentGatewayService.processPayment({
        provider: paymentMethod as any,
        amount: Number(order.amount),
        currency: order.currency,
        customerId: customer.id,
        description: `Order ${order.orderNumber}: ${order.productName}`,
        metadata: {
          orderId: order.id,
          orderType: 'one_time',
          productSku: order.productSku
        }
      })

      if (payment.status === 'succeeded') {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            paidAt: new Date(),
            metadata: {
              ...order.metadata,
              paymentId: payment.id
            }
          }
        })

        // Deliver product if instant delivery
        if (order.metadata?.deliveryType === 'instant') {
          await this.deliverProduct(order)
        }
      }
    } catch (error) {
      console.error('Payment processing failed:', error)
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'failed',
          orderStatus: 'cancelled'
        }
      })
      throw error
    }
  }

  /**
   * Handle bank deposit for one-time product (Dominican Republic)
   */
  private async handleBankDepositOrder(order: any, customer: any) {
    // Update order status to pending deposit
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'pending_deposit',
        orderStatus: 'pending',
        metadata: {
          ...order.metadata,
          bankDepositRequired: true,
          instructions: 'Please make bank deposit and upload receipt'
        }
      }
    })

    // Create invoice for the order
    await prisma.invoice.create({
      data: {
        customerId: customer.id,
        orderId: order.id,
        invoiceNumber: `INV-${Date.now()}`,
        amount: order.amount,
        currency: order.currency,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        billingPeriod: 'one_time',
        items: order.items,
        paymentMethod: 'bank_deposit'
      }
    })
  }

  /**
   * Deliver digital product
   */
  async deliverProduct(order: any) {
    const deliveryType = order.metadata?.deliveryType

    switch (deliveryType) {
      case 'instant':
        // Instant digital delivery
        await this.deliverDigitalProduct(order)
        break
      
      case 'manual':
        // Queue for manual delivery
        await this.queueManualDelivery(order)
        break
      
      case 'scheduled':
        // Schedule delivery
        await this.scheduleDelivery(order)
        break
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: 'delivered',
        deliveredAt: deliveryType === 'instant' ? new Date() : null
      }
    })
  }

  /**
   * Deliver digital product instantly
   */
  private async deliverDigitalProduct(order: any) {
    // This would handle actual product delivery
    // For automations: Deploy n8n workflow
    // For templates: Grant access to template
    // For services: Create service ticket
    
    console.log(`Delivering digital product for order ${order.orderNumber}`)
    
    // Log delivery
    await prisma.gatewayWebhook.create({
      data: {
        provider: 'internal',
        eventType: 'product.delivered',
        eventId: `delivery-${order.id}`,
        payload: {
          orderId: order.id,
          productSku: order.productSku,
          deliveredAt: new Date()
        },
        processedAt: new Date()
      }
    })
  }

  /**
   * Queue for manual delivery
   */
  private async queueManualDelivery(order: any) {
    // Create support ticket for manual delivery
    await prisma.supportTicket.create({
      data: {
        customerId: order.customerId,
        subject: `Manual Delivery Required: ${order.productName}`,
        description: `Order ${order.orderNumber} requires manual delivery`,
        priority: 'high',
        category: 'delivery',
        status: 'open'
      }
    })
  }

  /**
   * Schedule product delivery
   */
  private async scheduleDelivery(order: any) {
    // This would integrate with scheduling system
    console.log(`Scheduling delivery for order ${order.orderNumber}`)
  }

  /**
   * Get customer's product orders
   */
  async getCustomerProductOrders(customerId: string) {
    const orders = await prisma.order.findMany({
      where: {
        customerId,
        orderType: 'one_time'
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  }

  /**
   * Get customer's active subscriptions
   */
  async getCustomerSubscriptions(customerId: string) {
    const subscriptions = await prisma.order.findMany({
      where: {
        customerId,
        orderType: 'subscription',
        subscriptionStatus: { in: ['active', 'trialing'] }
      },
      orderBy: { createdAt: 'desc' }
    })

    return subscriptions
  }
}

export const productOrderService = new ProductOrderService()