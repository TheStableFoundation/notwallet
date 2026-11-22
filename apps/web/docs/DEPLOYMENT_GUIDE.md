# Deployment Guide - NotWallet Buy Crypto Feature

## 🚨 Important: Deployment Configuration Change

The buy-crypto feature requires **server-side rendering** to handle API endpoints. Your site is now configured with:

```javascript
output: "server"
adapter: node({ mode: "standalone" })
```

This means you **cannot deploy to GitHub Pages** anymore (static hosting only). You need a platform that supports Node.js server-side rendering.

---

## ✅ Recommended Deployment Platforms

### Option 1: Vercel (Recommended) ⭐

**Why Vercel:**
- Built specifically for modern web frameworks
- Automatic Astro detection
- Free SSL certificates
- Easy environment variable management
- Serverless functions support
- Zero-config deployment

**Steps:**

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Add buy-crypto feature"
   git push origin main
   ```

3. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Astro configuration
   - Add environment variables:
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PUBLISHABLE_KEY`
   - Click "Deploy"

4. **Or Deploy via CLI**
   ```bash
   cd notwallet-website
   vercel
   ```

**Environment Variables on Vercel:**
- Go to Project Settings → Environment Variables
- Add your Stripe keys
- Redeploy if needed

---

### Option 2: Netlify

**Why Netlify:**
- Popular hosting platform
- Good Astro support
- Free tier available
- Easy environment variables

**Steps:**

1. **Install Netlify Adapter**
   ```bash
   npm install @astrojs/netlify
   ```

2. **Update astro.config.mjs**
   ```javascript
   import { defineConfig } from "astro/config";
   import tailwind from "@astrojs/tailwind";
   import netlify from "@astrojs/netlify";

   export default defineConfig({
     output: "server",
     adapter: netlify(),
     integrations: [tailwind()],
     site: "https://your-site.netlify.app",
   });
   ```

3. **Deploy via Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site Settings
   - Deploy

---

### Option 3: Railway

**Why Railway:**
- Simple deployment
- Good for Node.js apps
- Database support if needed later

**Steps:**

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables
   - Railway automatically detects Node.js

2. **Environment Variables**
   - Add in Railway dashboard under "Variables"

---

### Option 4: DigitalOcean App Platform

**Why DigitalOcean:**
- Reliable infrastructure
- Good documentation
- Simple pricing

**Steps:**

1. **Create App**
   - Go to DigitalOcean
   - Click "Create" → "Apps"
   - Connect GitHub repository
   - Select Node.js as runtime
   - Set build command: `npm run build`
   - Set run command: `node ./dist/server/entry.mjs`

2. **Add Environment Variables**
   - In App settings → Environment Variables

---

## 🔧 Configuration Files

### Current Configuration (Server Mode)

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [tailwind()],
  site: "https://your-domain.com", // Update this!
  base: "/",
});
```

### Environment Variables Required

```bash
STRIPE_SECRET_KEY=sk_live_51RrJoh...
STRIPE_PUBLISHABLE_KEY=pk_live_51RrJoh...
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Update `site` URL in `astro.config.mjs`
- [ ] Set environment variables on hosting platform
- [ ] Remove `.env` from repository (already git-ignored)
- [ ] Verify HTTPS is enabled (usually automatic)
- [ ] Test API endpoint: `/api/create-onramp-session`
- [ ] Test buy-crypto page: `/buy-crypto`
- [ ] Verify Stripe keys are LIVE keys (not test)
- [ ] Enable Stripe webhook notifications (optional)
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

---

## 📊 Testing After Deployment

### 1. Test Homepage
```
https://your-domain.com/
```
Should load normally.

### 2. Test Buy Crypto Page
```
https://your-domain.com/buy-crypto
```
Should display the form.

### 3. Test API Endpoint
```bash
curl -X POST https://your-domain.com/api/create-onramp-session \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "destination_currency": "sol",
    "destination_network": "solana"
  }'
```
Should return: `{"client_secret":"cos_xxx..."}`

### 4. Complete Purchase Flow
- Visit `/buy-crypto`
- Enter valid Solana wallet address
- Select cryptocurrency
- Click "Buy Crypto"
- Verify Stripe widget loads
- Complete test purchase (with test mode keys first)

---

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build
```

### Test Production Build Locally
```bash
npm run preview
# or
node ./dist/server/entry.mjs
```

### Check Build Output
```bash
ls -la dist/
# Should see:
# - client/       (static assets)
# - server/       (server code)
# - entry.mjs     (entry point)
```

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/create-onramp-session"

**Solution:**
- Verify `output: "server"` in config
- Verify adapter is installed
- Check `prerender = false` in API file
- Rebuild and redeploy

### Issue: Environment variables not working

**Solution:**
- Verify variables are set on hosting platform
- Check spelling matches `.env` file
- Restart/redeploy after adding variables
- Use platform-specific variable format

### Issue: Stripe API error

**Solution:**
- Verify Stripe keys are correct
- Check if using live vs test keys
- Verify API key permissions in Stripe Dashboard
- Check server logs for detailed error

### Issue: Build fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules dist .astro
npm install
npm run build
```

---

## 📝 Post-Deployment

### Update DNS (if using custom domain)
1. Add CNAME or A record to your DNS provider
2. Point to hosting platform's servers
3. Wait for DNS propagation (up to 48 hours)
4. Enable SSL/HTTPS in hosting dashboard

### Monitor Transactions
- [Stripe Dashboard](https://dashboard.stripe.com/)
- Check transaction volume
- Monitor success/failure rates
- Set up alerts for failures

### Update Documentation
Update these files with your production URL:
- `README.md`
- `BUY_CRYPTO_README.md`
- `astro.config.mjs` (site URL)

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 💰 Cost Estimates

### Vercel
- **Hobby Plan:** FREE
  - 100 GB bandwidth
  - Unlimited requests
  - Perfect for small to medium sites

- **Pro Plan:** $20/month
  - 1 TB bandwidth
  - Advanced analytics
  - Team collaboration

### Netlify
- **Free Plan:** $0
  - 100 GB bandwidth
  - 300 build minutes/month

- **Pro Plan:** $19/month
  - 400 GB bandwidth
  - Advanced features

### Railway
- **Trial:** $5 credit (no card required)
- **Developer Plan:** Pay as you go (~$5-10/month for small apps)

---

## 📞 Support

### Platform Support
- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Netlify:** [netlify.com/support](https://netlify.com/support)
- **Railway:** [railway.app/help](https://railway.app/help)

### Stripe Support
- [Stripe Support](https://support.stripe.com/)
- [Stripe Documentation](https://docs.stripe.com/)

### Astro Support
- [Astro Discord](https://astro.build/chat)
- [Astro Documentation](https://docs.astro.build/)

---

## ✅ Quick Start Recommendation

**For fastest deployment (< 10 minutes):**

1. **Use Vercel** (no adapter change needed, works with Node adapter)
2. **Push code to GitHub**
3. **Import to Vercel**
4. **Add environment variables**
5. **Deploy** ✨

That's it! Your site will be live with a custom domain.

---

## 📚 Additional Resources

- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
- [Stripe Production Checklist](https://stripe.com/docs/development/checklist)
- [Vercel Astro Guide](https://vercel.com/docs/frameworks/astro)
- [Netlify Astro Guide](https://docs.netlify.com/integrations/frameworks/astro/)

---

**Last Updated:** 2024  
**Astro Version:** 5.15.2  
**Adapter:** @astrojs/node 9.5.0  
**Mode:** Server (SSR)