#!/usr/bin/env node

/**
 * Setup System Admin Account
 * Creates or updates the system admin account for iradwatkins@gmail.com
 * 
 * Usage: node scripts/setup-system-admin.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupSystemAdmin() {
  try {
    console.log('🔧 Setting up system admin account...')
    
    // System admin credentials
    const systemAdminEmail = 'iradwatkins@gmail.com'
    const systemAdminPassword = 'admin123' // Change this in production!
    const hashedPassword = await bcrypt.hash(systemAdminPassword, 10)
    
    // Create or update AdminUser
    const adminUser = await prisma.adminUser.upsert({
      where: { email: systemAdminEmail },
      update: {
        name: 'Ira Watkins',
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        email: systemAdminEmail,
        name: 'Ira Watkins',
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        twoFactorEnabled: false
      }
    })
    
    console.log('✅ System admin account created/updated:', adminUser.email)
    
    // Also ensure User record exists for session management
    const user = await prisma.user.upsert({
      where: { email: systemAdminEmail },
      update: {
        name: 'Ira Watkins',
        isAdmin: true,
        emailVerified: new Date()
      },
      create: {
        email: systemAdminEmail,
        name: 'Ira Watkins',
        isAdmin: true,
        emailVerified: new Date()
      }
    })
    
    console.log('✅ User record created/updated for sessions')
    
    // Create test client account if it doesn't exist
    const clientEmail = 'client@test.com'
    const clientPassword = 'admin123'
    const hashedClientPassword = await bcrypt.hash(clientPassword, 10)
    
    const clientAdmin = await prisma.adminUser.upsert({
      where: { email: clientEmail },
      update: {
        passwordHash: hashedClientPassword
      },
      create: {
        email: clientEmail,
        name: 'Test Client',
        passwordHash: hashedClientPassword,
        role: 'CLIENT',
        isActive: true
      }
    })
    
    console.log('✅ Test client account ready:', clientAdmin.email)
    
    // Ensure client User record
    await prisma.user.upsert({
      where: { email: clientEmail },
      update: {
        name: 'Test Client',
        isAdmin: false
      },
      create: {
        email: clientEmail,
        name: 'Test Client',
        isAdmin: false,
        emailVerified: new Date()
      }
    })
    
    console.log('\n📋 Account Summary:')
    console.log('=====================================')
    console.log('SYSTEM ADMIN:')
    console.log('  Email: iradwatkins@gmail.com')
    console.log('  Password: admin123')
    console.log('  Access: /admin (full platform control)')
    console.log('')
    console.log('TEST CLIENT:')
    console.log('  Email: client@test.com')
    console.log('  Password: admin123')
    console.log('  Access: /dashboard (single website)')
    console.log('=====================================')
    
  } catch (error) {
    console.error('❌ Error setting up accounts:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the setup
setupSystemAdmin().catch(console.error)