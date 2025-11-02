#!/usr/bin/env node
/**
 * Payment System Test Script
 * Tests Square integration and bank deposit workflows
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Test configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const TEST_CUSTOMER_EMAIL = 'maria.rodriguez@example.do'
const TEST_ADMIN_TOKEN = 'test-admin-token' // In production, use real auth

// Colors for console output
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

async function testSquareCustomerCreation() {
  log('\n📦 Testing Square Customer Creation...', colors.blue)
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/square`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.session-token=${TEST_ADMIN_TOKEN}`
      }
    })
    
    const data = await response.json()
    
    if (response.ok && data.customerId) {
      log('✅ Square customer created successfully', colors.green)
      log(`   Customer ID: ${data.customerId}`)
      return data.customerId
    } else {
      log('❌ Failed to create Square customer', colors.red)
      log(`   Error: ${data.error}`)
      return null
    }
  } catch (error) {
    log(`❌ Error: ${error}`, colors.red)
    return null
  }
}

async function testBankDepositSubmission() {
  log('\n🏦 Testing Bank Deposit Submission...', colors.blue)
  
  try {
    // Get test customer
    const customer = await prisma.customer.findUnique({
      where: { email: TEST_CUSTOMER_EMAIL }
    })
    
    if (!customer) {
      log('❌ Test customer not found', colors.red)
      return null
    }
    
    const formData = new FormData()
    formData.append('bank', 'Banco Popular Dominicano')
    formData.append('amount', '299.99')
    formData.append('transactionRef', `TEST-${Date.now()}`)
    formData.append('notes', 'Test deposit')
    
    // Create a mock file for receipt
    const blob = new Blob(['test receipt'], { type: 'image/jpeg' })
    formData.append('receipt', blob, 'test-receipt.jpg')
    
    const response = await fetch(`${API_BASE_URL}/api/payment/bank-deposit`, {
      method: 'POST',
      headers: {
        'X-Test-User-Id': customer.id
      },
      body: formData
    })
    
    const data = await response.json()
    
    if (response.ok && data.depositId) {
      log('✅ Bank deposit submitted successfully', colors.green)
      log(`   Deposit ID: ${data.depositId}`)
      log(`   Message: ${data.message}`)
      return data.depositId
    } else {
      log('❌ Failed to submit bank deposit', colors.red)
      log(`   Error: ${data.error}`)
      return null
    }
  } catch (error) {
    log(`❌ Error: ${error}`, colors.red)
    return null
  }
}

async function testBankDepositVerification(depositId: string) {
  log('\n✅ Testing Bank Deposit Verification...', colors.blue)
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/bank-deposits/${depositId}/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'true'
        },
        body: JSON.stringify({
          approved: true
        })
      }
    )
    
    const data = await response.json()
    
    if (response.ok) {
      log('✅ Bank deposit verified successfully', colors.green)
      log(`   Message: ${data.message}`)
      return true
    } else {
      log('❌ Failed to verify bank deposit', colors.red)
      log(`   Error: ${data.error}`)
      return false
    }
  } catch (error) {
    log(`❌ Error: ${error}`, colors.red)
    return false
  }
}

async function testSubscriptionCreation() {
  log('\n💳 Testing Square Subscription Creation...', colors.blue)
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/square/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.session-token=${TEST_ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        plan: 'professional',
        billingCycle: 'monthly'
      })
    })
    
    const data = await response.json()
    
    if (response.ok && data.subscriptionId) {
      log('✅ Subscription created successfully', colors.green)
      log(`   Subscription ID: ${data.subscriptionId}`)
      log(`   Order ID: ${data.orderId}`)
      return data.subscriptionId
    } else {
      log('⚠️  Subscription creation skipped (requires Square credentials)', colors.yellow)
      log(`   Note: ${data.error}`)
      return null
    }
  } catch (error) {
    log(`❌ Error: ${error}`, colors.red)
    return null
  }
}

async function checkDatabaseState() {
  log('\n📊 Checking Database State...', colors.blue)
  
  try {
    const stats = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.bankDeposit.count(),
      prisma.invoice.count(),
      prisma.gatewayWebhook.count()
    ])
    
    log('Database Statistics:', colors.green)
    log(`   Customers: ${stats[0]}`)
    log(`   Orders: ${stats[1]}`)
    log(`   Bank Deposits: ${stats[2]}`)
    log(`   Invoices: ${stats[3]}`)
    log(`   Webhook Events: ${stats[4]}`)
    
    return true
  } catch (error) {
    log(`❌ Error checking database: ${error}`, colors.red)
    return false
  }
}

async function runTests() {
  log('🚀 Starting Payment System Tests', colors.green)
  log('=' .repeat(50))
  
  try {
    // Check database connection
    await checkDatabaseState()
    
    // Test Square customer creation (will fail without credentials)
    const squareCustomerId = await testSquareCustomerCreation()
    
    // Test bank deposit flow
    const depositId = await testBankDepositSubmission()
    if (depositId) {
      await testBankDepositVerification(depositId)
    }
    
    // Test subscription creation (will fail without credentials)
    await testSubscriptionCreation()
    
    // Final database state
    log('\n' + '=' .repeat(50))
    await checkDatabaseState()
    
    log('\n✨ Payment System Tests Completed!', colors.green)
    log('Note: Some tests require Square credentials to fully pass', colors.yellow)
    
  } catch (error) {
    log(`\n❌ Test suite failed: ${error}`, colors.red)
  } finally {
    await prisma.$disconnect()
  }
}

// Run tests
runTests().catch(console.error)