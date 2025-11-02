#!/usr/bin/env node

// Test currency formatting
const { formatPrice, getPriceDisplay } = require('../lib/currency.ts');

console.log('Testing Currency Formatting:');
console.log('============================\n');

// Test prices
const testPrices = [497, 997, 2497, 59.99, 29.99];

testPrices.forEach(price => {
  console.log(`USD Price: $${price}`);
  console.log(`  English: ${formatPrice(price, 'en')}`);
  console.log(`  Spanish: ${formatPrice(price, 'es')}`);
  console.log('');
});

console.log('\nDetailed Price Display:');
console.log('======================\n');

const priceInfo = getPriceDisplay(497, 'es');
console.log('Price $497 in Spanish:');
console.log('  Formatted:', priceInfo.formatted);
console.log('  Amount:', priceInfo.amount);
console.log('  Currency:', priceInfo.currency);
console.log('  Symbol:', priceInfo.symbol);
console.log('  Original USD:', priceInfo.originalUSD);