#!/usr/bin/env node
/**
 * Square Webhook Setup Script
 * Creates webhook subscriptions programmatically via Square API
 * Created: August 14, 2025
 * Author: AGI Staffers Development Team
 */

import { SquareClient, SquareEnvironment } from 'square'
import { randomUUID } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message: string, color = colors.reset) {
  const timestamp = new Date().toISOString()
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`)
}

// Initialize Square client
const client = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox,
})

// Webhook configuration
const WEBHOOK_CONFIGS = {
  sandbox: {
    name: 'AGI Staffers Sandbox Webhook',
    url: process.env.SQUARE_WEBHOOK_URL_SANDBOX || 'https://admin.agistaffers.com/api/webhooks/square',
    events: [
      'payment.created',
      'payment.updated',
      'subscription.created',
      'subscription.updated', 
      'subscription.canceled',
      'invoice.payment_made',
      'invoice.sent',
      'invoice.scheduled_charge_failed',
      'customer.created',
      'customer.updated',
      'customer.deleted',
      'refund.created',
      'refund.updated',
      'card.automatically_updated',
      'card.disabled'
    ]
  },
  production: {
    name: 'AGI Staffers Production Webhook',
    url: process.env.SQUARE_WEBHOOK_URL_PRODUCTION || 'https://admin.agistaffers.com/api/webhooks/square',
    events: [
      'payment.created',
      'payment.updated',
      'subscription.created',
      'subscription.updated',
      'subscription.canceled',
      'invoice.payment_made',
      'invoice.sent',
      'invoice.scheduled_charge_failed',
      'customer.created',
      'customer.updated',
      'customer.deleted',
      'refund.created',
      'refund.updated',
      'card.automatically_updated',
      'card.disabled'
    ]
  }
}

async function listExistingWebhooks() {
  log('📋 Checking existing webhooks...', colors.cyan)
  
  try {
    const response = await client.webhookSubscriptionsApi.listWebhookSubscriptions()
    
    if (response.result.subscriptions && response.result.subscriptions.length > 0) {
      log(`Found ${response.result.subscriptions.length} existing webhook(s):`, colors.yellow)
      
      response.result.subscriptions.forEach((sub: any) => {
        log(`  - ${sub.name || 'Unnamed'}`, colors.yellow)
        log(`    ID: ${sub.id}`, colors.yellow)
        log(`    URL: ${sub.notificationUrl}`, colors.yellow)
        log(`    Enabled: ${sub.enabled}`, colors.yellow)
        log(`    Events: ${sub.eventTypes?.length || 0} configured`, colors.yellow)
      })
      
      return response.result.subscriptions
    } else {
      log('No existing webhooks found', colors.green)
      return []
    }
  } catch (error: any) {
    log(`Error listing webhooks: ${error.message}`, colors.red)
    return []
  }
}

async function createWebhookSubscription(config: any) {
  const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox'
  log(`\n🚀 Creating ${environment} webhook subscription...`, colors.blue)
  
  try {
    const response = await client.webhookSubscriptionsApi.createWebhookSubscription({
      idempotencyKey: randomUUID(),
      subscription: {
        name: config.name,
        notificationUrl: config.url,
        eventTypes: config.events,
        enabled: true
      }
    })
    
    if (response.result.subscription) {
      const subscription = response.result.subscription
      log('✅ Webhook subscription created successfully!', colors.green)
      log(`   ID: ${subscription.id}`, colors.green)
      log(`   Name: ${subscription.name}`, colors.green)
      log(`   URL: ${subscription.notificationUrl}`, colors.green)
      log(`   Signature Key: ${subscription.signatureKey}`, colors.green)
      log(`   API Version: ${subscription.apiVersion}`, colors.green)
      log(`   Events: ${subscription.eventTypes?.length} configured`, colors.green)
      
      return subscription
    }
  } catch (error: any) {
    log(`❌ Error creating webhook: ${error.message}`, colors.red)
    
    if (error.errors) {
      error.errors.forEach((err: any) => {
        log(`   - ${err.category}: ${err.code} - ${err.detail}`, colors.red)
      })
    }
    
    return null
  }
}

async function updateWebhookSubscription(subscriptionId: string, config: any) {
  log(`\n🔄 Updating webhook subscription ${subscriptionId}...`, colors.blue)
  
  try {
    const response = await client.webhookSubscriptionsApi.updateWebhookSubscription(
      subscriptionId,
      {
        subscription: {
          name: config.name,
          notificationUrl: config.url,
          eventTypes: config.events,
          enabled: true
        }
      }
    )
    
    if (response.result.subscription) {
      const subscription = response.result.subscription
      log('✅ Webhook subscription updated successfully!', colors.green)
      log(`   Signature Key: ${subscription.signatureKey}`, colors.green)
      return subscription
    }
  } catch (error: any) {
    log(`❌ Error updating webhook: ${error.message}`, colors.red)
    return null
  }
}

async function deleteWebhookSubscription(subscriptionId: string) {
  log(`\n🗑️  Deleting webhook subscription ${subscriptionId}...`, colors.yellow)
  
  try {
    await client.webhookSubscriptionsApi.deleteWebhookSubscription(subscriptionId)
    log('✅ Webhook subscription deleted successfully!', colors.green)
    return true
  } catch (error: any) {
    log(`❌ Error deleting webhook: ${error.message}`, colors.red)
    return false
  }
}

async function testWebhookEndpoint(url: string) {
  log(`\n🧪 Testing webhook endpoint: ${url}`, colors.cyan)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': 'test-signature'
      },
      body: JSON.stringify({
        type: 'webhook.test',
        event_id: `test_${Date.now()}`,
        created_at: new Date().toISOString(),
        data: {
          type: 'test',
          object: {
            test: true
          }
        }
      })
    })
    
    if (response.ok) {
      log('✅ Webhook endpoint is reachable', colors.green)
      return true
    } else {
      log(`⚠️  Webhook endpoint returned status: ${response.status}`, colors.yellow)
      return false
    }
  } catch (error: any) {
    log(`❌ Cannot reach webhook endpoint: ${error.message}`, colors.red)
    log('   Make sure your server is running and accessible', colors.yellow)
    return false
  }
}

async function saveWebhookConfig(subscription: any) {
  const configPath = path.join(process.cwd(), '.webhook-config.json')
  const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox'
  
  let config: any = {}
  
  // Load existing config if it exists
  if (fs.existsSync(configPath)) {
    const existing = fs.readFileSync(configPath, 'utf-8')
    config = JSON.parse(existing)
  }
  
  // Update with new subscription info
  config[environment] = {
    subscriptionId: subscription.id,
    signatureKey: subscription.signatureKey,
    url: subscription.notificationUrl,
    createdAt: subscription.createdAt,
    updatedAt: new Date().toISOString()
  }
  
  // Save config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  log(`\n💾 Webhook configuration saved to ${configPath}`, colors.green)
  
  // Update .env.local with signature key
  updateEnvFile(subscription.signatureKey)
}

function updateEnvFile(signatureKey: string) {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf-8')
    
    // Check if SQUARE_WEBHOOK_SIGNATURE_KEY exists
    if (envContent.includes('SQUARE_WEBHOOK_SIGNATURE_KEY=')) {
      // Update existing key
      envContent = envContent.replace(
        /SQUARE_WEBHOOK_SIGNATURE_KEY=.*/,
        `SQUARE_WEBHOOK_SIGNATURE_KEY="${signatureKey}"`
      )
      log('✅ Updated SQUARE_WEBHOOK_SIGNATURE_KEY in .env.local', colors.green)
    } else {
      // Add new key
      envContent += `\n# Square Webhook Signature (Auto-generated on ${new Date().toISOString()})\nSQUARE_WEBHOOK_SIGNATURE_KEY="${signatureKey}"\n`
      log('✅ Added SQUARE_WEBHOOK_SIGNATURE_KEY to .env.local', colors.green)
    }
    
    fs.writeFileSync(envPath, envContent)
  } else {
    log('⚠️  .env.local not found. Please add manually:', colors.yellow)
    log(`   SQUARE_WEBHOOK_SIGNATURE_KEY="${signatureKey}"`, colors.yellow)
  }
}

async function main() {
  log('=' .repeat(60), colors.cyan)
  log('🎯 AGI Staffers - Square Webhook Setup', colors.cyan)
  log(`📅 Date: ${new Date().toLocaleString()}`, colors.cyan)
  log(`🌍 Environment: ${process.env.SQUARE_ENVIRONMENT || 'sandbox'}`, colors.cyan)
  log('=' .repeat(60), colors.cyan)
  
  // Check if Square credentials are configured
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    log('\n❌ Error: SQUARE_ACCESS_TOKEN not found in environment', colors.red)
    log('Please configure your Square credentials in .env.local', colors.yellow)
    process.exit(1)
  }
  
  const environment = process.env.SQUARE_ENVIRONMENT || 'sandbox'
  const config = WEBHOOK_CONFIGS[environment as keyof typeof WEBHOOK_CONFIGS]
  
  // Test webhook endpoint
  const isReachable = await testWebhookEndpoint(config.url)
  
  if (!isReachable) {
    log('\n⚠️  Warning: Webhook endpoint is not reachable', colors.yellow)
    log('Continuing with setup anyway...', colors.yellow)
  }
  
  // List existing webhooks
  const existingWebhooks = await listExistingWebhooks()
  
  // Check if we already have a webhook for this URL
  const existingWebhook = existingWebhooks.find(
    (sub: any) => sub.notificationUrl === config.url
  )
  
  let subscription = null
  
  if (existingWebhook) {
    log(`\n📌 Found existing webhook for ${config.url}`, colors.yellow)
    
    // Ask user what to do (in automated script, we'll update)
    subscription = await updateWebhookSubscription(existingWebhook.id, config)
  } else {
    // Create new webhook
    subscription = await createWebhookSubscription(config)
  }
  
  if (subscription) {
    // Save configuration
    await saveWebhookConfig(subscription)
    
    log('\n' + '=' .repeat(60), colors.green)
    log('✅ Square Webhook Setup Complete!', colors.green)
    log('=' .repeat(60), colors.green)
    
    log('\n📋 Next Steps:', colors.cyan)
    log('1. Restart your application to load the new signature key', colors.cyan)
    log('2. Test webhook events using scripts/test-square-webhooks.ts', colors.cyan)
    log('3. Monitor webhook events in your database', colors.cyan)
    log('4. Check Square Dashboard for webhook activity', colors.cyan)
    
    log('\n🔐 Important Security Notes:', colors.yellow)
    log('- Never commit .webhook-config.json to git', colors.yellow)
    log('- Keep your signature key secret', colors.yellow)
    log('- Whitelist Square IP addresses in production:', colors.yellow)
    log('  Production: 54.245.1.154, 34.202.99.168', colors.yellow)
    log('  Sandbox: 54.212.177.79, 107.20.218.8', colors.yellow)
  } else {
    log('\n❌ Webhook setup failed', colors.red)
    log('Please check the errors above and try again', colors.yellow)
  }
}

// Run the setup
main().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red)
  process.exit(1)
})