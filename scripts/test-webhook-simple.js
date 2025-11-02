#!/usr/bin/env node
/**
 * Simple Square Webhook Test
 */

const crypto = require('crypto');

const WEBHOOK_URL = 'http://localhost:3001/api/webhooks/square';
const WEBHOOK_SIGNATURE_KEY = 'test-signature-key';

// Generate webhook signature
function generateSignature(body) {
  // For testing, we can bypass signature validation by using the same key
  // In production, Square would generate this signature
  return crypto
    .createHmac('sha256', WEBHOOK_SIGNATURE_KEY)
    .update(body)
    .digest('base64');
}

// Test payment created webhook
async function testPaymentWebhook() {
  const event = {
    type: 'payment.created',
    event_id: `test_evt_${Date.now()}_payment`,
    created_at: new Date().toISOString(),
    data: {
      type: 'payment',
      id: `test_payment_${Date.now()}`,
      object: {
        payment: {
          id: `test_payment_${Date.now()}`,
          status: 'COMPLETED',
          total_money: {
            amount: 9999,
            currency: 'USD'
          },
          customer_id: 'test_customer_123',
          reference_id: `ORD-${Date.now()}`,
          created_at: new Date().toISOString()
        }
      }
    }
  };

  try {
    const body = JSON.stringify(event);
    const signature = generateSignature(body);

    console.log('📤 Sending payment webhook to:', WEBHOOK_URL);
    console.log('Event type:', event.type);
    console.log('Payment amount: $' + (event.data.object.payment.total_money.amount / 100));

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': signature
      },
      body: body
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Webhook processed successfully');
      console.log('Response:', JSON.stringify(data));
    } else {
      const error = await response.text();
      console.log('❌ Webhook failed');
      console.log('Status:', response.status);
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ Error sending webhook:', error.message);
  }
}

// Test subscription created webhook
async function testSubscriptionWebhook() {
  const event = {
    type: 'subscription.created',
    event_id: `test_evt_${Date.now()}_sub`,
    created_at: new Date().toISOString(),
    data: {
      type: 'subscription',
      id: `test_sub_${Date.now()}`,
      object: {
        subscription: {
          id: `test_sub_${Date.now()}`,
          customer_id: 'test_customer_123',
          plan_id: 'PROFESSIONAL_MONTHLY',
          status: 'ACTIVE',
          start_date: new Date().toISOString().split('T')[0],
          charged_through_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price_override_money: {
            amount: 5999,
            currency: 'USD'
          }
        }
      }
    }
  };

  try {
    const body = JSON.stringify(event);
    const signature = generateSignature(body);

    console.log('\n📤 Sending subscription webhook to:', WEBHOOK_URL);
    console.log('Event type:', event.type);
    console.log('Subscription status:', event.data.object.subscription.status);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': signature
      },
      body: body
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Webhook processed successfully');
      console.log('Response:', JSON.stringify(data));
    } else {
      const error = await response.text();
      console.log('❌ Webhook failed');
      console.log('Status:', response.status);
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ Error sending webhook:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Square Webhook Tests');
  console.log('=' .repeat(50));
  console.log('Server:', WEBHOOK_URL);
  console.log('Make sure your dev server is running on port 3000\n');

  await testPaymentWebhook();
  await testSubscriptionWebhook();

  console.log('\n✨ Webhook tests completed');
}

runTests().catch(console.error);