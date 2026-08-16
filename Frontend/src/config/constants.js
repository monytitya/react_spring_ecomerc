/**
 * Application Constants
 */

// Minimum payment amounts
export const PAYMENT_CONSTANTS = {
  MIN_AMOUNT_USD: 0.01,        // Minimum 0.01 USD
  MIN_AMOUNT_KHR: 100,         // Minimum 100 Riel (approximately 0.01 USD)
  CURRENCY_USD: 'USD',
  CURRENCY_KHR: 'KHR',
};

// Validation helpers
export const validateOrderAmount = (amount) => {
  if (!amount || amount < PAYMENT_CONSTANTS.MIN_AMOUNT_USD) {
    return {
      valid: false,
      error: `Minimum order amount is $${PAYMENT_CONSTANTS.MIN_AMOUNT_USD} (USD) or ${PAYMENT_CONSTANTS.MIN_AMOUNT_KHR} Riel (KHR)`,
      minAmount: PAYMENT_CONSTANTS.MIN_AMOUNT_USD,
    };
  }
  return { valid: true, error: null, amount };
};

export default PAYMENT_CONSTANTS;
