#!/usr/bin/env node
/**
 * Create Test Order Script
 * Creates a real order in the database to test admin panel
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestOrder() {
  console.log('🚀 Creating test order with $99.99 payment...\n');

  try {
    // First, ensure we have a test customer
    let customer = await prisma.customer.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!customer) {
      console.log('Creating test customer...');
      customer = await prisma.customer.create({
        data: {
          email: 'test@example.com',
          contactName: 'Test Customer',
          companyName: 'Test Company Inc.',
          contactPhone: '1234567890',
          country: 'Dominican Republic',
          plan: 'Professional',
          status: 'active'
        }
      });
      console.log('✅ Test customer created');
    }

    // Create the $99.99 test order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-${Date.now()}`,
        plan: 'Professional',
        amount: 99.99,
        currency: 'USD',
        paymentMethod: 'square',
        paymentStatus: 'completed',
        orderStatus: 'active',
        billingPeriod: 'monthly',
        items: JSON.stringify([
          {
            name: 'Professional Plan',
            price: 99.99,
            quantity: 1,
            description: 'Monthly subscription'
          }
        ]),
        metadata: JSON.stringify({
          squarePaymentId: `test_payment_${Date.now()}`,
          source: 'webhook_test'
        }),
        paidAt: new Date(),
        activatedAt: new Date()
      }
    });

    console.log('\n✅ Test order created successfully!');
    console.log('Order Details:');
    console.log('- Order Number:', order.orderNumber);
    console.log('- Amount: $' + order.amount);
    console.log('- Customer:', customer.email);
    console.log('- Status:', order.paymentStatus);
    console.log('- Payment Method:', order.paymentMethod);

    // Create additional orders for variety
    console.log('\nCreating additional test orders...');

    // Pending order
    await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-${Date.now()}-2`,
        plan: 'Basic',
        amount: 49.99,
        currency: 'USD',
        paymentMethod: 'card',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        billingPeriod: 'monthly',
        items: JSON.stringify([{ name: 'Basic Plan', price: 49.99 }])
      }
    });

    // Failed order
    await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-${Date.now()}-3`,
        plan: 'Enterprise',
        amount: 199.99,
        currency: 'USD',
        paymentMethod: 'bank_deposit',
        paymentStatus: 'failed',
        orderStatus: 'failed',
        billingPeriod: 'yearly',
        items: JSON.stringify([{ name: 'Enterprise Plan', price: 199.99 }]),
        metadata: JSON.stringify({ failureReason: 'Insufficient funds' })
      }
    });

    // Create another customer with completed payment
    const customer2 = await prisma.customer.upsert({
      where: { email: 'premium@business.com' },
      update: {},
      create: {
        email: 'premium@business.com',
        contactName: 'Premium Business',
        companyName: 'Premium Corp',
        country: 'United States',
        plan: 'Enterprise',
        status: 'active'
      }
    });

    await prisma.order.create({
      data: {
        customerId: customer2.id,
        orderNumber: `ORD-${Date.now()}-4`,
        plan: 'Enterprise',
        amount: 299.99,
        currency: 'USD',
        paymentMethod: 'square',
        paymentStatus: 'completed',
        orderStatus: 'active',
        billingPeriod: 'yearly',
        items: JSON.stringify([{ name: 'Enterprise Annual', price: 299.99 }]),
        paidAt: new Date()
      }
    });

    console.log('✅ Created 4 test orders total');

    // Show summary
    const orderCount = await prisma.order.count();
    const completedCount = await prisma.order.count({ 
      where: { paymentStatus: 'completed' } 
    });
    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: 'completed' },
      _sum: { amount: true }
    });

    console.log('\n📊 Database Summary:');
    console.log('- Total Orders:', orderCount);
    console.log('- Completed Orders:', completedCount);
    console.log('- Total Revenue: $' + totalRevenue._sum.amount);

    console.log('\n✨ Test data created successfully!');
    console.log('Visit http://localhost:3001/admin/orders to see the orders');

  } catch (error) {
    console.error('❌ Error creating test order:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrder();