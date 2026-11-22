# Buy Crypto Feature - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │         /buy-crypto Page (Astro)                      │      │
│  │                                                        │      │
│  │  ┌──────────────────────────────────────────┐        │      │
│  │  │  Wallet Address Input Form               │        │      │
│  │  │  - Ethereum Address                      │        │      │
│  │  │  - Currency Selection (Optional)         │        │      │
│  │  │  - Network Selection (Optional)          │        │      │
│  │  └──────────────────────────────────────────┘        │      │
│  │                      │                                │      │
│  │                      │ User clicks "Buy Crypto"       │      │
│  │                      ▼                                │      │
│  │  ┌──────────────────────────────────────────┐        │      │
│  │  │  JavaScript Handler                      │        │      │
│  │  │  - Validates wallet address              │        │      │
│  │  │  - Makes API request                     │        │      │
│  │  └──────────────────────────────────────────┘        │      │
│  └───────────────────────────────────────────────────────┘      │
│                      │                                           │
│                      │ POST /api/create-onramp-session           │
│                      ▼                                           │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    Astro Server                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  API Endpoint: create-onramp-session.ts               │      │
│  │                                                        │      │
│  │  1. Receives request with wallet_address              │      │
│  │  2. Validates required parameters                     │      │
│  │  3. Reads STRIPE_SECRET_KEY from env                  │      │
│  │  4. Constructs Stripe API request                     │      │
│  └───────────────────────────────────────────────────────┘      │
│                      │                                           │
│                      │ POST to Stripe API                        │
│                      ▼                                           │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    Stripe API                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  Create Crypto Onramp Session                         │      │
│  │                                                        │      │
│  │  - Validates request                                  │      │
│  │  - Creates session                                    │      │
│  │  - Returns client_secret                              │      │
│  └───────────────────────────────────────────────────────┘      │
│                      │                                           │
│                      │ Returns { client_secret }                 │
│                      ▼                                           │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    Astro Server                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  API Endpoint Response                                │      │
│  │                                                        │      │
│  │  Returns { client_secret } to frontend                │      │
│  └───────────────────────────────────────────────────────┘      │
│                      │                                           │
│                      ▼                                           │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                         User Browser                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  JavaScript Handler                                   │      │
│  │                                                        │      │
│  │  1. Receives client_secret                            │      │
│  │  2. Initializes Stripe Onramp SDK                     │      │
│  │  3. Creates session with client_secret                │      │
│  │  4. Mounts widget to DOM                              │      │
│  └───────────────────────────────────────────────────────┘      │
│                      │                                           │
│                      ▼                                           │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  Stripe Crypto Onramp Widget                          │      │
│  │                                                        │      │
│  │  - Payment form                                       │      │
│  │  - Identity verification                              │      │
│  │  - Transaction processing                             │      │
│  └───────────────────────────────────────────────────────┘      │
│                      │                                           │
│                      │ User completes payment                    │
│                      ▼                                           │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  Event Listener                                       │      │
│  │                                                        │      │
│  │  Listens for: onramp_session_updated                  │      │
│  │  - fulfillment_complete                               │      │
│  │  - fulfillment_failed                                 │      │
│  │  - etc.                                               │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                    Stripe Infrastructure                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  - Processes payment                                             │
│  - Verifies identity (KYC)                                       │
│  - Purchases crypto from liquidity provider                      │
│  - Sends crypto to user's wallet address                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Components

#### 1. `/src/pages/buy-crypto.astro`
**Purpose:** Main page for crypto purchase interface

**Responsibilities:**
- Render wallet address input form
- Display currency and network selection options
- Load Stripe Onramp SDK
- Handle form validation
- Initialize Stripe widget
- Display informational cards
- Handle session events

**Dependencies:**
- Layout component
- Header component
- Footer component
- Stripe.js (loaded dynamically)
- Stripe Crypto Onramp SDK (loaded dynamically)

#### 2. `/src/components/Header.astro`
**Purpose:** Navigation header with Buy Crypto link

**Modifications:**
- Added "Buy Crypto" button to desktop navigation
- Added "Buy Crypto" button to mobile menu
- Styled with gradient background

### Backend Components

#### 1. `/src/pages/api/create-onramp-session.ts`
**Purpose:** API endpoint to create Stripe Onramp sessions

**Request Format:**
```typescript
{
  wallet_address: string;      // Required
  destination_currency?: string; // Optional
  destination_network?: string;  // Optional
}
```

**Response Format:**
```typescript
{
  client_secret: string;
}
```

**Error Handling:**
- 400: Missing wallet_address
- 500: Internal server error
- Returns detailed error messages for debugging

**Security:**
- Uses STRIPE_SECRET_KEY from environment variables
- Server-side only (never exposed to client)
- Validates all inputs before making Stripe API call

## Data Flow

### 1. Session Creation Flow
```
User Input → Frontend Validation → API Request → Stripe API → Session Created
```

### 2. Widget Initialization Flow
```
Receive client_secret → Initialize SDK → Create Session → Mount Widget
```

### 3. Payment Flow
```
User Payment → Stripe Processing → KYC Verification → Crypto Purchase → 
Wallet Transfer → Event Notification
```

## Environment Variables

```
STRIPE_SECRET_KEY          - Server-side Stripe API key
STRIPE_PUBLISHABLE_KEY     - Client-side Stripe API key
```

**Storage:** `.env` file (git-ignored)
**Template:** `.env.example` file

## Security Considerations

### 1. API Key Management
- Secret key never exposed to frontend
- Publishable key safe for client-side use
- Keys stored in environment variables
- `.env` file excluded from version control

### 2. Input Validation
- Frontend validates Ethereum address format
- Regex pattern: `^0x[a-fA-F0-9]{40}$`
- Backend validates required parameters
- Stripe validates all transaction parameters

### 3. HTTPS Requirement
- Required for production deployment
- Stripe enforces secure connections
- Test mode available for local development

## Session Lifecycle

```
1. initialized              - Session created, awaiting user action
2. fulfillment_processing   - Payment being processed
3. fulfillment_complete     - Crypto sent to wallet (SUCCESS)
4. fulfillment_failed       - Transaction failed (ERROR)
```

## Integration Points

### 1. Stripe Crypto Onramp API
- **Endpoint:** `https://api.stripe.com/v1/crypto/onramp_sessions`
- **Method:** POST
- **Authentication:** Bearer token (STRIPE_SECRET_KEY)

### 2. Stripe.js (Core Library)
- **Script:** `https://js.stripe.com/v3/`
- **Type:** Dynamic script loading
- **Global:** `window.Stripe`
- **Purpose:** PCI compliance, payment handling, core Stripe features

### 3. Stripe Crypto Onramp SDK
- **Script:** `https://crypto-js.stripe.com/crypto-onramp-outer.js`
- **Type:** Dynamic script loading
- **Global:** `window.StripeOnramp`
- **Purpose:** Cryptocurrency purchase widget

### SDK Loading Strategy
Both SDKs are loaded asynchronously using Promises:
```javascript
Promise.all([loadStripeJS(), loadCryptoOnrampSDK()])
  .then(() => {
    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    stripeOnramp = window.StripeOnramp(STRIPE_PUBLISHABLE_KEY);
  });
```

## Error Handling Strategy

### Frontend Errors
- Display user-friendly messages
- Show error in red below form
- Re-enable "Buy Crypto" button
- Log detailed errors to console

### Backend Errors
- Return structured error objects
- Include error details for debugging
- Log errors to server console
- Return appropriate HTTP status codes

## Styling Architecture

### Theme Integration
- Uses Nordic theme colors from Tailwind config
- Gradient backgrounds (from-nordic-accent to-blue-500)
- Glassmorphism effect (backdrop-blur-sm)
- Responsive design (mobile-first)
- Dark theme for Stripe widget

### Color Palette
```
nordic-accent    - #9932CC (Primary purple)
nordic-night     - #1a1a2e (Dark background)
nordic-muted     - #94a3b8 (Muted text)
white/5          - Transparent white overlay
white/10         - Semi-transparent borders
```

## Performance Considerations

### 1. Script Loading
- Both Stripe.js and Crypto Onramp SDK loaded asynchronously
- Parallel loading using Promise.all()
- Does not block page render
- Only loaded on buy-crypto page
- Error handling for failed script loads

### 2. API Calls
- Single API call per session
- Session reusable until expiration
- Minimal server processing

### 3. Widget Rendering
- Mounted only after successful session creation
- Form hidden when widget displayed
- Efficient DOM manipulation

## Future Enhancements

### Potential Improvements
1. Support multiple blockchain networks
2. Add transaction history
3. Email notifications for completed purchases
4. Support for more cryptocurrencies
5. Multi-language support
6. Analytics integration
6. Additional payment methods using Stripe.js
7. Email notifications for completed purchases
8. Error recovery mechanisms
9. Session persistence (save progress)
10. Webhook integration for server-side notifications
11. User account integration
12. Payment method tokenization

## Testing Strategy

### Unit Tests
- Wallet address validation function
- API endpoint parameter validation
- Error handling logic

### Integration Tests
- Complete purchase flow
- Session creation and retrieval
- Widget initialization
- Event handling

### Manual Testing Checklist
- [ ] Enter valid wallet address
- [ ] Enter invalid wallet address
- [ ] Select different currencies
- [ ] Select different networks
- [ ] Complete full purchase flow
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Verify error messages
- [ ] Check responsive design
- [ ] Test with test API keys

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Live Stripe keys activated
- [ ] HTTPS enabled
- [ ] Domain verified
- [ ] Error logging configured
- [ ] Analytics setup (optional)
- [ ] Performance monitoring
- [ ] Backup and recovery plan
- [ ] Documentation updated
- [ ] Team training completed

## Monitoring and Observability

### Metrics to Track
1. Session creation success rate
2. Transaction completion rate
3. Average transaction time
4. Error rates by type
5. User drop-off points
6. Payment method distribution

### Logging
- Session creation events
- Transaction status updates
- Error occurrences
- API response times

## Support and Maintenance

### Regular Tasks
- Monitor Stripe Dashboard for transactions
- Review error logs
- Update SDK versions as needed
- Test with new browser versions
- Update documentation

### Stripe Dashboard Monitoring
- Transaction volume
- Success/failure rates
- User demographics
- Average transaction amounts
- Common error patterns

## Resources

- [Stripe Crypto Onramp Documentation](https://docs.stripe.com/crypto/onramp)
- [Stripe API Reference](https://docs.stripe.com/api)
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)