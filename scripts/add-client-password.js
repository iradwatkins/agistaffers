const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function addClientPassword() {
  try {
    console.log('🔐 Adding password for CLIENT account...\n');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create an admin user entry for CLIENT (for password login)
    const clientAdmin = await prisma.adminUser.upsert({
      where: { email: 'client@test.com' },
      update: {
        passwordHash: hashedPassword,
        name: 'Test Client',
        role: 'client', // Mark as client role, not admin
      },
      create: {
        email: 'client@test.com',
        name: 'Test Client',
        passwordHash: hashedPassword,
        role: 'client', // Client role
      }
    });
    
    console.log('✅ Added password authentication for client@test.com');
    console.log('\n' + '='.repeat(50));
    console.log('📋 CLIENT LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log('Email: client@test.com');
    console.log('Password: admin123');
    console.log('\n✅ CLIENT can now login with password!');
    console.log('Access: /dashboard (Customer Dashboard)');
    console.log('Sees: Only their 3 websites');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addClientPassword();