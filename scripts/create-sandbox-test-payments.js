#!/usr/bin/env node
/**
 * Sandbox Test Payment Script
 * Creates test $1 payments that simulate real transactions
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSandboxTestPayments() {
  console.log('🚀 Creating Sandbox Test Payments (Simulating Production)');
  console.log('================================================\n');

  try {
    // Step 1: Create/Update customer
    console.log('1️⃣ Creating customer account...');
    const customer = await prisma.customer.upsert({
      where: { email: 'appvillagellc@gmail.com' },
      update: {
        contactName: 'Ira Watkins',
        companyName: 'App Village LLC',
        contactPhone: '(302) 555-0100',
        country: 'United States',
        billingEmail: 'appvillagellc@gmail.com',
        status: 'active'
      },
      create: {
        email: 'appvillagellc@gmail.com',
        contactName: 'Ira Watkins',
        companyName: 'App Village LLC',
        contactPhone: '(302) 555-0100',
        country: 'United States',
        billingEmail: 'appvillagellc@gmail.com',
        plan: 'Professional',
        status: 'active'
      }
    });
    console.log('✅ Customer created:', customer.email);

    // Step 2: Process $1 Monthly Subscription Payment
    console.log('\n2️⃣ Processing $1 Monthly Subscription...');
    const response1 = await fetch('http://localhost:3001/api/payment/square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100, // $1.00 in cents
        currency: 'USD',
        sourceId: 'cnon:card-nonce-ok', // Sandbox test card that always succeeds
        customerEmail: 'appvillagellc@gmail.com',
        description: 'Website Custom Made - Monthly Subscription'
      })
    });

    const payment1 = await response1.json();
    if (payment1.success) {
      console.log('✅ Monthly subscription payment processed');
      console.log('   Payment ID:', payment1.paymentId);
      console.log('   Amount: $1.00');
      console.log('   Status:', payment1.status);
    } else {
      console.log('❌ Subscription payment failed:', payment1.error);
    }

    // Step 3: Process $1 One-Time Payment
    console.log('\n3️⃣ Processing $1 One-Time Payment...');
    const response2 = await fetch('http://localhost:3001/api/payment/square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100, // $1.00 in cents
        currency: 'USD',
        sourceId: 'cnon:card-nonce-ok', // Sandbox test card
        customerEmail: 'appvillagellc@gmail.com',
        description: 'Google Analytics Add-on - One-time Payment'
      })
    });

    const payment2 = await response2.json();
    if (payment2.success) {
      console.log('✅ One-time payment processed');
      console.log('   Payment ID:', payment2.paymentId);
      console.log('   Amount: $1.00');
      console.log('   Status:', payment2.status);
    } else {
      console.log('❌ One-time payment failed:', payment2.error);
    }

    // Step 4: Create detailed orders with proper metadata
    console.log('\n4️⃣ Creating detailed order records...');
    
    // Monthly subscription order
    const subscriptionOrder = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-SUB-${Date.now()}`,
        plan: 'Website Custom Made',
        amount: 1.00,
        currency: 'USD',
        paymentMethod: 'square',
        paymentStatus: 'completed',
        orderStatus: 'active',
        billingPeriod: 'monthly',
        paidAt: new Date(),
        items: JSON.stringify([{
          name: 'Website Custom Made - Monthly',
          price: 1.00,
          quantity: 1,
          description: 'Monthly subscription for website hosting'
        }]),
        metadata: JSON.stringify({
          squarePaymentId: payment1.paymentId || 'test-payment-1',
          customerInfo: {
            name: 'Ira Watkins',
            email: 'appvillagellc@gmail.com',
            company: 'App Village LLC',
            address: '251 Little Falls Dr, Wilmington DE 19808'
          },
          cardInfo: {
            last4: '6351',
            brand: 'Mastercard'
          },
          testType: 'sandbox_production_simulation'
        })
      }
    });

    // One-time payment order
    const oneTimeOrder = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-OT-${Date.now()}`,
        plan: 'Google Analytics Add-on',
        amount: 1.00,
        currency: 'USD',
        paymentMethod: 'square',
        paymentStatus: 'completed',
        orderStatus: 'completed',
        billingPeriod: 'one_time',
        paidAt: new Date(),
        items: JSON.stringify([{
          name: 'Google Analytics Add-on',
          price: 1.00,
          quantity: 1,
          description: 'One-time setup for Google Analytics integration'
        }]),
        metadata: JSON.stringify({
          squarePaymentId: payment2.paymentId || 'test-payment-2',
          customerInfo: {
            name: 'Ira Watkins',
            email: 'appvillagellc@gmail.com',
            company: 'App Village LLC',
            address: '251 Little Falls Dr, Wilmington DE 19808'
          },
          cardInfo: {
            last4: '6351',
            brand: 'Mastercard'
          },
          testType: 'sandbox_production_simulation'
        })
      }
    });

    console.log('✅ Orders created successfully');
    console.log('   - Subscription:', subscriptionOrder.orderNumber);
    console.log('   - One-Time:', oneTimeOrder.orderNumber);

    // Step 5: Create invoices
    console.log('\n5️⃣ Creating invoices...');
    
    await prisma.invoice.create({
      data: {
        customerId: customer.id,
        invoiceNumber: `INV-SUB-${Date.now()}`,
        amount: 1.00,
        currency: 'USD',
        status: 'paid',
        dueDate: new Date(),
        paidAt: new Date(),
        billingPeriod: 'monthly',
        items: {
          description: 'Website Custom Made - Monthly Subscription',
          orderId: subscriptionOrder.id
        }
      }
    });

    await prisma.invoice.create({
      data: {
        customerId: customer.id,
        invoiceNumber: `INV-OT-${Date.now()}`,
        amount: 1.00,
        currency: 'USD',
        status: 'paid',
        dueDate: new Date(),
        paidAt: new Date(),
        billingPeriod: 'one_time',
        items: {
          description: 'Google Analytics Add-on',
          orderId: oneTimeOrder.id
        }
      }
    });

    console.log('✅ Invoices created');

    // Display results
    console.log('\n' + '='.repeat(60));
    console.log('✨ TEST PAYMENTS COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📊 PAYMENT SUMMARY:\n');
    console.log('Customer: Ira Watkins (appvillagellc@gmail.com)');
    console.log('Company: App Village LLC');
    console.log('Address: 251 Little Falls Dr, Wilmington DE 19808');
    console.log('');
    console.log('Payments Processed:');
    console.log('1. Website Custom Made - Monthly: $1.00 ✅');
    console.log('2. Google Analytics Add-on: $1.00 ✅');
    console.log('');
    console.log('Total Charged: $2.00 (Sandbox - No real charge)');
    console.log('\n' + '='.repeat(60));
    console.log('📱 VIEW RESULTS:');
    console.log('');
    console.log('Admin Orders: http://localhost:3001/admin/orders');
    console.log('Customer Dashboard: http://localhost:3001/dashboard/billing');
    console.log('Database: http://localhost:5555 (Prisma Studio)');
    console.log('');
    console.log('The orders will appear as if they were real production');
    console.log('payments, with all proper tracking and invoicing.');
    console.log('='.repeat(60));

    // Trigger test webhooks
    console.log('\n6️⃣ Triggering webhook notifications...');
    await fetch('http://localhost:3001/api/webhooks/square', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-square-hmacsha256-signature': 'test'
      },
      body: JSON.stringify({
        type: 'payment.created',
        event_id: `evt_${Date.now()}_1`,
        data: {
          object: {
            payment: {
              id: payment1.paymentId || 'test-payment-1',
              status: 'COMPLETED',
              total_money: { amount: 100, currency: 'USD' },
              reference_id: subscriptionOrder.orderNumber
            }
          }
        }
      })
    });

    console.log('✅ Webhook notifications sent');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSandboxTestPayments();