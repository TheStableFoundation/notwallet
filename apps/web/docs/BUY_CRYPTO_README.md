# Buy Crypto Feature - Documentation

This documentation covers the implementation of the Stripe Crypto Onramp integration for NotWallet.

## Overview

The buy-crypto feature allows users to purchase cryptocurrency directly to their Solana wallet using Stripe's Crypto Onramp service. Users can pay with credit cards, debit cards, or bank transfers.

## Files Created

### 1. `/src/pages/buy-crypto.astro`
The main buy-crypto page that includes:
- Solana wallet address input form
- Currency selection (SOL, USDC, or USDT)
- Stripe Crypto Onramp widget integration
- Responsive design with light Nordic theme styling

### 2. `/src/pages/api/create-onramp-session.ts`
API endpoint that creates a Stripe Crypto Onramp session:
- Accepts POST requests with wallet address and optional parameters
- Communicates with Stripe API to create onramp sessions
- Returns client_secret for frontend to initialize the widget

### 3. `.env`
Environment variables file containing Stripe API keys (not committed to git)

### 4. `.env.example`
Template for environment variables

## Setup Instructions

### 1. Install Dependencies
No additional dependencies are required beyond the existing Astro setup.

### 2. Environment Variables
Copy `.env.example` to `.env` and add your Stripe keys:
```bash
cp .env.example .env
```

Your `.env` file should contain:
```
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

**Note:** The keys are already configured in the `.env` file.

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Access the Buy Crypto Page
Navigate to: `http://localhost:4321/buy-crypto`

## How It Works

### Frontend Flow
1. User enters their Ethereum wallet address
2. (Optional) User selects destination currency and network
3. User clicks "Buy Crypto" button
4. Frontend validates the wallet address format
5. Frontend makes a POST request to `/api/create-onramp-session`
6. Backend creates a Stripe Onramp session and returns client_secret
7. Frontend initializes Stripe Onramp widget with the client_secret
8. User completes the purchase through Stripe's interface
9. Crypto is sent directly to the provided wallet address

### Backend Flow
1. Receives POST request with wallet_address and optional parameters
2. Validates required parameters
3. Makes request to Stripe API to create onramp session
4. Returns client_secret to frontend

## API Endpoint

### POST `/api/create-onramp-session`

**Request Body:**
```json
{
  "wallet_address": "0x1234...",
  "destination_currency": "eth",  // optional
  "destination_network": "ethereum"  // optional
}
```

**Response:**
```json
{
  "client_secret": "cos_xxx_secret_xxx"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

## Supported Parameters

### Wallet Address
- **Required:** Yes
- **Format:** Solana address (32-44 base58 characters)
- **Example:** `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

### Destination Currency (Optional)
- `sol` - Solana
- `usdc` - USD Coin on Solana
- `usdt` - Tether on Solana

### Destination Network
- **Fixed:** `solana` - Solana network only

## Stripe SDKs Integration

The page loads both Stripe.js and Stripe Crypto Onramp SDK for comprehensive payment processing:

### 1. Stripe.js
```javascript
https://js.stripe.com/v3/
```

Stripe.js is Stripe's foundational JavaScript library that provides:
- PCI compliance for handling payment information
- Secure payment method collection
- Card validation and formatting
- Payment Elements integration (for future features)

**Usage in buy-crypto page:**
```javascript
const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
```

### 2. Stripe Crypto Onramp SDK
```javascript
https://crypto-js.stripe.com/crypto-onramp-outer.js
```

The Crypto Onramp SDK provides the widget for cryptocurrency purchases.

**Usage in buy-crypto page:**
```javascript
const stripeOnramp = window.StripeOnramp(STRIPE_PUBLISHABLE_KEY);
```

### Loading Strategy

Both SDKs are loaded asynchronously using Promises:

```javascript
Promise.all([loadStripeJS(), loadCryptoOnrampSDK()])
  .then(() => {
    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    stripeOnramp = window.StripeOnramp(STRIPE_PUBLISHABLE_KEY);
    console.log("Stripe.js and Crypto Onramp initialized");
  })
  .catch((error) => {
    console.error("Error loading Stripe scripts:", error);
  });
```

### Widget Configuration
```javascript
const session = stripeOnramp.createSession({
  clientSecret: client_secret,
  appearance: {
    theme: 'dark',
  },
});
```

## Security Considerations

1. **API Keys:**
   - Secret key is only used server-side in the API endpoint
   - Publishable key is safe to use in frontend code
   - Both keys are stored in `.env` file (not committed to git)

2. **Wallet Address Validation:**
   - Basic format validation on frontend
   - Ethereum address format: `^0x[a-fA-F0-9]{40}$`

3. **HTTPS Required:**
   - Stripe requires HTTPS in production
   - Use development keys for local testing

## Testing

### Test Mode
For testing, use Stripe test keys:
- Test Secret Key: `sk_test_...`
- Test Publishable Key: `pk_test_...`

### Test Wallet Address
You can use any valid Solana address format for testing:
```
7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

## Event Handling

The implementation includes event listeners for session updates:

```javascript
session.addEventListener('onramp_session_updated', (e) => {
  if (e.payload.session.status === 'fulfillment_complete') {
    console.log('Transaction complete!');
    // Add custom success handling
  }
});
```

### Available Session Statuses
- `initialized` - Session created
- `fulfillment_processing` - Processing payment
- `fulfillment_complete` - Crypto sent to wallet
- `fulfillment_failed` - Transaction failed

## Customization

### Styling
The widget uses the Nordic theme with:
- Light theme appearance
- Custom colors from Tailwind config
- Responsive design
- Clean card-based design

### Appearance Options
You can customize the widget appearance in `buy-crypto.astro`:
```javascript
appearance: {
  theme: 'dark',  // or 'light'
}
```

### Why Both Stripe.js and Crypto Onramp?

**Stripe.js** provides:
- Core payment infrastructure
- PCI DSS compliance
- Future payment method support
- Enhanced security features

**Crypto Onramp SDK** provides:
- Cryptocurrency purchase widget
- KYC/AML compliance
- Crypto delivery to wallets
- Fiat-to-crypto conversion

Having both loaded ensures:
1. Full Stripe feature compatibility
2. Future payment method expansion
3. Proper security and compliance
4. Seamless integration with Stripe ecosystem

## Troubleshooting

### Common Issues

1. **"Stripe Onramp SDK not loaded"**
   - Check internet connection
   - Verify both Stripe.js and Crypto Onramp SDK are loading
   - Check browser console for errors
   - Ensure STRIPE_PUBLISHABLE_KEY is correct
   
2. **"Failed to load Stripe scripts"**
   - Check browser console for detailed error
   - Verify no ad blockers are blocking Stripe domains
   - Ensure proper internet connectivity
   - Try refreshing the page

3. **"Failed to create onramp session"**
   - Verify Stripe secret key is correct
   - Check API key permissions in Stripe Dashboard
   - Review server logs for detailed error messages
   - Ensure Crypto Onramp is enabled in Stripe Dashboard

4. **"Invalid wallet address"**
   - Ensure address is a valid Solana address
   - Verify address is 32-44 characters long
   - Check for valid base58 characters (excludes 0, O, I, l)

## Resources

- [Stripe Crypto Onramp Documentation](https://docs.stripe.com/crypto/onramp)
- [Stripe API Reference](https://docs.stripe.com/api)
- [Stripe Dashboard](https://dashboard.stripe.com/)

## Production Deployment

Before deploying to production:

1. Ensure you're using live Stripe keys (sk_live_... and pk_live_...)
2. Configure environment variables in your hosting platform
3. Enable HTTPS on your domain
4. Test the complete flow with real payment methods
5. Monitor transactions in Stripe Dashboard

## Support

For issues with:
- Stripe integration: [Stripe Support](https://support.stripe.com/)
- NotWallet: Contact your development team