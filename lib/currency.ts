'use client'

// Exchange rate: 1 USD = 57 DOP (approximate, can be updated)
const USD_TO_DOP_RATE = 57

export interface CurrencyConfig {
  code: 'USD' | 'DOP'
  symbol: '$' | 'RD$'
  locale: string
  decimals: number
}

export const currencyConfigs: Record<string, CurrencyConfig> = {
  en: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    decimals: 2
  },
  es: {
    code: 'DOP',
    symbol: 'RD$',
    locale: 'es-DO',
    decimals: 0 // DOP typically shown without decimals
  }
}

/**
 * Format a USD price based on the current language
 * @param priceInUSD - The price in US Dollars
 * @param language - The current language ('en' or 'es')
 * @returns Formatted price string
 */
export function formatPrice(priceInUSD: number, language: 'en' | 'es'): string {
  const config = currencyConfigs[language]
  
  // Convert to DOP if Spanish
  const amount = language === 'es' ? priceInUSD * USD_TO_DOP_RATE : priceInUSD
  
  // Format with appropriate locale and currency
  const formatted = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals
  }).format(amount)
  
  return formatted
}

/**
 * Get display price info for a USD price
 * @param priceInUSD - The price in US Dollars
 * @param language - The current language ('en' or 'es')
 * @returns Object with formatted price and currency info
 */
export function getPriceDisplay(priceInUSD: number, language: 'en' | 'es') {
  const config = currencyConfigs[language]
  const amount = language === 'es' ? priceInUSD * USD_TO_DOP_RATE : priceInUSD
  
  return {
    formatted: formatPrice(priceInUSD, language),
    amount,
    currency: config.code,
    symbol: config.symbol,
    originalUSD: priceInUSD
  }
}

// Note: The useCurrency hook has been removed to avoid circular dependencies
// Instead, import useLanguage directly in components and pass language to formatPrice