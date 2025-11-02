#!/usr/bin/env node
/**
 * Production Test Payment Script
 * Creates real $1 test payments using Square Payment Links
 * IMPORTANT: This will charge real money in production!
 */

const { PrismaClient } = require('@prisma/client');
const { SquareClient, SquareEnvironment } = require('square');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

// Load environment variables
require('dotenv').config();

// Initialize Square client with production credentials
const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox
});

async function createProductionTestPayments() {
  console.log('🚀 Creating Production Test Payments');
  console.log('⚠️  WARNING: This will create REAL charges in production!');
  console.log('Environment:', process.env.SQUARE_ENVIRONMENT);
  console.log('================================================\n');

  try {
    // Step 1: Create customer in database
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

    // Step 2: Create Square customer
    console.log('\n2️⃣ Creating Square customer...');
    let squareCustomer;
    try {
      const searchResponse = await squareClient.customers.search({
        filter: {
          emailAddress: {
            exact: 'appvillagellc@gmail.com'
          }
        }
      });

      if (searchResponse.result.customers && searchResponse.result.customers.length > 0) {
        squareCustomer = searchResponse.result.customers[0];
        console.log('✅ Found existing Square customer:', squareCustomer.id);
      } else {
        const createResponse = await squareClient.customers.create({
          idempotencyKey: randomUUID(),
          givenName: 'Ira',
          familyName: 'Watkins',
          emailAddress: 'appvillagellc@gmail.com',
          address: {
            addressLine1: '251 Little Falls Dr',
            locality: 'Wilmington',
            administrativeDistrictLevel1: 'DE',
            postalCode: '19808',
            country: 'US'
          },
          companyName: 'App Village LLC'
        });
        squareCustomer = createResponse.result.customer;
        console.log('✅ Created Square customer:', squareCustomer.id);
      }
    } catch (error) {
      console.error('Square customer error:', error);
    }

    // Step 3: Create Payment Link for Monthly Subscription ($1)
    console.log('\n3️⃣ Creating $1 Monthly Subscription Payment Link...');
    const subscriptionLink = await squareClient.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      quickPay: {
        name: 'Website Custom Made - Monthly',
        priceMoney: {
          amount: BigInt(100), // $1.00 in cents
          currency: 'USD'
        },
        locationId: process.env.SQUARE_LOCATION_ID
      },
      checkoutOptions: {
        allowTipping: false,
        subscriptionPlanId: null, // For one-time payment first
        redirectUrl: 'http://localhost:3001/dashboard/billing?success=true',
        merchantSupportEmail: 'support@agistaffers.com'
      },
      prePopulatedData: {
        buyerEmail: 'appvillagellc@gmail.com',
        buyerAddress: {
          addressLine1: '251 Little Falls Dr',
          locality: 'Wilmington',
          administrativeDistrictLevel1: 'DE',
          postalCode: '19808',
          country: 'US',
          firstName: 'Ira',
          lastName: 'Watkins'
        }
      },
      paymentNote: 'Website Custom Made - Monthly Subscription ($1 test)'
    });

    const subscriptionUrl = subscriptionLink.result.paymentLink.url;
    console.log('✅ Subscription Payment Link created');
    console.log('📝 Payment ID:', subscriptionLink.result.paymentLink.id);

    // Step 4: Create Payment Link for One-Time Payment ($1)
    console.log('\n4️⃣ Creating $1 One-Time Payment Link...');
    const oneTimeLink = await squareClient.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      quickPay: {
        name: 'Google Analytics Add-on',
        priceMoney: {
          amount: BigInt(100), // $1.00 in cents
          currency: 'USD'
        },
        locationId: process.env.SQUARE_LOCATION_ID
      },
      checkoutOptions: {
        allowTipping: false,
        redirectUrl: 'http://localhost:3001/dashboard/billing?success=true',
        merchantSupportEmail: 'support@agistaffers.com'
      },
      prePopulatedData: {
        buyerEmail: 'appvillagellc@gmail.com',
        buyerAddress: {
          addressLine1: '251 Little Falls Dr',
          locality: 'Wilmington',
          administrativeDistrictLevel1: 'DE',
          postalCode: '19808',
          country: 'US',
          firstName: 'Ira',
          lastName: 'Watkins'
        }
      },
      paymentNote: 'Google Analytics Add-on - One-time payment ($1 test)'
    });

    const oneTimeUrl = oneTimeLink.result.paymentLink.url;
    console.log('✅ One-Time Payment Link created');
    console.log('📝 Payment ID:', oneTimeLink.result.paymentLink.id);

    // Step 5: Create pending orders in database
    console.log('\n5️⃣ Creating pending orders in database...');
    
    const subscriptionOrder = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-SUB-${Date.now()}`,
        plan: 'Website Custom Made',
        amount: 1.00,
        currency: 'USD',
        paymentMethod: 'square',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        billingPeriod: 'monthly',
        items: JSON.stringify([{
          name: 'Website Custom Made - Monthly',
          price: 1.00,
          quantity: 1,
          description: 'Monthly subscription for website hosting'
        }]),
        metadata: JSON.stringify({
          squarePaymentLinkId: subscriptionLink.result.paymentLink.id,
          testType: 'production_test',
          createdBy: 'production-test-script'
        })
      }
    });

    const oneTimeOrder = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-OT-${Date.now()}`,
        plan: 'Google Analytics Add-on',
        amount: 1.00,
        currency: 'USD',
        paymentMethod: 'square',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        billingPeriod: 'one_time',
        items: JSON.stringify([{
          name: 'Google Analytics Add-on',
          price: 1.00,
          quantity: 1,
          description: 'One-time setup for Google Analytics integration'
        }]),
        metadata: JSON.stringify({
          squarePaymentLinkId: oneTimeLink.result.paymentLink.id,
          testType: 'production_test',
          createdBy: 'production-test-script'
        })
      }
    });

    console.log('✅ Created pending orders');
    console.log('   - Subscription:', subscriptionOrder.orderNumber);
    console.log('   - One-Time:', oneTimeOrder.orderNumber);

    // Display results
    console.log('\n' + '='.repeat(60));
    console.log('✨ PRODUCTION TEST PAYMENTS READY!');
    console.log('='.repeat(60));
    console.log('\n📱 PAYMENT LINKS:\n');
    console.log('1. MONTHLY SUBSCRIPTION ($1.00):');
    console.log('   Website Custom Made - Monthly');
    console.log('   ' + subscriptionUrl);
    console.log('');
    console.log('2. ONE-TIME PAYMENT ($1.00):');
    console.log('   Google Analytics Add-on');
    console.log('   ' + oneTimeUrl);
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  IMPORTANT INSTRUCTIONS:');
    console.log('1. Click each link above to open Square checkout');
    console.log('2. Enter card: 5207 1100 3524 6351');
    console.log('3. Exp: 03/30, CVV: 130');
    console.log('4. Complete both payments ($2 total)');
    console.log('5. Webhooks will update order status automatically');
    console.log('6. Check http://localhost:3001/admin/orders to see results');
    console.log('='.repeat(60));
    console.log('\n🔄 Webhook endpoint: http://localhost:3001/api/webhooks/square');
    console.log('📊 Admin panel: http://localhost:3001/admin/orders');
    console.log('💳 Total charge: $2.00 USD (REAL MONEY)');

  } catch (error) {
    console.error('❌ Error:', error);
    if (error.result) {
      console.error('Square API Error:', JSON.stringify(error.result, null, 2));
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createProductionTestPayments();