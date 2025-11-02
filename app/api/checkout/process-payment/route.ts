import { NextRequest, NextResponse } from 'next/server'
import SquareService from '@/lib/square-service'
import { getProductById } from '@/lib/products'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sourceId,
      productId,
      customerEmail,
      customerName,
      customerPhone,
      amount,
      type
    } = body

    // Validate required fields
    if (!sourceId || !productId || !customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get product details
    const product = getProductById(productId)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Create or get Square customer
    const customer = await SquareService.createCustomer(
      customerEmail,
      customerName,
      customerPhone
    )

    if (!customer || !customer.id) {
      return NextResponse.json(
        { success: false, error: 'Failed to create customer' },
        { status: 500 }
      )
    }

    let result

    if (type === 'subscription') {
      // For subscriptions, we need to:
      // 1. Create a card on file
      // 2. Create the subscription

      const card = await SquareService.createCard(customer.id, sourceId)

      if (!card || !card.id) {
        return NextResponse.json(
          { success: false, error: 'Failed to save payment method' },
          { status: 500 }
        )
      }

      // Note: For subscriptions, you need to have subscription plans created in Square first
      // This would typically use a mapped plan ID from your product
      // For now, we'll return success but note that plans need to be set up

      return NextResponse.json({
        success: true,
        orderId: randomUUID(),
        customerId: customer.id,
        cardId: card.id,
        message: 'Payment method saved. Subscription setup will be completed.',
        type: 'subscription'
      })

    } else {
      // One-time payment
      const payment = await SquareService.createPayment(
        amount,
        'USD',
        sourceId,
        customer.id
      )

      if (!payment || !payment.id) {
        return NextResponse.json(
          { success: false, error: 'Payment failed' },
          { status: 500 }
        )
      }

      result = {
        success: true,
        orderId: payment.id,
        customerId: customer.id,
        amount: payment.amountMoney?.amount?.toString(),
        status: payment.status,
        type: 'one-time'
      }
    }

    // Here you would typically:
    // 1. Save order to database
    // 2. Send confirmation email
    // 3. Trigger any post-purchase workflows

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Payment processing failed'
      },
      { status: 500 }
    )
  }
}
