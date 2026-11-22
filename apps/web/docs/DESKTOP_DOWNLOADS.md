# Desktop Downloads Feature - NotWallet

## Overview

The desktop downloads feature automatically fetches and displays the latest NotWallet desktop installers from the public GitHub repository `TheStableFoundation/notwallet/releases`.

## Features

✅ **Public GitHub Repository** - No authentication required  
✅ **Automatic Platform Detection** - Categorizes installers for macOS (Apple Silicon/Intel), Windows, and Linux  
✅ **Direct Downloads** - Links directly to GitHub release assets  
✅ **Responsive Design** - Works on all devices  
✅ **File Size Display** - Shows formatted file sizes  
✅ **Version Information** - Displays current release version  
✅ **Caching** - 1-hour cache for better performance  

## File Structure

```
notwallet-web/
├── src/
│   ├── pages/
│   │   └── api/
│   │       └── download-desktop-app.ts  # API endpoint
│   └── components/
│       └── Download.astro               # Download section (updated)
├── scripts/
│   └── test-github-releases.js          # Test script
└── docs/
    └── DESKTOP_DOWNLOADS.md             # This file
```

## How It Works

1. **API Endpoint** (`/api/download-desktop-app`)
   - Fetches latest release from GitHub public API
   - Categorizes assets by platform and architecture
   - Returns structured JSON with download URLs
   - Caches response for 1 hour

2. **Download Component** (`Download.astro`)
   - Fetches data from API endpoint at build time
   - Displays mobile app store badges (iOS, Android)
   - Shows desktop installers organized by platform
   - Handles errors gracefully

## Platform Detection

### macOS
- **Apple Silicon**: Files with `aarch64` or `arm64`
- **Intel**: Files with `x64`, `x86_64`, or `intel`
- **Extensions**: `.dmg`, `.pkg`

### Windows
- **x64**: Files with `x64` or `.exe`/`.msi` installers
- **ARM64**: Files with `arm64`
- **Extensions**: `.exe`, `.msi`

### Linux
- **x64**: Files with `x86_64` or standard packages
- **ARM64**: Files with `aarch64`
- **Extensions**: `.AppImage`, `.deb`, `.rpm`

## Testing

### Run Test Script

```bash
npm run test:releases
```

Expected output:
```
🔍 Testing GitHub Releases API Access...
📦 Repository: TheStableFoundation/notwallet
✅ Successfully fetched release!

📋 Release Details:
  Version: app-v1.0.0
  Name: NotWallet Crypto v1.0.0
  Assets: 7

📦 Assets by Platform:
  🍎 macOS: 2 files
  🐧 Linux: 3 files
```

### Test in Browser

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:4321/#download`

3. Verify:
   - Mobile app badges display
   - Desktop installers appear (if releases exist)
   - Download links work
   - File sizes are formatted correctly

## API Response Format

```json
{
  "version": "app-v1.0.0",
  "published_at": "2024-12-03T17:30:47Z",
  "downloads": {
    "macos": [
      {
        "platform": "macos",
        "arch": "Apple Silicon",
        "filename": "NotWallet_1.0.0_aarch64.dmg",
        "size": 10672345,
        "downloadUrl": "https://github.com/.../NotWallet_1.0.0_aarch64.dmg"
      }
    ],
    "windows": [],
    "linux": [
      {
        "platform": "linux",
        "arch": "x64",
        "filename": "NotWallet_1.0.0_amd64.deb",
        "size": 14398720,
        "downloadUrl": "https://github.com/.../NotWallet_1.0.0_amd64.deb"
      }
    ]
  }
}
```

## Deployment

### Build & Deploy

```bash
npm run build
```

The API endpoint is statically generated at build time with edge caching enabled.

### Cache Configuration

- **Duration**: 1 hour (`s-maxage=3600`)
- **Stale While Revalidate**: 24 hours
- **Type**: CDN edge cache

To force refresh after a new release:
- Wait 1 hour for automatic refresh
- Or redeploy the site

## Troubleshooting

### No Desktop Installers Showing

**Possible causes:**
1. No releases published in GitHub repository
2. Asset filenames don't match detection patterns
3. API cache needs refresh

**Solutions:**
1. Check releases exist: https://github.com/TheStableFoundation/notwallet/releases
2. Verify asset naming matches patterns (see Platform Detection)
3. Wait 1 hour or redeploy

### API Returns Error

**Possible causes:**
1. GitHub API rate limit exceeded (60 requests/hour for unauthenticated)
2. Repository is private or doesn't exist
3. Network issues

**Solutions:**
1. Check rate limit: https://api.github.com/rate_limit
2. Verify repository is public
3. Check network connectivity

### Downloads Fail

**Possible causes:**
1. GitHub asset URL expired
2. Browser blocking download
3. File removed from release

**Solutions:**
1. Refresh page to get new URLs
2. Check browser download settings
3. Verify file exists in GitHub release

## GitHub Rate Limits

- **Unauthenticated**: 60 requests/hour per IP
- **Resets**: Every hour
- **Monitoring**: Check with `npm run test:releases`

Since the API caches responses for 1 hour, rate limits are rarely an issue.

## Updating Asset Naming

To customize platform detection, edit `/src/pages/api/download-desktop-app.ts`:

```typescript
const platformPatterns = {
  macos: {
    apple: /aarch64|arm64/i,
    intel: /x64|x86_64|intel/i,
  },
  // ... add your patterns
}
```

## Best Practices

1. ✅ **Use consistent naming** - Follow patterns: `AppName_version_arch.ext`
2. ✅ **Include architecture** - `aarch64`, `x64`, `arm64`, etc.
3. ✅ **Test after releases** - Run `npm run test:releases` after publishing
4. ✅ **Monitor rate limits** - Check if hitting GitHub API limits
5. ✅ **Semantic versioning** - Use tags like `app-v1.0.0`

## Future Enhancements

Possible improvements:
- [ ] Display multiple versions (not just latest)
- [ ] Show release notes
- [ ] Add download counts
- [ ] Implement download analytics
- [ ] Add SHA256 checksums
- [ ] Auto-update checker

## Support

- **GitHub Repository**: https://github.com/TheStableFoundation/notwallet
- **Test Command**: `npm run test:releases`
- **Issues**: Check GitHub repository issues

---

**Last Updated**: December 2024  
**API**: Public GitHub Releases API  
**Authentication**: Not required (public repo)