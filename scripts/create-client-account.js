const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createClientAccount() {
  try {
    console.log('🔨 Creating CLIENT test account...\n');
    
    // Step 1: Create User record for CLIENT
    const clientUser = await prisma.user.upsert({
      where: { email: 'client@test.com' },
      update: {
        name: 'Test Client',
      },
      create: {
        email: 'client@test.com',
        name: 'Test Client',
        isAdmin: false, // Not an admin, just a client
      }
    });
    console.log('✅ Created User: client@test.com');

    // Step 2: Create Customer record for CLIENT
    const clientCustomer = await prisma.customer.upsert({
      where: { email: 'client@test.com' },
      update: {
        companyName: 'Test Business LLC',
        contactName: 'Test Client',
      },
      create: {
        email: 'client@test.com',
        companyName: 'Test Business LLC',
        contactName: 'Test Client',
        contactPhone: '+1-555-0200',
        plan: 'professional',
        status: 'active',
        billingEmail: 'billing@testbusiness.com',
        country: 'US',
      }
    });
    console.log('✅ Created Customer: Test Business LLC');

    // Step 3: Get the 3 existing test websites
    const existingWebsites = await prisma.customerSite.findMany({
      take: 3,
      orderBy: { createdAt: 'asc' }
    });

    console.log(`\n📦 Found ${existingWebsites.length} existing websites`);

    // Step 4: Assign the websites to CLIENT
    for (const website of existingWebsites) {
      await prisma.customerSite.update({
        where: { id: website.id },
        data: { customerId: clientCustomer.id }
      });
      console.log(`✅ Assigned "${website.siteName}" to CLIENT`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ CLIENT ACCOUNT CREATED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('Email: client@test.com');
    console.log('Password: admin123');
    console.log('\nNOTE: CLIENT needs to use Magic Link or Google OAuth to login');
    console.log('(Password login only works for admin users currently)');
    console.log('\n🌐 CLIENT has access to:');
    console.log('- 3 test websites');
    console.log('- Customer dashboard at /dashboard');
    console.log('- Can manage only their own data');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createClientAccount();