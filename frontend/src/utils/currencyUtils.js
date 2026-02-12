// Currency configuration and utilities
export const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
};

/**
 * Format amount with currency symbol and locale
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (USD, EUR, etc.)
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD', showSymbol = true) => {
    const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;

    const formatted = new Intl.NumberFormat(currency.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    return showSymbol ? `${currency.symbol}${formatted}` : formatted;
};

/**
 * Get currency symbol for a given currency code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode = 'USD') => {
    return CURRENCIES[currencyCode]?.symbol || '$';
};

/**
 * Get all available currencies as array
 * @returns {Array} Array of currency objects
 */
export const getAllCurrencies = () => {
    return Object.values(CURRENCIES);
};
