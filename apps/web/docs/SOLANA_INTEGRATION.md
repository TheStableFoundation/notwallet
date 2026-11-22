# Solana Integration Guide - Buy Crypto Feature

## Overview

The NotWallet buy-crypto feature is specifically designed for Solana blockchain, allowing users to purchase SOL and SPL tokens (USDC, USDT) directly to their Solana wallet addresses.

## Supported Cryptocurrencies

### Native Token
- **SOL** - Solana's native token

### SPL Tokens
- **USDC** - USD Coin on Solana
- **USDT** - Tether on Solana

## Solana Wallet Address Format

### Characteristics
- **Length:** 32-44 characters
- **Encoding:** Base58
- **Character Set:** 1-9, A-H, J-N, P-Z, a-k, m-z (excludes 0, O, I, l)

### Valid Example Addresses
```
7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
```

### Validation Regex
```javascript
/^[1-9A-HJ-NP-Za-km-z]{32,44}$/
```

## Implementation Details

### Frontend (buy-crypto.astro)

#### Wallet Address Input
```html
<input
    type="text"
    id="wallet-address"
    placeholder="Enter your Solana wallet address..."
    class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
/>
```

#### Validation Logic
```javascript
// Solana address validation (32-44 characters, base58)
if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
    showError("Please enter a valid Solana wallet address");
    return;
}
```

#### API Request
```javascript
const response = await fetch("/api/create-onramp-session", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        wallet_address: walletAddress,
        destination_currency: "sol", // or "usdc", "usdt"
        destination_network: "solana",
    }),
});
```

### Backend (create-onramp-session.ts)

#### Stripe API Request Format
```javascript
const response = await fetch(
    "https://api.stripe.com/v1/crypto/onramp_sessions",
    {
        method: "POST",
        headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            "wallet_addresses[solana]": wallet_address,
            destination_currency: destination_currency || "sol",
            destination_network: "solana",
        }).toString(),
    }
);
```

## User Flow

### Step-by-Step Process

1. **User Input**
   - User navigates to `/buy-crypto`
   - Enters Solana wallet address
   - Selects cryptocurrency (SOL, USDC, or USDT)
   - Clicks "Buy Crypto"

2. **Validation**
   - Frontend validates Solana address format
   - Checks for required fields

3. **Session Creation**
   - POST request to `/api/create-onramp-session`
   - Server creates Stripe Onramp session
   - Returns `client_secret`

4. **Widget Initialization**
   - Frontend receives `client_secret`
   - Initializes Stripe Onramp widget
   - Widget mounts to page

5. **Payment Processing**
   - User completes payment through Stripe
   - Stripe handles KYC verification
   - Payment processed

6. **Crypto Delivery**
   - Stripe purchases crypto from liquidity provider
   - Crypto sent to user's Solana wallet address
   - Transaction confirmed on Solana blockchain

## Testing

### Test Wallet Addresses

For development and testing purposes, you can use any valid Solana address format:

```
# Example test addresses (format valid, but use your own)
7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

### Generating Test Addresses

You can generate Solana wallet addresses using:
- Phantom Wallet (browser extension)
- Solflare Wallet (web/mobile)
- Solana CLI tools
- Web3.js library

### Testing Checklist

- [ ] Valid Solana address accepted
- [ ] Invalid address rejected with error message
- [ ] SOL purchase flow works
- [ ] USDC purchase flow works
- [ ] USDT purchase flow works
- [ ] Error handling displays correctly
- [ ] Responsive design on mobile
- [ ] Widget loads properly

## Common Solana Address Validation Errors

### Invalid Length
```
Error: Please enter a valid Solana wallet address
Reason: Address must be 32-44 characters
Example Invalid: "123456789" (too short)
```

### Invalid Characters
```
Error: Please enter a valid Solana wallet address
Reason: Contains invalid characters (0, O, I, or l)
Example Invalid: "0OIl..." (contains excluded chars)
```

### Empty Input
```
Error: Please enter a valid wallet address
Reason: No address provided
```

## Solana Network Details

### Network Configuration
- **Blockchain:** Solana
- **Network Type:** Mainnet
- **Confirmation Time:** ~400ms (typical)
- **Transaction Finality:** ~13 seconds

### Supported Operations
- ✅ Receive SOL (native token)
- ✅ Receive USDC (SPL token)
- ✅ Receive USDT (SPL token)
- ❌ Other blockchains not supported

## Integration with Stripe

### Stripe SDKs Used

The buy-crypto feature uses two Stripe SDKs:

#### 1. Stripe.js (Core Library)
```javascript
https://js.stripe.com/v3/
```

**Purpose:**
- PCI DSS compliance for payment handling
- Secure payment method collection
- Card validation and formatting
- Foundation for all Stripe integrations

**Initialization:**
```javascript
const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
```

#### 2. Stripe Crypto Onramp SDK
```javascript
https://crypto-js.stripe.com/crypto-onramp-outer.js
```

**Purpose:**
- Cryptocurrency purchase widget
- KYC/AML compliance handling
- Fiat-to-crypto conversion
- Direct crypto delivery to wallets

**Initialization:**
```javascript
const stripeOnramp = window.StripeOnramp(STRIPE_PUBLISHABLE_KEY);
```

### Loading Strategy

Both SDKs are loaded asynchronously for optimal performance:

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

### Stripe Onramp Configuration

```javascript
// Wallet addresses parameter format
"wallet_addresses[solana]": wallet_address

// Network specification
destination_network: "solana"

// Supported currencies on Solana
destination_currency: "sol" | "usdc" | "usdt"
```

### Session Parameters

```typescript
interface OnrampSessionParams {
  wallet_addresses: {
    solana: string;  // Solana wallet address
  };
  destination_network: "solana";
  destination_currency?: "sol" | "usdc" | "usdt";
}
```

## Security Considerations

### Wallet Address Validation
- Always validate address format on frontend
- Verify address on backend before Stripe API call
- Never accept addresses from untrusted sources

### Private Key Safety
- **NEVER** ask users for private keys
- **NEVER** store private keys
- Only request public wallet addresses

### Best Practices
1. Validate all user inputs
2. Use HTTPS in production
3. Keep Stripe keys secure
4. Monitor transactions in Stripe Dashboard
5. Implement rate limiting on API endpoint
6. Log errors for debugging

## Troubleshooting

### Issue: "Invalid wallet address" error
**Solution:** Verify the address:
- Is 32-44 characters long
- Uses only base58 characters
- Doesn't contain 0, O, I, or l

### Issue: Crypto not received
**Solution:**
1. Check transaction status in Stripe Dashboard
2. Verify wallet address was entered correctly
3. Check Solana blockchain explorer
4. Contact Stripe support if needed

### Issue: Session creation fails
**Solution:**
1. Verify Stripe API keys are correct
2. Check server logs for detailed errors
3. Ensure wallet address format is correct
4. Verify network connectivity

## Monitoring & Analytics

### Metrics to Track
- Number of sessions created
- Successful vs failed transactions
- Most popular cryptocurrency (SOL vs USDC vs USDT)
- Average transaction amounts
- User drop-off points

### Stripe Dashboard
Monitor real-time data:
- Transaction volume
- Success rates
- Revenue generated
- User demographics
- Error patterns

## Future Enhancements

### Potential Additions
1. **Multiple Wallet Support**
   - Allow users to save multiple Solana addresses
   - Quick-select from saved addresses

2. **Transaction History**
   - Display past purchases
   - Link to Solana blockchain explorer

3. **Price Display**
   - Show current SOL/USDC/USDT prices
   - Calculate approximate amounts

4. **QR Code Support**
   - Scan Solana address from QR code
   - Generate QR code for sharing

5. **More SPL Tokens**
   - Add support for more Solana tokens
   - Enable custom token purchases

## Resources

### Solana Documentation
- [Solana Docs](https://docs.solana.com/)
- [Solana Explorer](https://explorer.solana.com/)
- [SPL Token Program](https://spl.solana.com/token)

### Stripe Documentation
- [Crypto Onramp Guide](https://docs.stripe.com/crypto/onramp)
- [Onramp API Reference](https://docs.stripe.com/api/crypto/onramp_sessions)
- [Stripe Dashboard](https://dashboard.stripe.com/)

### Wallet Providers
- [Phantom Wallet](https://phantom.app/)
- [Solflare Wallet](https://solflare.com/)
- [Backpack Wallet](https://backpack.app/)

### Stripe Documentation
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Including Stripe.js](https://stripe.com/docs/js/including)
- [Crypto Onramp SDK](https://stripe.com/docs/crypto/onramp)

## Support

For issues related to:
- **Solana Network:** [Solana Discord](https://discord.com/invite/solana)
- **Stripe Integration:** [Stripe Support](https://support.stripe.com/)
- **NotWallet App:** Contact your development team

---

**Last Updated:** 2024
**Version:** 1.0
**Blockchain:** Solana Mainnet