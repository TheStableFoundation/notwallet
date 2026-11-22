# NotWallet Crypto - Developer Guide

Complete developer documentation for the NotWallet Crypto website.

---

## 🚀 Features

- **Buy Crypto Integration**: Purchase SOL, USDC, and USDT directly to Solana wallets via Stripe
- **Nordic Modern Design**: Clean, minimalist aesthetic reflecting Stockholm's design principles
- **Fully Responsive**: Optimized for all screen sizes from mobile to desktop
- **Server-Side Rendering**: Dynamic API endpoints for Stripe integration
- **SEO Optimized**: Comprehensive meta tags and Open Graph support
- **Accessible**: Follows WCAG accessibility standards
- **TailwindCSS Styling**: Modern utility-first CSS framework
- **PCI DSS Compliant**: Secure payment processing via Stripe.js

---

## 🏗️ Tech Stack

- [AstroJS](https://astro.build/) 5.15.2 - SSR-enabled framework
- [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) - Node.js adapter for server-side rendering
- [Stripe.js](https://stripe.com/docs/js) v3 - Payment processing and PCI compliance
- [Stripe Crypto Onramp](https://stripe.com/docs/crypto/onramp) - Cryptocurrency purchase widget
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/TheStableFoundation/notwallet-web.git
cd notwallet-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Stripe API keys
```

### Environment Variables

Create a `.env` file with your Stripe keys:

```bash
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

⚠️ **NEVER commit your `.env` file!** It's already in `.gitignore`.

---

## 🛠️ Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

- Local: `http://localhost:4321`
- Network: `http://[your-ip]:4321`

### Hot Module Replacement (HMR)

Astro supports HMR out of the box. Changes to `.astro`, `.ts`, `.tsx`, and `.css` files will automatically refresh the browser.

---

## 📝 Project Structure

```
notwallet-website/
├── public/                      # Static assets
│   ├── app-icon.png
│   ├── favicon.svg
│   └── ...
├── src/
│   ├── components/              # Reusable Astro components
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── About.astro
│   │   ├── Download.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── layouts/                 # Page layouts
│   │   └── Layout.astro         # Base layout
│   └── pages/                   # Page routes
│       ├── index.astro          # Homepage
│       ├── buy-crypto.astro     # Buy crypto page
│       ├── privacy.astro        # Privacy policy
│       ├── terms.astro          # Terms of service
│       ├── changelog/           # Changelog/blog posts
│       │   ├── index.astro
│       │   └── cold-a-hardware-wallet-by-notwallet-crypto.astro
│       └── api/
│           └── create-onramp-session.ts  # Stripe API endpoint
├── docs/                        # Complete documentation
│   ├── README.md                # Documentation index
│   ├── DEVELOPER_GUIDE.md       # This file
│   ├── QUICK_START_BUY_CRYPTO.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── STRIPE_INTEGRATION.md
│   ├── SOLANA_INTEGRATION.md
│   ├── BUY_CRYPTO_README.md
│   ├── ARCHITECTURE.md
│   ├── UI_STYLING_GUIDE.md
│   ├── CHANGELOG_FEATURE.md
│   ├── IFRAME_FIX_REFERENCE.md
│   ├── CHANGES_SUMMARY.md
│   └── FINAL_SUMMARY.md
├── astro.config.mjs             # Astro configuration (SSR enabled)
├── tailwind.config.mjs          # TailwindCSS configuration
├── .env                         # Environment variables (git-ignored)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project README
```

---

## 🎨 Website Sections

### Homepage (`/`)

- **Hero**: Introduction with app store download links
- **Features**: Key features of NotWallet Crypto
- **About**: Information about the app's Nordic roots
- **Download**: Platform-specific download options
- **Contact**: Contact form and information

### Buy Crypto (`/buy-crypto`)

Purchase cryptocurrency directly to Solana wallets:
- Support for SOL, USDC, and USDT
- Credit card, debit card, and bank transfer payments
- Powered by Stripe's Crypto Onramp
- Full KYC/AML compliance
- PCI DSS Level 1 compliant

**Features:**
- Solana wallet address validation
- Real-time transaction tracking
- Mobile responsive design
- Centered Stripe iframe (max-width: 600px)
- Error handling and user feedback

### Changelog (`/changelog`)

Blog/news section for product announcements:
- Product launches
- Feature updates
- Security announcements
- Company news

**First Post:** Cold ❄️ Hardware Wallet announcement (Coming Soon)

---

## 💳 Buy Crypto Feature

### Overview

Purchase SOL, USDC, or USDT directly to your Solana wallet using:
- Credit cards
- Debit cards
- Bank transfers

Powered by Stripe's Crypto Onramp with full KYC/AML compliance.

### User Flow

1. User visits `/buy-crypto`
2. Enters Solana wallet address (base58, 32-44 chars)
3. Selects cryptocurrency (SOL, USDC, or USDT)
4. Clicks "Buy Crypto"
5. Stripe widget loads
6. User completes payment
7. Crypto sent directly to wallet

### Technical Implementation

**Frontend:**
- Dual SDK approach (Stripe.js + Crypto Onramp)
- Asynchronous parallel SDK loading
- Wallet address validation
- Error handling

**Backend:**
- API endpoint: `/api/create-onramp-session`
- Stripe session creation
- Environment variable validation
- Secure key management

### Documentation

- [Quick Start Guide](./QUICK_START_BUY_CRYPTO.md)
- [Stripe Integration](./STRIPE_INTEGRATION.md)
- [Solana Integration](./SOLANA_INTEGRATION.md)
- [Full Documentation](./BUY_CRYPTO_README.md)

---

## 🌐 Deployment

### Requirements

⚠️ **Important**: This site requires **Node.js hosting** (SSR enabled for API endpoints).

**Cannot be deployed to:**
- GitHub Pages (static hosting only)
- Netlify Static
- Any static hosting service

### Recommended Platforms

#### 1. Vercel (Recommended) ⭐

**Why:** Zero configuration, automatic Astro detection, serverless functions

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Dashboard Setup:**
1. Connect GitHub repository
2. Import project
3. Add environment variables
4. Deploy

#### 2. Netlify

**Requires:** Adapter change to `@astrojs/netlify`

```bash
# Install Netlify adapter
npm install @astrojs/netlify

# Update astro.config.mjs
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  // ...
});
```

#### 3. Railway

**Why:** Simple deployment, good for Node.js apps

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

#### 4. DigitalOcean App Platform

**Setup:**
- Build command: `npm run build`
- Run command: `node ./dist/server/entry.mjs`
- Add environment variables

### Environment Variables Setup

On your hosting platform, add:

```bash
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key
```

### Pre-Deployment Checklist

- [ ] Update `site` URL in `astro.config.mjs`
- [ ] Set environment variables on hosting platform
- [ ] Test build locally: `npm run build`
- [ ] Verify API endpoint works
- [ ] Test buy-crypto page
- [ ] Enable HTTPS (usually automatic)
- [ ] Monitor Stripe Dashboard

### Full Deployment Guide

See [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for detailed platform-specific instructions.

---

## 📚 Documentation

Complete documentation available in the `/docs` folder:

### Quick Start
- [Quick Start Guide](./QUICK_START_BUY_CRYPTO.md) - Get started quickly
- [README](./README.md) - Documentation index

### Integration Guides
- [Stripe Integration](./STRIPE_INTEGRATION.md) - Stripe.js + Crypto Onramp
- [Solana Integration](./SOLANA_INTEGRATION.md) - Solana blockchain

### Technical Documentation
- [Developer Guide](./DEVELOPER_GUIDE.md) - This file
- [Buy Crypto README](./BUY_CRYPTO_README.md) - Complete reference
- [Architecture](./ARCHITECTURE.md) - System architecture
- [UI Styling Guide](./UI_STYLING_GUIDE.md) - UI/UX documentation

### Deployment & Operations
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Platform deployment
- [Changelog Feature](./CHANGELOG_FEATURE.md) - Blog system docs

### Reference
- [Changes Summary](./CHANGES_SUMMARY.md) - All changes made
- [Final Summary](./FINAL_SUMMARY.md) - Project completion
- [Iframe Fix Reference](./IFRAME_FIX_REFERENCE.md) - UI fixes

---

## 🔐 Security

### PCI DSS Compliance

- **Level 1 Certified** via Stripe.js
- Payment data never touches your servers
- Automatic tokenization
- End-to-end encryption

### API Key Management

**Secret Key** (Server-side only):
- Never exposed to frontend
- Stored in `.env` file (git-ignored)
- Required for API endpoint
- Has full account access

**Publishable Key** (Client-side safe):
- Safe to expose in frontend code
- Used to initialize Stripe SDKs
- Identifies your Stripe account

### Best Practices

1. ✅ Use environment variables only
2. ✅ Never commit `.env` file
3. ✅ Rotate keys if exposed
4. ✅ Enable 2FA on Stripe account
5. ✅ Monitor transaction logs
6. ✅ Use HTTPS in production
7. ✅ Validate all inputs
8. ✅ Keep dependencies updated

### Security Checklist

- [ ] Environment variables configured
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS enabled in production
- [ ] Stripe keys rotated if exposed
- [ ] 2FA enabled on Stripe account
- [ ] Dependencies up to date
- [ ] Error logging configured
- [ ] Monitoring setup

### If Keys Are Exposed

See [`SECURITY_WARNING.md`](../SECURITY_WARNING.md) for incident response procedures.

---

## 🧪 Testing

### Local Testing

```bash
# Development
npm run dev

# Test production build
npm run build
npm run preview
```

### Testing Checklist

**Homepage:**
- [ ] All sections load correctly
- [ ] Links work properly
- [ ] Responsive on mobile
- [ ] Images load

**Buy Crypto Page:**
- [ ] Form loads correctly
- [ ] Wallet address validation works
- [ ] Stripe widget centers properly
- [ ] API endpoint responds
- [ ] Error messages display
- [ ] Mobile responsive

**Changelog:**
- [ ] Index page loads
- [ ] Posts load correctly
- [ ] Navigation works
- [ ] Featured post highlighted

### Browser Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

## 🎨 Design System

### Nordic Theme

**Colors:**
```css
nordic-text: #222                /* Primary text */
nordic-text-secondary: #5E81AC   /* Secondary text */
nordic-accent: #9932CC           /* Purple accent */
nordic-bg: #f5f6fa               /* Light background */
nordic-night: #1a1a2e            /* Dark background */
nordic-muted: #94a3b8            /* Muted text */
```

**Typography:**
- Font Family: Inter
- Headings: Bold (700)
- Body: Regular (400)

**Spacing:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px

### Component Patterns

See [UI Styling Guide](./UI_STYLING_GUIDE.md) for complete design system documentation.

---

## 🔧 Troubleshooting

### Build Errors

**Issue:** Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .astro
npm install
npm run build
```

**Issue:** TypeScript errors
```bash
# Check types
npm run astro check
```

### API Endpoint Issues

**Issue:** 500 error on `/api/create-onramp-session`
- Check environment variables are set
- Verify Stripe keys are valid
- Review server logs

**Issue:** CORS errors
- Check `site` URL in `astro.config.mjs`
- Verify adapter is configured correctly

### Stripe Integration Issues

**Issue:** Widget not loading
- Check Stripe SDKs are loading
- Verify publishable key is correct
- Check browser console for errors

**Issue:** Session creation fails
- Verify secret key is valid
- Check Stripe Dashboard for errors
- Review API endpoint logs

---

## 📱 App Store Links

- [Apple App Store](https://apps.apple.com/se/app/notwallet-crypto/id6749607570)
- [Google Play Store](https://play.google.com/store/apps/details?id=xyz.notwallet.NotWallet)

---

## 🤝 Contributing

### Code Style

- Use Prettier for formatting
- Follow TypeScript best practices
- Write semantic HTML
- Use Tailwind utility classes
- Comment complex logic

### Git Workflow

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with descriptive message
5. Push and create PR

### Commit Messages

Format: `type: description`

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

---

## 📞 Support

### Technical Support

- **GitHub Issues:** Report bugs and request features
- **Documentation:** Check `/docs` folder first
- **Stripe Support:** https://support.stripe.com/

### Resources

- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Solana Docs](https://docs.solana.com/)

---

## 📄 License

ISC

---

## 🎯 Quick Links

- [Quick Start](./QUICK_START_BUY_CRYPTO.md)
- [Deployment](./DEPLOYMENT_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)
- [Stripe Integration](./STRIPE_INTEGRATION.md)
- [UI Guide](./UI_STYLING_GUIDE.md)

---

**Last Updated:** 2024  
**Version:** 1.1  
**Framework:** Astro 5.15.2 with SSR  
**Status:** Production Ready

Made with ❄️ in Stockholm