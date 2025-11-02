const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testClientWebsite() {
  try {
    console.log('🔍 Testing CLIENT website setup...\n');
    
    // 1. Check if client@test.com exists as a Customer
    const customer = await prisma.customer.findUnique({
      where: { email: 'client@test.com' },
      include: { site: true }
    });
    
    if (!customer) {
      console.log('❌ No customer found with email: client@test.com');
      console.log('Creating customer now...');
      
      // Create the customer
      const newCustomer = await prisma.customer.create({
        data: {
          email: 'client@test.com',
          companyName: 'Test Business LLC',
          contactName: 'Test Client',
          contactPhone: '+1-555-0200',
          plan: 'professional',
          status: 'active',
          billingEmail: 'billing@testbusiness.com',
          country: 'US'
        }
      });
      console.log('✅ Customer created:', newCustomer.id);
      
      // Find an available template
      const template = await prisma.siteTemplate.findFirst();
      
      if (template) {
        // Create a website for the customer
        const site = await prisma.customerSite.create({
          data: {
            customerId: newCustomer.id,
            siteName: 'Test Client Website',
            domain: 'testclient.com',
            subdomain: 'testclient',
            templateId: template.id,
            status: 'active',
            sslEnabled: true,
            deploymentConfig: {
              environment: 'production',
              nodeVersion: '18'
            },
            customization: {
              primaryColor: '#3b82f6',
              companyName: 'Test Business LLC'
            },
            resourceLimits: {
              cpu: '1 vCPU',
              memory: '2GB',
              storage: '10GB'
            },
            metrics: {
              pageViews: 0,
              uniqueVisitors: 0,
              uptime: 100
            }
          }
        });
        console.log('✅ Website created:', site.siteName);
      }
      
    } else {
      console.log('✅ Customer found:', customer.companyName);
      console.log('   Email:', customer.email);
      console.log('   ID:', customer.id);
      console.log('   Plan:', customer.plan);
      
      if (customer.site) {
        console.log('\n📦 Website Details:');
        console.log('   Name:', customer.site.siteName);
        console.log('   Domain:', customer.site.domain);
        console.log('   Status:', customer.site.status);
        console.log('   Created:', customer.site.createdAt);
      } else {
        console.log('\n⚠️ No website found for this customer');
        
        // Create a website
        const template = await prisma.siteTemplate.findFirst();
        if (template) {
          const site = await prisma.customerSite.create({
            data: {
              customerId: customer.id,
              siteName: 'Test Client Website',
              domain: 'testclient.com',
              subdomain: 'testclient',
              templateId: template.id,
              status: 'active',
              sslEnabled: true,
              deploymentConfig: {
                environment: 'production',
                nodeVersion: '18'
              },
              customization: {
                primaryColor: '#3b82f6',
                companyName: 'Test Business LLC'
              },
              resourceLimits: {
                cpu: '1 vCPU',
                memory: '2GB',
                storage: '10GB'
              },
              metrics: {
                pageViews: 0,
                uniqueVisitors: 0,
                uptime: 100
              }
            }
          });
          console.log('✅ Website created:', site.siteName);
        }
      }
    }
    
    // 2. Check if client@test.com exists as User (for login)
    const user = await prisma.user.findUnique({
      where: { email: 'client@test.com' }
    });
    
    if (!user) {
      console.log('\n⚠️ No User record found for client@test.com');
      console.log('Creating User record for authentication...');
      
      const newUser = await prisma.user.create({
        data: {
          email: 'client@test.com',
          name: 'Test Client',
          isAdmin: false
        }
      });
      console.log('✅ User record created');
    } else {
      console.log('\n✅ User record exists for authentication');
    }
    
    // 3. Check AdminUser for password login
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: 'client@test.com' }
    });
    
    if (adminUser) {
      console.log('✅ Password login enabled for client@test.com');
    } else {
      console.log('⚠️ No password login set up for client@test.com');
    }
    
    console.log('\n📋 Summary:');
    console.log('- Email: client@test.com');
    console.log('- Password: admin123');
    console.log('- Login at: http://localhost:3000/login');
    console.log('- Dashboard: http://localhost:3000/dashboard/websites');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testClientWebsite();