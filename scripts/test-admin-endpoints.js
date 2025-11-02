const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Test endpoints
const endpoints = [
  { name: 'Admin Stats', url: '/api/admin/stats', method: 'GET' },
  { name: 'Admin Websites', url: '/api/admin/websites', method: 'GET' },
  { name: 'Admin Users', url: '/api/admin/users', method: 'GET' },
  { name: 'Customer Sites', url: '/api/customer-sites', method: 'GET' },
  { name: 'Customer Stats', url: '/api/customer/stats', method: 'GET' },
];

async function testEndpoints() {
  console.log('🧪 Testing Admin API Endpoints\n');
  console.log('=' .repeat(50));
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(BASE_URL + endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const status = response.status;
      let result = '';
      
      if (status === 200) {
        const data = await response.json();
        if (endpoint.url.includes('admin')) {
          result = `❌ FAIL - Admin endpoint accessible without auth!`;
        } else {
          result = `✅ OK - Public endpoint working`;
        }
      } else if (status === 401) {
        if (endpoint.url.includes('admin')) {
          result = `✅ PASS - Admin endpoint properly protected`;
        } else {
          result = `⚠️  WARN - Public endpoint returning 401`;
        }
      } else {
        result = `⚠️  Status: ${status}`;
      }
      
      console.log(`${endpoint.name}:`);
      console.log(`  URL: ${endpoint.url}`);
      console.log(`  Status: ${status}`);
      console.log(`  Result: ${result}`);
      console.log();
      
    } catch (error) {
      console.log(`${endpoint.name}: ❌ ERROR - ${error.message}\n`);
    }
  }
  
  console.log('=' .repeat(50));
  console.log('\n📊 Test Summary:');
  console.log('- Admin endpoints should return 401 without auth ✅');
  console.log('- Customer endpoints may work without auth depending on implementation');
  console.log('- To fully test admin features, manual login required');
}

// Test database connection
async function testDatabase() {
  console.log('\n🗄️  Testing Database Connection\n');
  console.log('=' .repeat(50));
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const [customerCount, siteCount, userCount] = await Promise.all([
      prisma.customer.count(),
      prisma.customerSite.count(),
      prisma.user.count(),
    ]);
    
    console.log(`✅ Database connected successfully!`);
    console.log(`  - Customers: ${customerCount}`);
    console.log(`  - Websites: ${siteCount}`);
    console.log(`  - Users: ${userCount}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
  }
}

async function main() {
  console.log('\n🚀 AGI Staffers Admin Testing Suite\n');
  
  await testEndpoints();
  await testDatabase();
  
  console.log('\n✅ Testing complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Login as iradwatkins@gmail.com');
  console.log('2. Visit /admin to see platform overview');
  console.log('3. Visit /admin/websites to see all client sites');
  console.log('4. Visit /admin/users to see all users');
}

main().catch(console.error);