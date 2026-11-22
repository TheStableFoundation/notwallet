# NotWallet Buy Crypto - Documentation

Complete documentation for the Stripe Crypto Onramp integration feature.

## 📚 Documentation Index

### Quick Start
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Complete developer documentation
- **[README_BUY_CRYPTO.md](./README_BUY_CRYPTO.md)** - Quick reference guide
- **[QUICK_START_BUY_CRYPTO.md](./QUICK_START_BUY_CRYPTO.md)** - Getting started guide

### Integration Guides
- **[STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)** - Stripe.js + Crypto Onramp SDK guide
- **[SOLANA_INTEGRATION.md](./SOLANA_INTEGRATION.md)** - Solana blockchain integration details

### Technical Documentation
- **[BUY_CRYPTO_README.md](./BUY_CRYPTO_README.md)** - Complete feature documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and diagrams
- **[UI_STYLING_GUIDE.md](./UI_STYLING_GUIDE.md)** - UI/UX styling and layout guide

### Deployment & Operations
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions for various platforms
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - Complete list of changes made

---

## 🚀 Quick Links

### For Developers
1. Start here: [Developer Guide](./DEVELOPER_GUIDE.md)
2. Quick start: [Quick Start Guide](./QUICK_START_BUY_CRYPTO.md)
3. Understanding the architecture: [Architecture](./ARCHITECTURE.md)
4. Stripe integration: [Stripe Integration](./STRIPE_INTEGRATION.md)

### For Deployment
1. Deployment guide: [Deployment Guide](./DEPLOYMENT_GUIDE.md)
2. Platform-specific instructions included

### For Reference
1. All changes: [Changes Summary](./CHANGES_SUMMARY.md)
2. Full documentation: [Buy Crypto README](./BUY_CRYPTO_README.md)

---

## 📖 What's Implemented

### Features
- ✅ Stripe.js + Crypto Onramp SDK integration
- ✅ Solana blockchain support (SOL, USDC, USDT)
- ✅ Server-side API endpoint
- ✅ Light-themed responsive UI
- ✅ PCI DSS Level 1 compliance
- ✅ Wallet address validation
- ✅ Real-time transaction tracking

### Technical Stack
- **Framework:** Astro 5.15.2 with SSR
- **Adapter:** @astrojs/node (standalone mode)
- **Payment:** Stripe.js v3 + Crypto Onramp SDK
- **Blockchain:** Solana Mainnet
- **Styling:** Tailwind CSS with Nordic theme

---

## 🎯 Key Highlights

### Dual SDK Integration
- **Stripe.js** - Core payment library, PCI compliance
- **Crypto Onramp SDK** - Cryptocurrency purchase widget

### Solana-Only Support
- Native SOL token
- SPL tokens: USDC, USDT
- Base58 address validation (32-44 chars)

### Security
- PCI DSS Level 1 compliant
- Server-side API key management
- Environment variable configuration
- HTTPS ready

---

## 📂 File Organization

```
docs/
├── README.md                    # This file
├── DEVELOPER_GUIDE.md          # Complete developer documentation
├── README_BUY_CRYPTO.md        # Quick reference
├── QUICK_START_BUY_CRYPTO.md   # Getting started
├── STRIPE_INTEGRATION.md       # Stripe SDK guide
├── SOLANA_INTEGRATION.md       # Solana details
├── BUY_CRYPTO_README.md        # Full documentation
├── ARCHITECTURE.md             # System architecture
├── UI_STYLING_GUIDE.md         # UI/UX styling guide
├── CHANGELOG_FEATURE.md        # Changelog/blog system
├── IFRAME_FIX_REFERENCE.md     # Iframe centering fix
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
├── CHANGES_SUMMARY.md          # All changes
└── FINAL_SUMMARY.md            # Project completion summary
```

---

## 🔧 Configuration

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Astro Config
```javascript
output: "server"
adapter: node({ mode: "standalone" })
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit buy-crypto page
open http://localhost:4321/buy-crypto
```

---

## 📞 Support

### Documentation Issues
If you find any issues with the documentation, please update the relevant file or contact the development team.

### Stripe Support
- Dashboard: https://dashboard.stripe.com/
- Docs: https://stripe.com/docs/
- Support: https://support.stripe.com/

### Solana Support
- Docs: https://docs.solana.com/
- Explorer: https://explorer.solana.com/

---

## 📝 Notes

- All documentation is version controlled
- Keep docs updated with code changes
- Follow existing documentation style
- Test examples before documenting

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Production Ready