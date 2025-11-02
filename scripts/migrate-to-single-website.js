const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateToSingleWebsite() {
  try {
    console.log('🔍 Checking for customers with multiple websites...');
    
    // Get all customer sites grouped by customer
    const sites = await prisma.customerSite.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    const customerSites = {};
    sites.forEach(site => {
      if (!customerSites[site.customerId]) {
        customerSites[site.customerId] = [];
      }
      customerSites[site.customerId].push(site);
    });
    
    // Find customers with multiple sites
    const customersWithMultipleSites = Object.entries(customerSites)
      .filter(([_, sites]) => sites.length > 1);
    
    if (customersWithMultipleSites.length > 0) {
      console.log(`⚠️ Found ${customersWithMultipleSites.length} customers with multiple websites`);
      
      for (const [customerId, customerSitesList] of customersWithMultipleSites) {
        console.log(`\n📋 Customer ${customerId} has ${customerSitesList.length} websites:`);
        customerSitesList.forEach((site, index) => {
          console.log(`  ${index + 1}. ${site.siteName} (${site.domain}) - Status: ${site.status} - Created: ${site.createdAt}`);
        });
        
        // Keep only the first (oldest) site
        const [siteToKeep, ...sitesToRemove] = customerSitesList;
        console.log(`  ✅ Keeping: ${siteToKeep.siteName}`);
        
        for (const site of sitesToRemove) {
          console.log(`  ❌ Removing: ${site.siteName}`);
          await prisma.customerSite.delete({
            where: { id: site.id }
          });
        }
      }
    } else {
      console.log('✅ No customers with multiple websites found. Safe to migrate!');
    }
    
    console.log('\n✅ Migration preparation complete!');
    console.log('You can now run: npx prisma db push --accept-data-loss');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToSingleWebsite();