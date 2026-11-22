# Buy Crypto Feature - Quick Reference

## ⚡ Quick Start

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Visit: **http://localhost:4321/buy-crypto**

---

## 🎯 What Was Built

A complete **Stripe Crypto Onramp** integration for purchasing cryptocurrency directly to Solana wallets.

### Features
- ✅ Solana blockchain support (SOL, USDC, USDT)
- ✅ Light-themed UI matching site design
- ✅ Wallet address validation
- ✅ Stripe payment widget integration
- ✅ Server-side API endpoint
- ✅ "Buy Crypto" button in navigation
- ✅ Mobile responsive design

---

## 🚨 IMPORTANT: Deployment Changed

**Your site now requires Node.js hosting (not GitHub Pages).**

### Why?
The API endpoint `/api/create-onramp-session` requires server-side rendering.

### Solution
Deploy to one of these platforms:
- **Vercel** ⭐ (recommended - zero config)
- **Netlify** (requires adapter change)
- **Railway**
- **DigitalOcean App Platform**

**See `DEPLOYMENT_GUIDE.md` for step-by-step instructions.**

---

## 📁 Key Files

### Implementation
- `/src/pages/buy-crypto.astro` - Main page
- `/src/pages/api/create-onramp-session.ts` - API endpoint
- `/src/components/Header.astro` - Navigation (modified)
- `astro.config.mjs` - Config (modified for SSR)

### Documentation
- `DEPLOYMENT_GUIDE.md` - How to deploy
- `SOLANA_INTEGRATION.md` - Solana-specific details
- `BUY_CRYPTO_README.md` - Full documentation
- `QUICK_START_BUY_CRYPTO.md` - Quick start guide
- `ARCHITECTURE.md` - System architecture

---

## 🔐 Environment Variables

Already configured in `.env`:
```
STRIPE_SECRET_KEY=sk_live_51RrJoh...
STRIPE_PUBLISHABLE_KEY=pk_live_51RrJoh...
```

**⚠️ You must add these to your hosting platform!**

---

## 🧪 Testing

### Test Solana Address
```
7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### Test Flow
1. Visit `/buy-crypto`
2. Enter Solana wallet address
3. Select cryptocurrency (SOL/USDC/USDT)
4. Click "Buy Crypto"
5. Complete purchase through Stripe

---

## 🔧 Configuration

### Current Setup
```javascript
// astro.config.mjs
export default defineConfig({
  output: "server",           // SSR enabled
  adapter: node({              // Node.js adapter
    mode: "standalone"
  }),
  integrations: [tailwind()],
  site: "https://setoelkahfi.github.io", // UPDATE THIS!
  base: "/",
});
```

### Dependencies Added
- `@astrojs/node@9.5.0` - Node.js adapter for SSR

---

## 📊 API Endpoint

**POST** `/api/create-onramp-session`

**Request:**
```json
{
  "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "destination_currency": "sol",
  "destination_network": "solana"
}
```

**Response:**
```json
{
  "client_secret": "cos_xxx_secret_xxx"
}
```

---

## 🌐 Solana Support

### Supported Cryptocurrencies
- **SOL** - Solana native token
- **USDC** - USD Coin (SPL token)
- **USDT** - Tether (SPL token)

### Wallet Address Format
- **Length:** 32-44 characters
- **Encoding:** Base58
- **Character Set:** `1-9, A-H, J-N, P-Z, a-k, m-z`
- **Excluded:** `0, O, I, l`
- **Regex:** `/^[1-9A-HJ-NP-Za-km-z]{32,44}$/`

---

## 🚀 Deployment Steps (Quick)

### Option 1: Vercel (Easiest)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import repository
5. Add environment variables
6. Deploy ✨

### Option 2: Netlify
1. Install Netlify adapter: `npm install @astrojs/netlify`
2. Update `astro.config.mjs` to use Netlify adapter
3. Deploy via [netlify.com](https://netlify.com)

**Full instructions:** See `DEPLOYMENT_GUIDE.md`

---

## ✅ Pre-Deployment Checklist

- [ ] Choose hosting platform (Vercel/Netlify/Railway)
- [ ] Update `site` URL in `astro.config.mjs`
- [ ] Add environment variables to hosting platform
- [ ] Test build: `npm run build`
- [ ] Deploy to hosting platform
- [ ] Test `/buy-crypto` page in production
- [ ] Test API endpoint with curl/Postman
- [ ] Complete test transaction (use test keys first)
- [ ] Switch to live Stripe keys
- [ ] Monitor [Stripe Dashboard](https://dashboard.stripe.com/)

---

## 🐛 Troubleshooting

### "Cannot GET /api/create-onramp-session"
- Verify `output: "server"` in config
- Check adapter is installed: `npm list @astrojs/node`
- Rebuild: `npm run build`

### Environment variables not working
- Add them to hosting platform dashboard
- Restart/redeploy after adding
- Check spelling matches `.env` file

### Stripe API error
- Verify Stripe keys are correct
- Check if using live vs test keys
- Review server logs for details

### Build fails
```bash
rm -rf node_modules dist .astro
npm install
npm run build
```

---

## 📚 Documentation Index

| File | Purpose |
|------|---------|
| `README_BUY_CRYPTO.md` | This file - Quick reference |
| `DEPLOYMENT_GUIDE.md` | Complete deployment instructions |
| `SOLANA_INTEGRATION.md` | Solana blockchain details |
| `BUY_CRYPTO_README.md` | Full feature documentation |
| `QUICK_START_BUY_CRYPTO.md` | Getting started guide |
| `ARCHITECTURE.md` | System architecture & diagrams |
| `CHANGES_SUMMARY.md` | All changes made |

---

## 📞 Support

### Stripe
- Dashboard: https://dashboard.stripe.com/
- Docs: https://docs.stripe.com/crypto/onramp
- Support: https://support.stripe.com/

### Solana
- Explorer: https://explorer.solana.com/
- Docs: https://docs.solana.com/

### Hosting
- Vercel: https://vercel.com/support
- Netlify: https://netlify.com/support
- Railway: https://railway.app/help

---

## 💡 Quick Tips

1. **Development:** Use Stripe test keys for local testing
2. **Production:** Switch to Stripe live keys before launch
3. **Monitoring:** Check Stripe Dashboard regularly
4. **Security:** Never commit `.env` file (already git-ignored)
5. **Testing:** Test with small amounts first
6. **Updates:** Keep Stripe SDK updated

---

## 🎉 You're Ready!

Your buy-crypto feature is complete and ready for deployment.

**Next step:** Read `DEPLOYMENT_GUIDE.md` and choose your hosting platform.

---

**Last Updated:** 2024  
**Version:** 1.0  
**Blockchain:** Solana Mainnet  
**Status:** ✅ Production Ready (pending deployment)