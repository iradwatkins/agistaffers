const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminAuth() {
  try {
    // Find the admin user
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: 'admin@agistaffers.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
    });

    // Test password
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, adminUser.passwordHash);
    
    console.log(`\n🔐 Password test for '${testPassword}':`, isValid ? '✅ VALID' : '❌ INVALID');

    // If invalid, create a new hash for reference
    if (!isValid) {
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('\n📝 New hash for admin123:', newHash);
      console.log('💡 Current hash in DB:', adminUser.passwordHash);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminAuth();