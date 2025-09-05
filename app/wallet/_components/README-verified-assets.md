# Verified Assets Configuration

This document explains how to manage verified asset badges in the wallet application.

## Overview

The verified asset system uses token mint addresses as unique identifiers to display verification badges next to trusted tokens. This ensures proper identification since token symbols are not unique across different tokens.

## Files

- `verified-assets.ts` - Configuration file containing the list of verified assets
- `verified-badge.tsx` - React component that renders the verification badge
- `assets_view.tsx` - Main component that displays assets with verification status

## Adding New Verified Assets

To add a new verified asset, edit the `VERIFIED_ASSETS` array in `verified-assets.ts`:

```typescript
export const VERIFIED_ASSETS: VerifiedAsset[] = [
  {
    address: "So11111111111111111111111111111111111111112", // Native SOL
    symbol: "SOL",
    name: "Solana",
    verified: true,
  },
  {
    address: "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf", // BACH Token
    symbol: "BACH",
    name: "Bach Token",
    verified: true,
  },
  // Add new verified assets here
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Example: USDC
    symbol: "USDC",
    name: "USD Coin",
    verified: true,
  },
];
```

## Required Fields

Each verified asset must include:

- `address`: The token mint address (unique identifier)
- `symbol`: The token symbol displayed to users
- `name`: The full name of the token
- `verified`: Boolean flag (set to `true` for verified assets)

## How to Find Token Mint Addresses

1. **For SPL Tokens**: Use Solana Explorer or Solscan to find the mint address
2. **For Native SOL**: Always use `"So11111111111111111111111111111111111111112"`
3. **From Transaction Data**: Check token transfer transactions to identify mint addresses
4. **Token Registry**: Check official token registries for verified mint addresses

## Security Best Practices

1. **Verify Authenticity**: Always double-check token mint addresses from official sources
2. **Cross-Reference**: Verify addresses across multiple reliable sources
3. **Official Sources**: Use addresses from:
   - Official project documentation
   - Verified social media accounts
   - Reputable token registries
   - Blockchain explorers with verified information

## Badge Design

The verification badge features:
- Modern, minimalist design with green color scheme
- CheckCircle icon for clear visual indication
- Hover effects and smooth transitions
- Responsive sizing options
- High contrast for accessibility

## API Functions

### `isAssetVerified(address: string): boolean`
Checks if a token address is verified.

```typescript
const verified = isAssetVerified("So11111111111111111111111111111111111111112");
// Returns: true (for SOL)
```

### `getVerifiedAsset(address: string): VerifiedAsset | undefined`
Gets complete verified asset information by address.

```typescript
const asset = getVerifiedAsset("So11111111111111111111111111111111111111112");
// Returns: { address: "So1111...", symbol: "SOL", name: "Solana", verified: true }
```

### `getVerifiedAssetBySymbol(symbol: string): VerifiedAsset | undefined`
Fallback method to get asset by symbol (use only when address is unavailable).

## Example Usage

```typescript
import { isAssetVerified, getVerifiedAsset } from './verified-assets';

// Check if an asset is verified
const isSOLVerified = isAssetVerified("So11111111111111111111111111111111111111112");

// Get asset details
const solAsset = getVerifiedAsset("So11111111111111111111111111111111111111112");

// Render verification badge conditionally
{isAssetVerified(tokenAddress) && <VerifiedBadge />}
```

## Important Notes

- Token symbols are NOT unique identifiers - always use mint addresses
- The system automatically displays badges for any token in the verified list
- Changes to `verified-assets.ts` take effect immediately after file save
- Always test new additions in a development environment first
- Keep the list organized and well-documented with comments

## Troubleshooting

**Badge not appearing:**
- Verify the token address is exactly correct (case-sensitive)
- Check that `verified: true` is set
- Ensure the asset interface includes the `address` field

**Wrong token showing as verified:**
- Double-check the mint address against official sources
- Remove or set `verified: false` for incorrect entries
- Clear browser cache if changes don't appear immediately