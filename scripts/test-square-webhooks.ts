#!/usr/bin/env node
/**
 * Square Webhook Testing Script
 * Simulates webhook events for local testing
 */

import crypto from 'crypto'

const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/square'
const WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || 'test-signature-key'

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

// Generate webhook signature (simplified for testing)
function generateSignature(body: string): string {
  return crypto
    .createHmac('sha256', WEBHOOK_SIGNATURE_KEY)
    .update(body)
    .digest('base64')
}

// Test webhook events
const testEvents = {
  subscriptionCreated: {
    type: 'subscription.created',
    event_id: `test_evt_${Date.now()}_sub_created`,
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
  },

  paymentCreated: {
    type: 'payment.created',
    event_id: `test_evt_${Date.now()}_payment_created`,
    created_at: new Date().toISOString(),
    data: {
      type: 'payment',
      id: `test_payment_${Date.now()}`,
      object: {
        payment: {
          id: `test_payment_${Date.now()}`,
          status: 'COMPLETED',
          amount_money: {
            amount: 5999,
            currency: 'USD'
          },
          customer_id: 'test_customer_123',
          reference_id: `ORD-${Date.now()}`,
          created_at: new Date().toISOString()
        }
      }
    }
  },

  subscriptionUpdated: {
    type: 'subscription.updated',
    event_id: `test_evt_${Date.now()}_sub_updated`,
    created_at: new Date().toISOString(),
    data: {
      type: 'subscription',
      id: `test_sub_${Date.now()}`,
      object: {
        subscription: {
          id: `test_sub_${Date.now()}`,
          customer_id: 'test_customer_123',
          plan_id: 'ENTERPRISE_MONTHLY',
          status: 'ACTIVE',
          version: 2,
          charged_through_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }
    }
  },

  subscriptionCanceled: {
    type: 'subscription.canceled',
    event_id: `test_evt_${Date.now()}_sub_canceled`,
    created_at: new Date().toISOString(),
    data: {
      type: 'subscription',
      id: `test_sub_${Date.now()}`,
      object: {
        subscription: {
          id: `test_sub_${Date.now()}`,
          customer_id: 'test_customer_123',
          status: 'CANCELED',
          canceled_date: new Date().toISOString().split('T')[0]
        }
      }
    }
  },

  invoicePaymentMade: {
    type: 'invoice.payment_made',
    event_id: `test_evt_${Date.now()}_invoice_paid`,
    created_at: new Date().toISOString(),
    data: {
      type: 'invoice',
      id: `test_invoice_${Date.now()}`,
      object: {
        invoice: {
          id: `test_invoice_${Date.now()}`,
          invoice_number: `INV-${Date.now()}`,
          status: 'PAID',
          payment_requests: [
            {
              request_type: 'BALANCE',
              computed_amount_money: {
                amount: 5999,
                currency: 'USD'
              },
              due_date: new Date().toISOString().split('T')[0]
            }
          ],
          recipient: {
            customer_id: 'test_customer_123'
          }
        }
      }
    }
  },

  customerCreated: {
    type: 'customer.created',
    event_id: `test_evt_${Date.now()}_customer_created`,
    created_at: new Date().toISOString(),
    data: {
      type: 'customer',
      id: `test_customer_${Date.now()}`,
      object: {
        customer: {
          id: `test_customer_${Date.now()}`,
          email_address: 'test@example.com',
          given_name: 'Test',
          family_name: 'User',
          created_at: new Date().toISOString()
        }
      }
    }
  },

  refundCreated: {
    type: 'refund.created',
    event_id: `test_evt_${Date.now()}_refund_created`,
    created_at: new Date().toISOString(),
    data: {
      type: 'refund',
      id: `test_refund_${Date.now()}`,
      object: {
        refund: {
          id: `test_refund_${Date.now()}`,
          payment_id: `test_payment_${Date.now()}`,
          status: 'COMPLETED',
          amount_money: {
            amount: 2999,
            currency: 'USD'
          },
          reason: 'Customer requested refund'
        }
      }
    }
  }
}

async function sendWebhook(eventName: string, event: any) {
  try {
    const body = JSON.stringify(event)
    const signature = generateSignature(body)

    log(`\n📤 Sending ${eventName} webhook...`, colors.blue)

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': signature
      },
      body: body
    })

    if (response.ok) {
      const data = await response.json()
      log(`✅ ${eventName} webhook processed successfully`, colors.green)
      log(`   Response: ${JSON.stringify(data)}`)
      return true
    } else {
      const error = await response.text()
      log(`❌ ${eventName} webhook failed`, colors.red)
      log(`   Status: ${response.status}`)
      log(`   Error: ${error}`)
      return false
    }
  } catch (error) {
    log(`❌ Error sending ${eventName} webhook: ${error}`, colors.red)
    return false
  }
}

async function runWebhookTests() {
  log('🚀 Starting Square Webhook Tests', colors.green)
  log('=' .repeat(50))
  log('Webhook URL: ' + WEBHOOK_URL, colors.yellow)
  log('Note: Make sure your dev server is running on port 3000', colors.yellow)
  
  const results: Record<string, boolean> = {}

  // Test each webhook event
  for (const [name, event] of Object.entries(testEvents)) {
    results[name] = await sendWebhook(name, event)
    
    // Wait a bit between webhooks
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Summary
  log('\n' + '=' .repeat(50))
  log('📊 Test Results Summary:', colors.blue)
  
  let passedCount = 0
  let failedCount = 0
  
  for (const [name, success] of Object.entries(results)) {
    if (success) {
      log(`   ✅ ${name}`, colors.green)
      passedCount++
    } else {
      log(`   ❌ ${name}`, colors.red)
      failedCount++
    }
  }

  log('\n' + '=' .repeat(50))
  log(`Total: ${passedCount} passed, ${failedCount} failed`, 
    failedCount > 0 ? colors.yellow : colors.green)

  if (failedCount === Object.keys(results).length) {
    log('\n⚠️  All webhooks failed. Please check:', colors.yellow)
    log('1. Is your dev server running? (npm run dev)', colors.yellow)
    log('2. Is the webhook URL correct?', colors.yellow)
    log('3. Check the server logs for errors', colors.yellow)
  } else if (passedCount === Object.keys(results).length) {
    log('\n✨ All webhook tests passed successfully!', colors.green)
  }
}

// Menu for selective testing
async function showMenu() {
  log('\n📋 Square Webhook Test Menu', colors.magenta)
  log('=' .repeat(50))
  log('1. Test All Webhooks')
  log('2. Test Subscription Created')
  log('3. Test Payment Created')
  log('4. Test Subscription Updated')
  log('5. Test Subscription Canceled')
  log('6. Test Invoice Payment')
  log('7. Test Customer Created')
  log('8. Test Refund Created')
  log('0. Exit')
  log('=' .repeat(50))

  const args = process.argv.slice(2)
  const choice = args[0] || '1'

  switch (choice) {
    case '1':
      await runWebhookTests()
      break
    case '2':
      await sendWebhook('subscriptionCreated', testEvents.subscriptionCreated)
      break
    case '3':
      await sendWebhook('paymentCreated', testEvents.paymentCreated)
      break
    case '4':
      await sendWebhook('subscriptionUpdated', testEvents.subscriptionUpdated)
      break
    case '5':
      await sendWebhook('subscriptionCanceled', testEvents.subscriptionCanceled)
      break
    case '6':
      await sendWebhook('invoicePaymentMade', testEvents.invoicePaymentMade)
      break
    case '7':
      await sendWebhook('customerCreated', testEvents.customerCreated)
      break
    case '8':
      await sendWebhook('refundCreated', testEvents.refundCreated)
      break
    case '0':
      log('Exiting...', colors.blue)
      process.exit(0)
    default:
      log('Invalid choice. Running all tests...', colors.yellow)
      await runWebhookTests()
  }
}

// Run the tests
showMenu().catch(console.error)