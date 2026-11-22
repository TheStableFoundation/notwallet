# Desktop Downloads - Quick Start Guide

## 🚀 What Was Implemented

Desktop download functionality for NotWallet that automatically fetches and displays installers from the public GitHub repository `TheStableFoundation/notwallet/releases`.

## ✅ Features Added

- **API Endpoint**: `/api/download-desktop-app` - Fetches releases from GitHub
- **Updated Component**: `Download.astro` - Now shows desktop installers
- **Test Script**: `npm run test:releases` - Verify GitHub API access
- **Platform Detection**: Auto-categorizes macOS (Apple Silicon/Intel), Windows, Linux
- **Direct Downloads**: Links to GitHub release assets
- **No Authentication Required**: Public repository access

## 📁 Files Created/Modified

```
notwallet-web/
├── src/
│   ├── pages/api/
│   │   └── download-desktop-app.ts       ✨ NEW - API endpoint
│   └── components/
│       └── Download.astro                 🔄 UPDATED - Added desktop installers
├── scripts/
│   └── test-github-releases.js            ✨ NEW - Test script
├── docs/
│   └── DESKTOP_DOWNLOADS.md               ✨ NEW - Full documentation
├── DESKTOP_DOWNLOADS_QUICKSTART.md        ✨ NEW - This file
└── package.json                           🔄 UPDATED - Added test script
```

## 🧪 Test It

### 1. Test GitHub API Access

```bash
npm run test:releases
```

Expected output:
```
✅ Successfully fetched release!
📋 Release Details:
  Version: app-v1.0.0
  Assets: 7

📦 Assets by Platform:
  🍎 macOS:
    - NotWallet_1.0.0_aarch64.dmg (10.18 MB)
    - NotWallet_1.0.0_x64.dmg (10.81 MB)
  🐧 Linux:
    - NotWallet-1.0.0-1.x86_64.rpm (13.73 MB)
    - NotWallet_1.0.0_amd64.AppImage (86.6 MB)
    - NotWallet_1.0.0_amd64.deb (13.73 MB)
```

### 2. Test in Browser

```bash
npm run dev
# Visit: http://localhost:4321/#download
```

You should see:
- ✅ App Store and Google Play badges
- ✅ Desktop installers section (if releases exist)
- ✅ macOS, Windows, Linux downloads organized by platform
- ✅ File sizes and architecture labels

## 🎨 What Users See

The download section now displays:

1. **Mobile Apps** (existing)
   - iOS / macOS - App Store button
   - Android - Google Play button

2. **Desktop Apps** (NEW)
   - 🍎 **macOS**
     - Apple Silicon - `NotWallet_1.0.0_aarch64.dmg`
     - Intel - `NotWallet_1.0.0_x64.dmg`
   - 🪟 **Windows** (when available)
     - x64 installers
   - 🐧 **Linux**
     - `.rpm`, `.deb`, `.AppImage` packages

## 🔧 How It Works

```
User visits /#download
         ↓
Download.astro component loads
         ↓
Fetches /api/download-desktop-app
         ↓
API calls GitHub releases API
         ↓
Categorizes assets by platform
         ↓
Returns structured JSON
         ↓
Component displays downloads
```

## 📊 Platform Detection

The system automatically detects platforms based on filename patterns:

| Platform | Detection Pattern | Example |
|----------|------------------|---------|
| **macOS Apple Silicon** | `aarch64`, `arm64` | `NotWallet_1.0.0_aarch64.dmg` |
| **macOS Intel** | `x64`, `x86_64`, `intel` | `NotWallet_1.0.0_x64.dmg` |
| **Windows x64** | `x64`, `.exe`, `.msi` | `NotWallet_1.0.0_x64-setup.exe` |
| **Linux x64** | `x86_64`, `.deb`, `.rpm`, `.AppImage` | `NotWallet_1.0.0_amd64.deb` |

## 🚢 Deployment

### Build & Deploy

```bash
npm run build
```

The site will automatically include desktop downloads if releases are available.

### Cache Settings

- **API Cache**: 1 hour (3600 seconds)
- **Stale While Revalidate**: 24 hours
- **Auto-refresh**: New releases appear within 1 hour

### Force Refresh

To immediately show new releases:
1. Redeploy the site, or
2. Wait 1 hour for cache to expire

## 🐛 Troubleshooting

### No Desktop Installers Showing

**Check:**
1. Does the repository have releases? 
   → https://github.com/TheStableFoundation/notwallet/releases
2. Are assets uploaded to the release?
3. Do filenames match detection patterns?

**Fix:**
- Run `npm run test:releases` to verify
- Check console for errors
- Ensure asset names include architecture (e.g., `x64`, `aarch64`)

### "Failed to load desktop downloads" Error

**Causes:**
- GitHub API rate limit (60/hour for public)
- Network issues
- Repository not accessible

**Fix:**
- Check rate limit: https://api.github.com/rate_limit
- Wait 1 hour if rate limited
- Verify repository is public

## 📚 Documentation

- **Full Guide**: `docs/DESKTOP_DOWNLOADS.md`
- **Test Script**: `scripts/test-github-releases.js`
- **API Code**: `src/pages/api/download-desktop-app.ts`
- **Component**: `src/components/Download.astro`

## 💡 Tips

1. **Consistent Naming**: Use format `AppName_version_arch.ext`
2. **Test After Releases**: Run `npm run test:releases` after publishing
3. **Monitor Rate Limits**: Check if approaching GitHub's 60/hour limit
4. **Semantic Versioning**: Use tags like `app-v1.0.0`

## ✨ What's Next?

The feature is ready to use! Desktop installers will automatically appear on the download page when:
1. Releases exist in GitHub repository
2. Assets are uploaded with proper naming
3. Site is built/deployed

Visit your site and scroll to the download section to see it in action!

## 🎯 Success Metrics

✅ API endpoint working  
✅ Test script passing  
✅ Platform detection accurate  
✅ Downloads display correctly  
✅ Mobile app badges unchanged  
✅ Graceful error handling  
✅ 1-hour caching enabled  

---

**Status**: ✅ Ready for Production  
**Repository**: TheStableFoundation/notwallet (public)  
**No Authentication Required**