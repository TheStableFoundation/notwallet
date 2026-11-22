# Stripe Integration Guide - Stripe.js + Crypto Onramp

## Overview

The NotWallet buy-crypto feature uses **two Stripe SDKs** working together:

1. **Stripe.js** - Core payment library
2. **Stripe Crypto Onramp SDK** - Cryptocurrency purchase widget

This dual-SDK approach ensures PCI compliance, security, and future extensibility.

---

## 🔧 SDK Components

### 1. Stripe.js (Core Library)

**Script URL:**
```
https://js.stripe.com/v3/
```

**Purpose:**
- PCI DSS Level 1 compliance for payment data
- Secure payment method collection
- Card validation and formatting
- Foundation for all Stripe integrations
- Future payment features (cards, ACH, etc.)

**Initialization:**
```javascript
const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
```

**Documentation:**
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Including Stripe.js](https://stripe.com/docs/js/including)

---

### 2. Stripe Crypto Onramp SDK

**Script URL:**
```
https://crypto-js.stripe.com/crypto-onramp-outer.js
```

**Purpose:**
- Cryptocurrency purchase widget UI
- KYC/AML compliance handling
- Fiat-to-crypto conversion
- Direct crypto delivery to user wallets
- Transaction status tracking

**Initialization:**
```javascript
const stripeOnramp = window.StripeOnramp(STRIPE_PUBLISHABLE_KEY);
```

**Documentation:**
- [Crypto Onramp Guide](https://stripe.com/docs/crypto/onramp)
- [Onramp API Reference](https://stripe.com/docs/api/crypto/onramp_sessions)

---

## 📥 Loading Strategy

### Asynchronous Parallel Loading

Both SDKs are loaded dynamically and in parallel for optimal performance:

```javascript
// Load Stripe.js
function loadStripeJS() {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Stripe.js"));
    document.head.appendChild(script);
  });
}

// Load Crypto Onramp SDK
function loadCryptoOnrampSDK() {
  return new Promise((resolve, reject) => {
    if (window.StripeOnramp) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://crypto-js.stripe.com/crypto-onramp-outer.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Crypto Onramp SDK"));
    document.head.appendChild(script);
  });
}

// Initialize both SDKs
Promise.all([loadStripeJS(), loadCryptoOnrampSDK()])
  .then(() => {
    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    stripeOnramp = window.StripeOnramp(STRIPE_PUBLISHABLE_KEY);
    console.log("Stripe.js and Crypto Onramp initialized");
  })
  .catch((error) => {
    console.error("Error loading Stripe scripts:", error);
    showError("Failed to load payment system. Please refresh the page.");
  });
```

### Why This Approach?

✅ **Non-blocking** - Doesn't delay page load
✅ **Parallel loading** - Both scripts load simultaneously
✅ **Error handling** - Graceful failure with user feedback
✅ **Idempotent** - Safe to call multiple times
✅ **Performance** - Only loads on buy-crypto page

---

## 🔐 Security & Compliance

### PCI DSS Compliance

**Stripe.js automatically ensures:**
- Payment data never touches your servers
- Tokenization of sensitive information
- PCI DSS Level 1 compliance
- Secure communication with Stripe

### API Keys

Two types of keys are used:

**Publishable Key** (Client-side)
```javascript
pk_live_...your_publishable_key_here
```
- Safe to expose in frontend code
- Used to initialize Stripe.js and Crypto Onramp
- Identifies your Stripe account

**Secret Key** (Server-side)
```javascript
sk_live_...your_secret_key_here
```
- **NEVER** exposed to frontend
- Stored in `.env` file (git-ignored)
- Used only in API endpoint
- Has full access to Stripe account

---

## 🎯 Implementation Flow

### Complete Purchase Flow

```
1. User visits /buy-crypto page
   ↓
2. Stripe.js and Crypto Onramp SDK load in parallel
   ↓
3. Both SDKs initialize with publishable key
   ↓
4. User enters Solana wallet address
   ↓
5. User clicks "Buy Crypto"
   ↓
6. Frontend calls /api/create-onramp-session
   ↓
7. Backend uses secret key to create Stripe session
   ↓
8. Backend returns client_secret
   ↓
9. Frontend uses client_secret to initialize widget
   ↓
10. Crypto Onramp widget mounts to page
    ↓
11. User completes payment through Stripe
    ↓
12. Stripe handles KYC/AML verification
    ↓
13. Stripe purchases crypto from liquidity provider
    ↓
14. Crypto sent to user's Solana wallet
    ↓
15. Transaction complete event fired
```

---

## 💻 Code Implementation

### Frontend (buy-crypto.astro)

```javascript
// Initialize Stripe and Crypto Onramp
let stripe = null;
let stripeOnramp = null;

// Load both SDKs
Promise.all([loadStripeJS(), loadCryptoOnrampSDK()])
  .then(() => {
    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    stripeOnramp = window.StripeOnramp(STRIPE_PUBLISHABLE_KEY);
  })
  .catch((error) => {
    console.error("Error loading Stripe scripts:", error);
  });

// When user clicks "Buy Crypto"
const response = await fetch("/api/create-onramp-session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    wallet_address: walletAddress,
    destination_currency: "sol",
    destination_network: "solana",
  }),
});

const { client_secret } = await response.json();

// Create and mount session
const session = stripeOnramp.createSession({
  clientSecret: client_secret,
  appearance: { theme: "dark" },
});

session.mount("#onramp-element");

// Listen for events
session.addEventListener("onramp_session_updated", (e) => {
  if (e.payload.session.status === "fulfillment_complete") {
    console.log("Transaction complete!");
  }
});
```

### Backend (create-onramp-session.ts)

```typescript
export const POST: APIRoute = async ({ request }) => {
  const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;
  const body = await request.json();
  const { wallet_address, destination_currency } = body;

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

  const session = await response.json();
  return new Response(
    JSON.stringify({ client_secret: session.client_secret }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
```

---

## 🎨 Widget Customization

### Appearance Options

```javascript
const session = stripeOnramp.createSession({
  clientSecret: client_secret,
  appearance: {
    theme: "dark", // or "light"
  },
});
```

### Event Handling

```javascript
session.addEventListener("onramp_session_updated", (event) => {
  const status = event.payload.session.status;
  
  switch (status) {
    case "initialized":
      console.log("Session created");
      break;
    case "fulfillment_processing":
      console.log("Processing payment");
      break;
    case "fulfillment_complete":
      console.log("Crypto sent to wallet!");
      // Show success message
      break;
    case "fulfillment_failed":
      console.error("Transaction failed");
      // Show error message
      break;
  }
});
```

---

## 🐛 Troubleshooting

### Issue: "Stripe.js not loaded"

**Symptoms:**
- `window.Stripe is undefined`
- Console error about missing Stripe

**Solutions:**
1. Check internet connection
2. Verify no ad blockers blocking Stripe domains
3. Check browser console for script loading errors
4. Ensure CORS is not blocking the script

### Issue: "Crypto Onramp SDK not loaded"

**Symptoms:**
- `window.StripeOnramp is undefined`
- Widget doesn't mount

**Solutions:**
1. Verify both SDKs are loading
2. Check Promise.all() is resolving
3. Add timeout/retry logic
4. Check browser compatibility

### Issue: Script loading timeout

**Solution:**
```javascript
// Add timeout handling
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error("SDK loading timeout")), 10000)
);

Promise.race([
  Promise.all([loadStripeJS(), loadCryptoOnrampSDK()]),
  timeoutPromise
]).then(/* initialize */).catch(/* handle error */);
```

### Issue: "Failed to create session"

**Solutions:**
1. Verify API keys are correct
2. Check secret key has correct permissions
3. Verify Crypto Onramp is enabled in Stripe Dashboard
4. Review server logs for detailed errors

---

## 🧪 Testing

### Test Mode

Use Stripe test keys for development:

```bash
# Test keys format
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Testing Checklist

- [ ] Stripe.js loads successfully
- [ ] Crypto Onramp SDK loads successfully
- [ ] Both SDKs initialize with publishable key
- [ ] Session creation works
- [ ] Widget mounts to page
- [ ] Payment flow completes
- [ ] Events fire correctly
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Works in all browsers

### Browser Compatibility

**Supported:**
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

**Not supported:**
- Internet Explorer (any version)

---

## 📊 Monitoring

### Stripe Dashboard

Monitor real-time data at [dashboard.stripe.com](https://dashboard.stripe.com/):

- Transaction volume
- Success/failure rates
- Revenue
- User demographics
- Error patterns

### Console Logging

Current implementation logs:

```javascript
✓ "Stripe.js loaded"
✓ "Stripe Crypto Onramp SDK loaded"
✓ "Stripe.js and Crypto Onramp initialized"
✓ "Onramp session updated: {...}"
✗ "Error loading Stripe scripts: {...}"
```

### Custom Analytics

Add your own tracking:

```javascript
// Track SDK load time
const startTime = Date.now();
Promise.all([loadStripeJS(), loadCryptoOnrampSDK()])
  .then(() => {
    const loadTime = Date.now() - startTime;
    analytics.track("stripe_sdk_loaded", { loadTime });
  });

// Track session events
session.addEventListener("onramp_session_updated", (e) => {
  analytics.track("crypto_onramp_event", {
    status: e.payload.session.status,
    timestamp: Date.now(),
  });
});
```

---

## 🚀 Performance Optimization

### Current Optimizations

✅ Async script loading (non-blocking)
✅ Parallel SDK loading
✅ Only loads on buy-crypto page
✅ Cached by browser after first load
✅ Served from Stripe's CDN

### Future Optimizations

- [ ] Preload scripts using `<link rel="preload">`
- [ ] Add resource hints (`dns-prefetch`, `preconnect`)
- [ ] Lazy load widget only when needed
- [ ] Add service worker caching

---

## 🔄 Future Enhancements

### Potential Features Using Stripe.js

1. **Payment Method Collection**
   - Save cards for future purchases
   - ACH bank transfers
   - Multiple payment sources

2. **Advanced Payment Features**
   - Payment intents
   - Subscription support
   - Recurring crypto purchases

3. **Enhanced Security**
   - 3D Secure authentication
   - Fraud detection
   - Risk scoring

4. **User Experience**
   - Payment method validation
   - Auto-formatting
   - Better error messages

---

## 📚 Resources

### Official Documentation

- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Including Stripe.js](https://stripe.com/docs/js/including)
- [Crypto Onramp Guide](https://stripe.com/docs/crypto/onramp)
- [Stripe API Reference](https://stripe.com/docs/api)

### Tools

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

### Support

- [Stripe Support](https://support.stripe.com/)
- [Stripe Status](https://status.stripe.com/)
- [Stripe Community](https://github.com/stripe)

---

## ✅ Summary

The NotWallet buy-crypto feature uses **both Stripe.js and Stripe Crypto Onramp SDK** for:

✅ **Security** - PCI DSS Level 1 compliance
✅ **Reliability** - Industry-leading payment infrastructure
✅ **Flexibility** - Foundation for future payment features
✅ **Compliance** - KYC/AML handling
✅ **Performance** - Optimized loading strategy
✅ **User Experience** - Seamless crypto purchases

Both SDKs work together to provide a secure, compliant, and extensible cryptocurrency purchase experience.

---

**Last Updated:** 2024  
**Stripe.js Version:** v3  
**Integration Type:** Dual SDK (Stripe.js + Crypto Onramp)  
**Status:** ✅ Production Ready