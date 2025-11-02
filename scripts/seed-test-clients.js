const { PrismaClient } = require('@prisma/client');
const { SquareClient, SquareEnvironment } = require('square');
const { randomUUID } = require('crypto');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Initialize Square client
const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || 'EAAAl_gq0sTzzbjiVi_D0XJnG1G4_ZRwvNYYaP45XDob6_2119VgOUsN5tIq471r',
  environment: SquareEnvironment.Sandbox,
});

// Test clients data
const testClients = [
  {
    // Client 1: Dominican Restaurant
    companyName: 'Dominican Restaurant',
    contactName: 'Carlos Rodriguez',
    email: 'carlos@dominicanrestaurant.com',
    contactPhone: '+1-809-555-0100',
    country: 'DO',
    address: '123 Calle Principal',
    city: 'Santo Domingo',
    state: 'Distrito Nacional',
    zipCode: '10101',
    plan: 'professional',
    website: {
      siteName: 'Dominican Restaurant Online',
      domain: 'restaurant-dominicano.com',
      status: 'active',
      template: 'Restaurant'
    },
    subscription: {
      plan: 'Professional',
      price: 99.00,
      billingCycle: 'monthly',
      status: 'active'
    }
  },
  {
    // Client 2: Miami Tech Solutions
    companyName: 'Miami Tech Solutions',
    contactName: 'Jennifer Smith',
    email: 'jennifer@miamitech.com',
    contactPhone: '+1-305-555-0200',
    country: 'US',
    address: '456 Ocean Drive',
    city: 'Miami',
    state: 'FL',
    zipCode: '33139',
    plan: 'enterprise',
    website: {
      siteName: 'Miami Tech Solutions',
      domain: 'miami-tech.com',
      status: 'active',
      template: 'Corporate'
    },
    subscription: {
      plan: 'Enterprise',
      price: 299.00,
      billingCycle: 'monthly',
      status: 'active'
    }
  }
];

// Generate order number
function generateOrderNumber() {
  const prefix = 'ORD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Generate invoice number
function generateInvoiceNumber() {
  const prefix = 'INV';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
}

async function createSquareCustomer(clientData) {
  try {
    console.log(`  Creating Square customer for ${clientData.email}...`);
    
    // Check if customer exists
    const searchResponse = await squareClient.customersApi.searchCustomers({
      filter: {
        emailAddress: {
          exact: clientData.email
        }
      }
    });

    if (searchResponse.result.customers && searchResponse.result.customers.length > 0) {
      console.log(`  ✓ Square customer already exists`);
      return searchResponse.result.customers[0];
    }

    // Create new Square customer
    const response = await squareClient.customersApi.createCustomer({
      idempotencyKey: randomUUID(),
      givenName: clientData.contactName.split(' ')[0],
      familyName: clientData.contactName.split(' ').slice(1).join(' '),
      emailAddress: clientData.email,
      phoneNumber: clientData.contactPhone,
      companyName: clientData.companyName,
      address: {
        addressLine1: clientData.address,
        locality: clientData.city,
        administrativeDistrictLevel1: clientData.state,
        postalCode: clientData.zipCode,
        country: clientData.country
      }
    });

    console.log(`  ✓ Square customer created: ${response.result.customer.id}`);
    return response.result.customer;
  } catch (error) {
    console.log(`  ⚠ Square customer creation skipped (sandbox): ${error.message}`);
    return null;
  }
}

async function createTestPayment(customerId, amount, description) {
  try {
    console.log(`  Processing test payment of $${amount}...`);
    
    // In sandbox, we'll simulate a successful payment
    // Real implementation would use Square's payment API
    const paymentId = `pm_test_${randomUUID().substring(0, 8)}`;
    console.log(`  ✓ Test payment processed: ${paymentId}`);
    
    return {
      id: paymentId,
      status: 'COMPLETED',
      amountMoney: {
        amount: amount * 100, // Convert to cents
        currency: 'USD'
      },
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.log(`  ⚠ Payment simulation: ${error.message}`);
    return null;
  }
}

async function createOrGetProduct(plan, price) {
  // Check if product exists
  const existingProduct = await prisma.product.findFirst({
    where: { name: `${plan} Plan` }
  });

  if (existingProduct) {
    return existingProduct;
  }

  // Create product
  const product = await prisma.product.create({
    data: {
      name: `${plan} Plan`,
      description: `${plan} subscription plan for AGI Staffers`,
      price: price,
      interval: 'monthly',
      type: 'subscription',
      features: `${plan} tier features\nUnlimited websites\nPriority support\n24/7 monitoring`,
      metadata: {
        plan: plan.toLowerCase(),
        tier: plan,
        currency: 'USD'
      }
    }
  });

  return product;
}

async function seedClient(clientData, index) {
  console.log(`\n📦 Creating Client ${index + 1}: ${clientData.companyName}`);
  console.log('=' .repeat(60));
  
  try {
    // 1. Create customer in database
    console.log('  Creating customer record...');
    const customer = await prisma.customer.upsert({
      where: { email: clientData.email },
      update: {
        companyName: clientData.companyName,
        contactName: clientData.contactName,
        contactPhone: clientData.contactPhone,
        country: clientData.country,
        status: 'active',
        plan: clientData.plan
      },
      create: {
        companyName: clientData.companyName,
        contactName: clientData.contactName,
        email: clientData.email,
        contactPhone: clientData.contactPhone,
        country: clientData.country,
        status: 'active',
        plan: clientData.plan,
        billingEmail: clientData.email
      }
    });
    console.log(`  ✓ Customer created: ${customer.email}`);

    // 2. Create website
    console.log('  Creating website...');
    const website = await prisma.customerSite.upsert({
      where: { domain: clientData.website.domain },
      update: {
        siteName: clientData.website.siteName,
        status: clientData.website.status,
        template: clientData.website.template,
        sslEnabled: true
      },
      create: {
        customerId: customer.id,
        siteName: clientData.website.siteName,
        domain: clientData.website.domain,
        status: clientData.website.status,
        template: clientData.website.template,
        sslEnabled: true
      }
    });
    console.log(`  ✓ Website created: ${website.domain}`);

    // 3. Create Square customer
    const squareCustomer = await createSquareCustomer(clientData);
    
    // 4. Create or get product
    console.log('  Creating product...');
    const product = await createOrGetProduct(clientData.subscription.plan, clientData.subscription.price);
    console.log(`  ✓ Product ready: ${product.name}`);
    
    // 5. Create or update subscription
    console.log('  Creating subscription...');
    const subscription = await prisma.subscription.upsert({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId: product.id
        }
      },
      update: {
        status: clientData.subscription.status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        metadata: {
          plan: clientData.subscription.plan,
          price: clientData.subscription.price,
          billingCycle: clientData.subscription.billingCycle
        }
      },
      create: {
        customer: {
          connect: { id: customer.id }
        },
        product: {
          connect: { id: product.id }
        },
        status: clientData.subscription.status,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
        metadata: {
          plan: clientData.subscription.plan,
          price: clientData.subscription.price,
          billingCycle: clientData.subscription.billingCycle
        }
      }
    });
    console.log(`  ✓ Subscription ready: ${product.name}`);

    // 6. Create or update payment method
    console.log('  Creating payment method...');
    
    // First check if a payment method exists
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        customerId: customer.id,
        provider: 'square'
      }
    });
    
    const paymentMethod = existingPaymentMethod || await prisma.paymentMethod.create({
      data: {
        customer: {
          connect: { id: customer.id }
        },
        provider: 'square',
        providerCustomerId: squareCustomer?.id || `square_test_${customer.id.substring(0, 8)}`,
        isDefault: true,
        accountDetails: {
          type: 'card',
          cardBrand: 'Visa',
          cardLastFour: '1111',
          expiryMonth: '12',
          expiryYear: '2025'
        },
        metadata: {
          testCard: true,
          cardNumber: '4111 1111 1111 1111'
        }
      }
    });
    console.log(`  ✓ Payment method added: Visa ****1111`);

    // 7. Create order history (3-4 orders)
    console.log('  Creating order history...');
    const orderMonths = [3, 2, 1, 0]; // Last 4 months
    
    for (let monthsAgo of orderMonths) {
      const orderDate = new Date();
      orderDate.setMonth(orderDate.getMonth() - monthsAgo);
      
      const order = await prisma.order.create({
        data: {
          customer: {
            connect: { id: customer.id }
          },
          orderNumber: generateOrderNumber(),
          plan: clientData.subscription.plan,
          amount: clientData.subscription.price,
          currency: 'USD',
          paymentMethod: 'card',
          paymentStatus: 'completed',
          orderStatus: 'completed',
          billingPeriod: clientData.subscription.billingCycle,
          items: [
            {
              name: `${clientData.subscription.plan} Plan`,
              price: clientData.subscription.price,
              quantity: 1,
              description: `Monthly subscription for ${clientData.website.domain}`
            }
          ],
          metadata: {
            squareCustomerId: squareCustomer?.id,
            paymentProvider: 'square'
          },
          paidAt: orderDate,
          activatedAt: orderDate,
          createdAt: orderDate,
          subscriptionId: subscription.id,
          subscriptionStatus: 'active'
        }
      });
      console.log(`  ✓ Order created: ${order.orderNumber} (${monthsAgo === 0 ? 'Current' : monthsAgo + ' month(s) ago'})`);

      // Create corresponding invoice
      const invoice = await prisma.invoice.create({
        data: {
          customer: {
            connect: { id: customer.id }
          },
          invoiceNumber: generateInvoiceNumber(),
          amount: clientData.subscription.price,
          currency: 'USD',
          status: 'paid',
          dueDate: orderDate,
          paidAt: orderDate,
          billingPeriod: `${orderDate.toLocaleString('default', { month: 'long' })} ${orderDate.getFullYear()}`,
          items: [
            {
              name: `${clientData.subscription.plan} Plan`,
              price: clientData.subscription.price,
              quantity: 1
            }
          ],
          createdAt: orderDate
        }
      });
      console.log(`  ✓ Invoice created: ${invoice.invoiceNumber}`);

      // Simulate Square payment
      if (monthsAgo <= 1) {
        const payment = await createTestPayment(customer.id, clientData.subscription.price, `Payment for ${invoice.invoiceNumber}`);
      }
    }

    // 8. Create one pending invoice for next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const pendingInvoice = await prisma.invoice.create({
      data: {
        customer: {
          connect: { id: customer.id }
        },
        invoiceNumber: generateInvoiceNumber(),
        amount: clientData.subscription.price,
        currency: 'USD',
        status: 'pending',
        dueDate: nextMonth,
        billingPeriod: `${nextMonth.toLocaleString('default', { month: 'long' })} ${nextMonth.getFullYear()}`,
        items: [
          {
            name: `${clientData.subscription.plan} Plan`,
            price: clientData.subscription.price,
            quantity: 1
          }
        ]
      }
    });
    console.log(`  ✓ Pending invoice created: ${pendingInvoice.invoiceNumber}`);

    console.log(`\n✅ Client ${index + 1} setup complete!`);
    
    return customer;
  } catch (error) {
    console.error(`\n❌ Error creating client ${index + 1}:`, error);
    throw error;
  }
}

async function main() {
  console.log('\n🚀 AGI Staffers - Test Client Seeding Script');
  console.log('============================================\n');
  
  console.log('📋 Configuration:');
  console.log('  Square Environment: Sandbox');
  console.log('  Test Card: 4111 1111 1111 1111');
  console.log('  Clients to create: 2');
  console.log('  Orders per client: 4 (3 paid, 1 pending)');
  
  try {
    // Seed both test clients
    const createdClients = [];
    for (let i = 0; i < testClients.length; i++) {
      const client = await seedClient(testClients[i], i);
      createdClients.push(client);
    }
    
    // Display summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 SEEDING COMPLETE - SUMMARY');
    console.log('=' .repeat(60));
    
    // Get statistics
    const [totalCustomers, totalWebsites, totalOrders, totalRevenue] = await Promise.all([
      prisma.customer.count(),
      prisma.customerSite.count(),
      prisma.order.count(),
      prisma.invoice.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      })
    ]);
    
    console.log('\n📈 Platform Statistics:');
    console.log(`  Total Customers: ${totalCustomers}`);
    console.log(`  Total Websites: ${totalWebsites}`);
    console.log(`  Total Orders: ${totalOrders}`);
    console.log(`  Total Revenue: $${totalRevenue._sum.amount || 0}`);
    
    console.log('\n👥 Created Clients:');
    createdClients.forEach((client, index) => {
      console.log(`  ${index + 1}. ${client.companyName} (${client.country})`);
      console.log(`     Email: ${client.email}`);
      console.log(`     Plan: ${client.plan}`);
    });
    
    console.log('\n🎯 Next Steps:');
    console.log('  1. Login as admin: iradwatkins@gmail.com');
    console.log('  2. Visit /admin to see platform overview');
    console.log('  3. Visit /admin/websites to see all client sites');
    console.log('  4. Visit /admin/orders to see all orders');
    console.log('  5. Visit /admin/billing to see revenue');
    
    console.log('\n✅ Test data successfully created!');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});