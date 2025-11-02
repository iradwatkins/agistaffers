import { SquareClient, SquareEnvironment } from 'square'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox
})

async function createTestSubscription() {
  try {
    console.log('🔄 Creating $1 Monthly Test Subscription Product...\n')
    
    // 1. Create a catalog item (the product)
    console.log('1️⃣ Creating catalog item...')
    const catalogResponse = await squareClient.catalogApi.upsertCatalogObject({
      idempotencyKey: `test-product-${Date.now()}`,
      object: {
        type: 'ITEM',
        id: '#test-product',
        itemData: {
          name: 'Test Subscription - $1 Monthly',
          description: 'Test subscription product for development',
          productType: 'REGULAR',
          variations: [
            {
              type: 'ITEM_VARIATION',
              id: '#test-variation',
              itemVariationData: {
                name: 'Monthly Plan',
                pricingType: 'FIXED_PRICING',
                priceMoney: {
                  amount: BigInt(100), // $1.00 in cents
                  currency: 'USD'
                }
              }
            }
          ]
        }
      }
    })

    const catalogItem = catalogResponse.result.catalogObject
    const variationId = catalogItem?.itemData?.variations?.[0]?.id
    console.log('✅ Catalog item created:', catalogItem?.id)
    console.log('   Variation ID:', variationId)

    // 2. Create a subscription plan
    console.log('\n2️⃣ Creating subscription plan...')
    const planResponse = await squareClient.subscriptionsApi.createSubscriptionPlan({
      idempotencyKey: `test-plan-${Date.now()}`,
      plan: {
        name: 'Test Plan - $1 Monthly',
        phases: [
          {
            cadence: 'MONTHLY',
            periods: undefined, // Infinite recurring
            ordinal: BigInt(0),
            pricing: {
              type: 'STATIC',
              priceMoney: {
                amount: BigInt(100), // $1.00
                currency: 'USD'
              }
            }
          }
        ]
      }
    })

    const subscriptionPlan = planResponse.result.plan
    console.log('✅ Subscription plan created:', subscriptionPlan?.id)

    // 3. Create a test customer
    console.log('\n3️⃣ Creating test customer...')
    const customerResponse = await squareClient.customersApi.createCustomer({
      idempotencyKey: `test-customer-${Date.now()}`,
      givenName: 'Test',
      familyName: 'Customer',
      emailAddress: `test-${Date.now()}@example.com`,
      phoneNumber: '+15555551234',
      companyName: 'Test Company',
      note: 'Test customer for $1 subscription'
    })

    const customer = customerResponse.result.customer
    console.log('✅ Test customer created:')
    console.log('   Email:', customer?.emailAddress)
    console.log('   ID:', customer?.id)

    // 4. Create a card on file (test card for sandbox)
    console.log('\n4️⃣ Creating test payment method...')
    const cardResponse = await squareClient.cardsApi.createCard({
      idempotencyKey: `test-card-${Date.now()}`,
      sourceId: 'cnon:card-nonce-ok', // Sandbox test nonce for successful card
      card: {
        customerId: customer?.id,
        billingAddress: {
          addressLine1: '123 Test St',
          locality: 'San Francisco',
          administrativeDistrictLevel1: 'CA',
          postalCode: '94103',
          country: 'US'
        },
        cardholderName: 'Test Customer'
      }
    })

    const card = cardResponse.result.card
    console.log('✅ Test card created:', card?.id)
    console.log('   Last 4:', card?.last4)
    console.log('   Brand:', card?.cardBrand)

    // 5. Create the subscription
    console.log('\n5️⃣ Creating subscription...')
    const subscriptionResponse = await squareClient.subscriptionsApi.createSubscription({
      idempotencyKey: `test-subscription-${Date.now()}`,
      locationId: process.env.SQUARE_LOCATION_ID!,
      planVariationId: subscriptionPlan?.id,
      customerId: customer?.id,
      cardId: card?.id,
      startDate: new Date().toISOString().split('T')[0], // Start today
      timezone: 'America/New_York'
    })

    const subscription = subscriptionResponse.result.subscription
    console.log('✅ Subscription created successfully!')
    console.log('   Subscription ID:', subscription?.id)
    console.log('   Status:', subscription?.status)
    console.log('   Start Date:', subscription?.startDate)

    // 6. Display summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 TEST SUBSCRIPTION SUMMARY')
    console.log('='.repeat(60))
    console.log('Product: Test Subscription - $1 Monthly')
    console.log('Customer Email:', customer?.emailAddress)
    console.log('Subscription ID:', subscription?.id)
    console.log('Plan ID:', subscriptionPlan?.id)
    console.log('Status:', subscription?.status)
    console.log('Amount: $1.00/month')
    console.log('Next Billing:', subscription?.chargedThroughDate)
    console.log('='.repeat(60))

    console.log('\n✅ Test subscription created successfully!')
    console.log('📝 The webhook should receive events for this subscription')
    console.log('🔗 Check Square Dashboard: https://squareup.com/dashboard')

    // Save IDs for testing
    const testData = {
      customerId: customer?.id,
      subscriptionId: subscription?.id,
      planId: subscriptionPlan?.id,
      cardId: card?.id,
      catalogItemId: catalogItem?.id,
      variationId: variationId,
      createdAt: new Date().toISOString()
    }

    console.log('\n💾 Test Data (save for future testing):')
    console.log(JSON.stringify(testData, null, 2))

  } catch (error: any) {
    console.error('❌ Error creating test subscription:', error)
    if (error.result) {
      console.error('Square API Error:', JSON.stringify(error.result, null, 2))
    }
    process.exit(1)
  }
}

// Run the script
console.log('🚀 Square Test Subscription Creator')
console.log('====================================')
console.log('Environment:', process.env.SQUARE_ENVIRONMENT || 'sandbox')
console.log('Location ID:', process.env.SQUARE_LOCATION_ID)
console.log('====================================\n')

createTestSubscription()
  .then(() => {
    console.log('\n✨ Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })