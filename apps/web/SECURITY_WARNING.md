# 🚨 CRITICAL SECURITY WARNING

## ⚠️ STRIPE API KEYS HAVE BEEN EXPOSED

**Your live Stripe API keys were hardcoded in the source code and may have been committed to the public repository.**

---

## 🔴 IMMEDIATE ACTION REQUIRED

### 1. **REVOKE EXPOSED KEYS IMMEDIATELY**

Go to your Stripe Dashboard and **rotate/revoke** these keys:

1. Visit: https://dashboard.stripe.com/apikeys
2. Click on "Reveal live key" for both Secret and Publishable keys
3. Click "Roll key" or "Revoke" for both keys
4. Generate new keys

**DO THIS NOW - Your payment system is compromised!**

---

### 2. **Keys That Were Exposed**

The following keys were hardcoded in the source code:

- ❌ **Secret Key:** `sk_live_51RrJoh...` (FULL KEY WAS VISIBLE)
- ❌ **Publishable Key:** `pk_live_51RrJoh...` (FULL KEY WAS VISIBLE)

**Files that contained exposed keys:**
- `/src/pages/api/create-onramp-session.ts`
- `/src/pages/buy-crypto.astro`
- `/docs/STRIPE_INTEGRATION.md`

---

## ✅ FIXES APPLIED

The following changes have been made to secure the codebase:

### 1. Removed Hardcoded Keys

**Before (INSECURE):**
```javascript
const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY || 
  "sk_live_51RrJoh...FULL_KEY_HERE";
```

**After (SECURE):**
```javascript
const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  return new Response(
    JSON.stringify({ error: "Server configuration error" }),
    { status: 500 }
  );
}
```

### 2. Environment Variables Required

Keys MUST now be set as environment variables:

```bash
STRIPE_SECRET_KEY=your_new_secret_key
STRIPE_PUBLISHABLE_KEY=your_new_publishable_key
```

### 3. Documentation Updated

All documentation now uses placeholder values like:
- `sk_live_...your_secret_key_here`
- `pk_live_...your_publishable_key_here`

---

## 📋 CHECKLIST - Complete These Steps

- [ ] **Revoke old Stripe keys** in dashboard
- [ ] **Generate new Stripe keys**
- [ ] **Update `.env` file** with new keys (locally)
- [ ] **Update environment variables** on hosting platform (Vercel/Netlify)
- [ ] **Test the application** with new keys
- [ ] **Review git history** - check if keys were committed
- [ ] **Monitor Stripe Dashboard** for suspicious activity
- [ ] **Consider enabling 2FA** on Stripe account
- [ ] **Review access logs** in Stripe Dashboard
- [ ] **Notify your team** about the security incident

---

## 🔍 IF KEYS WERE COMMITTED TO GIT

### Check Git History

```bash
git log --all --full-history -- "src/pages/api/create-onramp-session.ts"
git log --all --full-history -- "src/pages/buy-crypto.astro"
```

### If Keys Are in Git History

You need to remove them from git history:

**Option 1: Use BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove sensitive data
bfg --replace-text secrets.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Option 2: Use git-filter-repo**
```bash
pip install git-filter-repo
git filter-repo --path src/pages/api/create-onramp-session.ts --invert-paths
```

**Option 3: GitHub/GitLab Secret Scanning**
- GitHub will automatically detect and alert you
- Follow their remediation steps

---

## 🛡️ PREVENT FUTURE EXPOSURE

### 1. Use Environment Variables Only

**NEVER hardcode:**
```javascript
// ❌ NEVER DO THIS
const API_KEY = "sk_live_actual_key_here";
```

**ALWAYS use environment variables:**
```javascript
// ✅ ALWAYS DO THIS
const API_KEY = import.meta.env.API_KEY;
if (!API_KEY) throw new Error("API_KEY not configured");
```

### 2. Update .env.example

```bash
# .env.example
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

### 3. Verify .gitignore

Ensure `.env` is in `.gitignore`:
```
# .gitignore
.env
.env.production
.env.local
```

### 4. Pre-commit Hooks

Install git-secrets or similar:
```bash
# Install git-secrets
brew install git-secrets

# Setup
git secrets --install
git secrets --register-aws
```

### 5. Use Secret Scanning Tools

- **GitHub:** Enable secret scanning in repository settings
- **GitGuardian:** Free for public repos
- **TruffleHog:** Scan commits for secrets

---

## 📞 SUPPORT & RESOURCES

### Stripe Support
- **Dashboard:** https://dashboard.stripe.com/
- **Support:** https://support.stripe.com/
- **Security:** security@stripe.com

### Report Security Issues
If you believe there was unauthorized access:
1. Contact Stripe immediately
2. Review transaction history
3. Check for unauthorized API calls
4. Enable fraud detection rules

---

## 🔒 CURRENT SECURITY STATUS

### ✅ Secured
- Keys removed from source code
- Environment variables required
- Error handling added
- Documentation sanitized

### ⚠️ Action Required
- **YOU MUST** revoke exposed keys
- **YOU MUST** generate new keys
- **YOU MUST** update deployment environment variables

---

## 📚 Learn More

### Best Practices
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [12 Factor App - Config](https://12factor.net/config)

### Tools
- [git-secrets](https://github.com/awslabs/git-secrets)
- [TruffleHog](https://github.com/trufflesecurity/trufflehog)
- [GitGuardian](https://www.gitguardian.com/)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

## ⚡ SUMMARY

**Status:** 🔴 **CRITICAL - IMMEDIATE ACTION REQUIRED**

**What happened:** Live Stripe API keys were hardcoded in source code

**Risk:** Anyone with access to the repository could:
- Make unauthorized charges
- Access customer data
- Modify payment settings
- Steal funds

**Required action:** 
1. Revoke keys NOW
2. Generate new keys
3. Update environment variables
4. Monitor for suspicious activity

---

**DO NOT DEPLOY until new keys are configured!**

**Last Updated:** 2024
**Severity:** CRITICAL
**Status:** Keys removed from code, rotation required