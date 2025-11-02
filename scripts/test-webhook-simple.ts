#!/usr/bin/env node
/**
 * Simple Square Webhook Test - Non-interactive
 * Tests webhook with signature verification
 */

import crypto from 'crypto'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const WEBHOOK_URL = 'http://localhost:3001/api/webhooks/square'
const WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || 'ypaSh1d4N1Ak4_Vgch9m9A'

console.log('🚀 Testing Square Webhook')
console.log('📍 URL:', WEBHOOK_URL)
console.log('🔑 Using signature key:', WEBHOOK_SIGNATURE_KEY.substring(0, 10) + '...')

// Generate webhook signature
function generateSignature(body: string): string {
  return crypto
    .createHmac('sha256', WEBHOOK_SIGNATURE_KEY)
    .update(body)
    .digest('base64')
}

// Test event
const testEvent = {
  type: 'payment.created',
  event_id: `test_evt_${Date.now()}`,
  created_at: new Date().toISOString(),
  data: {
    type: 'payment',
    id: `test_payment_${Date.now()}`,
    object: {
      payment: {
        id: `test_payment_${Date.now()}`,
        order_id: `test_order_${Date.now()}`,
        amount_money: {
          amount: 2999,
          currency: 'USD'
        },
        status: 'COMPLETED',
        customer_id: 'test_customer_123',
        created_at: new Date().toISOString()
      }
    }
  }
}

async function testWebhook() {
  const body = JSON.stringify(testEvent)
  const signature = generateSignature(body)
  
  console.log('\n📤 Sending test payment.created webhook...')
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Square-Hmacsha256-Signature': signature
      },
      body: body
    })
    
    const responseText = await response.text()
    
    if (response.ok) {
      console.log('✅ Webhook test successful!')
      console.log('📊 Response:', responseText)
    } else {
      console.log('❌ Webhook test failed')
      console.log('Status:', response.status)
      console.log('Response:', responseText)
    }
  } catch (error) {
    console.log('❌ Failed to send webhook:', error)
    console.log('💡 Make sure your dev server is running on port 3001')
  }
}

// Run test
testWebhook()