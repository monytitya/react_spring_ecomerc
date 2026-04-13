import { BakongKHQR, khqrData, MerchantInfo } from 'bakong-khqr';

const merchantInfo = new MerchantInfo(
    "blueberry@bakong", // dummy Bakong Account ID
    "Blueberry Store",  // Merchant Name
    "Phnom Penh",       // City
    "123456789",        // Merchant ID
    "devbkkhpxxx",      // dummy Acquiring Bank
    {
      currency: khqrData.currency.usd,
      amount: 150.75, // Using hardcoded checkout amount for testing
      billNumber: "new",
      storeLabel: "Blueberry E-com",
      terminalLabel: "Online",
      expirationTimestamp: Date.now() + (30 * 60 * 1000)
    }
);

const khqr = new BakongKHQR();
const response = khqr.generateMerchant(merchantInfo);
console.log(response);
