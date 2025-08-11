# Onramper Integration Fixes

This document outlines the fixes applied to the Onramper integration in the NotWallet application.

## Issues Fixed

### 1. Browser Compatibility Issue
**Problem**: The original implementation used Node.js `crypto` module which is not available in browser environments.

**Solution**: Replaced Node.js crypto with Web Crypto API for browser compatibility.

**Files Changed**:
- `lib/helper.ts` - Updated `generateSignature` function to use Web Crypto API

### 2. Signature Generation Algorithm
**Problem**: The original `arrangeStringAlphabetically` function was overly complex and designed for nested parameter structures, but our use case only required simple wallet parameters.

**Solution**: Simplified the algorithm to handle the specific format used by Onramper (`wallets=solana:address`).

**Changes Made**:
- Simplified parameter sorting using URLSearchParams
- Proper handling of colon-separated values in wallet parameters
- Alphabetical sorting of both keys and values

### 3. Async Signature Generation
**Problem**: Web Crypto API is asynchronous, but the original code was synchronous.

**Solution**: Updated the Onramper component to handle async signature generation.

**Files Changed**:
- `app/wallet/buy/onramper/_components/content.tsx` - Added useEffect and state management for async signature generation

## Technical Details

### Web Crypto API Implementation
```typescript
export const generateSignature = async (
  secretKey: string,
  data: string,
): Promise<string> => {
  const sortedData = arrangeStringAlphabetically(data);
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(sortedData);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
```

### Simplified Parameter Sorting
```typescript
function arrangeStringAlphabetically(inputString: string): string {
  const params = new URLSearchParams(inputString);
  const sortedParams = new URLSearchParams();

  Array.from(params.keys())
    .sort()
    .forEach((key) => {
      const value = params.get(key);
      if (value) {
        if (value.includes(":")) {
          const parts = value.split(",").sort();
          sortedParams.append(key, parts.join(","));
        } else {
          sortedParams.append(key, value);
        }
      }
    });

  return sortedParams.toString();
}
```

## How Onramper Integration Works

1. **User Navigation**: User clicks "Buy SOL" button in wallet interface
2. **Parameter Building**: Component builds Onramper parameters including:
   - API key
   - Wallet address (from URL params)
   - UI customization settings
   - Solana-only configuration

3. **Signature Generation**: 
   - Creates sign content string: `wallets=solana:{address}`
   - Sorts parameters alphabetically
   - Generates HMAC-SHA256 signature using signer key
   - Appends signature to URL

4. **Iframe Loading**: Loads Onramper widget in iframe with signed URL

## Testing the Integration

### Prerequisites
- Valid Onramper API key and signer key configured in constants
- Wallet with valid Solana address

### Test Steps
1. Start the development server: `pnpm run dev`
2. Navigate to wallet page
3. Click "Buy SOL" button on a wallet card
4. Verify Onramper iframe loads correctly
5. Check browser console for debug logs showing:
   - Generated iframe source URL
   - Sign content used for signature
   - Generated signature value

### Expected Behavior
- Onramper widget loads without errors
- Widget is pre-configured for Solana purchases
- Wallet address is pre-filled in the widget
- Custom theme colors match NotWallet branding

## Configuration

### Environment Variables
The integration uses the following constants from `src-tauri/src/constants/onramp.rs`:
- `ONRAMPER_KEY`: Public API key for Onramper
- `ONRAMPER_SIGNER_KEY`: Secret key for URL signing

### Widget Parameters
Key parameters configured for the widget:
- `onlyCryptos: "solana"` - Restricts to Solana only
- `hideTopBar: "true"` - Cleaner integration
- `themeName: "light"` - Matches app theme
- Custom colors matching NotWallet branding

## Security Considerations

1. **URL Signing**: All sensitive parameters (wallet addresses) are signed to prevent tampering
2. **HTTPS Only**: Widget only loads over HTTPS
3. **Client-Side Keys**: Signer key is exposed client-side (this is expected for Onramper's model)
4. **Origin Validation**: Onramper validates requests come from registered domains

## Troubleshooting

### Common Issues
1. **Signature Invalid**: Check that the sign content format matches exactly: `wallets=solana:{address}`
2. **Widget Not Loading**: Verify API keys are correct and domain is whitelisted with Onramper
3. **Crypto Errors**: Ensure browser supports Web Crypto API (all modern browsers do)

### Debug Logs
The implementation includes extensive debug logging:
- Check browser console for iframe source URL
- Verify sign content and generated signature
- Look for any async operation errors

## Future Improvements

1. **Error Handling**: Add better error handling for signature generation failures
2. **Loading States**: Improve loading indicators while generating signatures
3. **Offline Support**: Handle cases where crypto operations might fail
4. **Testing**: Add unit tests for signature generation algorithm