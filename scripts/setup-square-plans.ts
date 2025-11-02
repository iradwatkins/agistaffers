#!/usr/bin/env node
/**
 * Square Subscription Plans Setup Script
 * Creates subscription plans in Square Catalog
 */

import SquareService from '../lib/square-service'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function setupSquarePlans() {
  log('🚀 Setting up Square Subscription Plans', colors.green)
  log('=' .repeat(50))
  
  try {
    log('\n📦 Creating subscription plans in Square...', colors.blue)
    
    const plans = await SquareService.createSubscriptionPlans()
    
    if (plans && plans.length > 0) {
      log('\n✅ Successfully created subscription plans:', colors.green)
      
      plans.forEach((plan: any) => {
        log(`\n   Plan: ${plan.subscriptionPlanData?.name}`)
        log(`   ID: ${plan.id}`)
        log(`   Status: Active`)
      })
      
      log('\n📝 Next Steps:', colors.yellow)
      log('1. Update .env.local with the plan IDs above')
      log('2. Configure webhook URL in Square Dashboard:')
      log('   https://admin.agistaffers.com/api/webhooks/square')
      log('3. Test subscription creation with the test script')
      
    } else {
      log('\n⚠️  No plans were created', colors.yellow)
      log('Plans may already exist in your Square account', colors.yellow)
    }
    
    log('\n✨ Setup Complete!', colors.green)
    
  } catch (error: any) {
    log(`\n❌ Setup failed: ${error.message}`, colors.red)
    
    if (error.message?.includes('UNAUTHORIZED')) {
      log('\n⚠️  Authentication Error:', colors.yellow)
      log('Please check your Square credentials in .env.local', colors.yellow)
    }
  }
}

// Check environment
if (!process.env.SQUARE_ACCESS_TOKEN) {
  log('❌ Error: Square credentials not found in environment', colors.red)
  log('Please ensure .env.local is configured with Square credentials', colors.yellow)
  process.exit(1)
}

// Run setup
setupSquarePlans().catch(console.error)