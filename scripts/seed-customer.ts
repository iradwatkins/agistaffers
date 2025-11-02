import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding customer account for appvillagellc@gmail.com...')

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'appvillagellc@gmail.com' }
    })

    if (existingUser) {
      console.log('✅ User already exists')
      return existingUser
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: 'appvillagellc@gmail.com',
        name: 'App Village LLC',
        emailVerified: new Date(),
        accounts: {
          create: {
            type: 'email',
            provider: 'email',
            providerAccountId: 'appvillagellc@gmail.com',
          }
        }
      }
    })

    console.log('✅ Created user:', user.email)

    // Create a customer record
    const customer = await prisma.customer.create({
      data: {
        email: 'appvillagellc@gmail.com',
        companyName: 'App Village LLC',
        contactName: 'App Village',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create a sample website order for the user
    const website = await prisma.customerSite.create({
      data: {
        customerId: customer.id,
        siteName: 'App Village Business Site',
        domain: 'appvillage.com',
        subdomain: 'appvillage',
        templateId: null,
        customSettings: {},
        deploymentStatus: 'deployed',
        sslEnabled: true,
        customDomain: 'appvillage.com',
        gitRepo: 'https://github.com/agistaffers/appvillage-site',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('✅ Created sample website order:', website.siteName)
    console.log('\n📧 User can now login with:')
    console.log('   Email: appvillagellc@gmail.com')
    console.log('   Method: Google OAuth or Magic Link')
    console.log('   Dashboard: http://localhost:3000/dashboard')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })