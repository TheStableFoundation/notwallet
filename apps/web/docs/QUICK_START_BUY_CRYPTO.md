# Quick Start Guide - Buy Crypto Feature

## 🚀 What's Been Implemented

A complete Stripe Crypto Onramp integration that allows users to buy cryptocurrency directly to their Solana wallet using credit cards, debit cards, or bank transfers.

## 📁 Files Created

1. **`/src/pages/buy-crypto.astro`** - Main buy crypto page
2. **`/src/pages/api/create-onramp-session.ts`** - API endpoint for Stripe
3. **`.env`** - Environment variables (already configured)
4. **`.env.example`** - Template for environment variables
5. **`BUY_CRYPTO_README.md`** - Detailed documentation

## 📝 Files Modified

- **`/src/components/Header.astro`** - Added "Buy Crypto" button to navigation
- **`tailwind.config.mjs`** - Added missing Nordic color variants

## ⚡ Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Visit the Buy Crypto Page
Navigate to: **http://localhost:4321/buy-crypto**

### 3. Test the Flow
- Enter a valid Solana wallet address (32-44 base58 characters)
- Example: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`
- Optionally select cryptocurrency (SOL, USDC, or USDT)
- Click "Buy Crypto"
- Complete the purchase through Stripe's interface

## 🔑 Environment Variables

Your Stripe keys are already configured in `.env`:
- ✅ `STRIPE_SECRET_KEY` - For server-side API calls
- ✅ `STRIPE_PUBLISHABLE_KEY` - For client-side widget

## 🎨 Features

✅ **Responsive Design** - Works on mobile and desktop
✅ **Light Theme** - Matches your Nordic theme
✅ **Form Validation** - Validates Solana addresses
✅ **Solana Support** - SOL, USDC, and USDT on Solana network
✅ **Error Handling** - User-friendly error messages
✅ **Navigation Integration** - "Buy Crypto" button in header
✅ **Multiple Payment Methods** - Credit card, debit card, bank transfer
✅ **Real-time Updates** - Session status tracking

## 📱 User Flow

1. User clicks "Buy Crypto" in navigation
2. Enters their Solana wallet address
3. (Optional) Selects cryptocurrency (SOL, USDC, or USDT)
4. Clicks "Buy Crypto" button
5. Stripe widget loads with payment options
6. User completes payment
7. Crypto is sent directly to their Solana wallet

## 🔧 API Endpoint

**POST** `/api/create-onramp-session`

Request:
```json
{
  "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "destination_currency": "sol",
  "destination_network": "solana"
}
```

Response:
```json
{
  "client_secret": "cos_xxx_secret_xxx"
}
```

## 🌐 Production Checklist

Before deploying to production:

- [ ] Verify live Stripe keys are correct (`sk_live_...` and `pk_live_...`)
- [ ] Set environment variables in your hosting platform
- [ ] Ensure HTTPS is enabled on your domain
- [ ] Test with real payment methods
- [ ] Monitor transactions in [Stripe Dashboard](https://dashboard.stripe.com/)

## 🐛 Troubleshooting

**Widget not loading?**
- Check browser console for errors
- Verify Stripe SDK script is loading
- Ensure internet connection is stable

**Session creation fails?**
- Verify Stripe secret key is correct
- Check Stripe Dashboard for API key permissions
- Review server logs for detailed errors

**Invalid wallet address?**
- Must be a valid Solana address
- Must be 32-44 characters long
- Only base58 characters allowed (excluding 0, O, I, l)

## 📚 Documentation

- Full documentation: `BUY_CRYPTO_README.md`
- Stripe Docs: https://docs.stripe.com/crypto/onramp
- Stripe Dashboard: https://dashboard.stripe.com/

## 🎉 That's It!

Your buy-crypto feature is ready to use. The page is accessible at `/buy-crypto` and is integrated into your navigation header.

For detailed information, refer to `BUY_CRYPTO_README.md`.