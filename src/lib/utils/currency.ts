// Currency conversion and formatting utilities

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // Conversion rate from USD
}

// Supported currencies and their conversion rates from USD
export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  'US': { code: 'USD', symbol: '$', rate: 1 },
  'IN': { code: 'INR', symbol: '₹', rate: 83 },
  'GB': { code: 'GBP', symbol: '£', rate: 0.79 },
  'EU': { code: 'EUR', symbol: '€', rate: 0.92 },
  'JP': { code: 'JPY', symbol: '¥', rate: 149 },
  'CA': { code: 'CAD', symbol: 'C$', rate: 1.36 },
  'AU': { code: 'AUD', symbol: 'A$', rate: 1.52 },
};

// Default currency if location detection fails
const DEFAULT_CURRENCY: CurrencyInfo = SUPPORTED_CURRENCIES['IN'];

/**
 * Detect user's country from browser locale
 */
export function detectUserCountry(): string {
  if (typeof window === 'undefined') return 'IN';
  
  const locale = navigator.language || navigator.languages?.[0] || 'en-US';
  const countryCode = locale.split('-')[1]?.toUpperCase() || locale.slice(0, 2).toUpperCase();
  
  // Map common locale codes to country codes
  const localeToCountry: Record<string, string> = {
    'EN': 'US',
    'HI': 'IN',
    'JA': 'JP',
    'FR': 'EU',
    'DE': 'EU',
    'IT': 'EU',
    'ES': 'EU',
    'PT': 'EU',
    'NL': 'EU',
    'SV': 'EU',
    'DA': 'EU',
    'NO': 'EU',
    'FI': 'EU',
    'PL': 'EU',
    'CZ': 'EU',
    'HU': 'EU',
    'RO': 'EU',
    'BG': 'EU',
    'HR': 'EU',
    'SK': 'EU',
    'SI': 'EU',
    'EE': 'EU',
    'LV': 'EU',
    'LT': 'EU',
    'MT': 'EU',
    'CY': 'EU',
    'LU': 'EU',
  };
  
  return localeToCountry[countryCode] || countryCode || 'IN';
}

/**
 * Get currency information for user's location
 */
export function getUserCurrency(): CurrencyInfo {
  const country = detectUserCountry();
  return SUPPORTED_CURRENCIES[country] || DEFAULT_CURRENCY;
}

/**
 * Convert USD amount to user's local currency
 */
export function convertToLocalCurrency(usdAmount: number): number {
  const currency = getUserCurrency();
  return Math.round(usdAmount * currency.rate);
}

/**
 * Format price with user's currency symbol
 */
export function formatPrice(amount: number): string {
  const currency = getUserCurrency();
  
  if (currency.code === 'INR') {
    // For INR, format with commas and place symbol before
    return `${currency.symbol}${amount.toLocaleString('en-IN')}`;
  } else if (currency.code === 'JPY') {
    // For JPY, no decimal places
    return `${currency.symbol}${amount.toLocaleString()}`;
  } else {
    // For other currencies, format with 2 decimal places if needed
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Convert and format USD price to local currency
 */
export function formatLocalPrice(usdAmount: number): string {
  const localAmount = convertToLocalCurrency(usdAmount);
  return formatPrice(localAmount);
}

/**
 * Get monthly pricing formatted for display
 */
export function getMonthlyPrice(usdPrice: number, months: number): string {
  const monthlyUsd = usdPrice / months;
  const monthlyLocal = convertToLocalCurrency(monthlyUsd);
  return formatPrice(monthlyLocal);
}
