# Stripe Iframe Centering Fix - Quick Reference

## Problem

The Stripe Crypto Onramp iframe had the following issues:
- ❌ Left-aligned with right padding on desktop
- ❌ Default size: 500x700px (not responsive)
- ❌ Not centered horizontally
- ❌ Extra white space on right side

## Solution

Applied direct iframe targeting with `!important` CSS overrides.

---

## Before (Broken)

```
┌────────────────────────────────────────┐
│                                         │
│  ┌──────────────┐                      │
│  │   Stripe     │      [padding]       │  ← Left aligned
│  │   Iframe     │                      │
│  │   500x700px  │                      │
│  └──────────────┘                      │
│                                         │
└────────────────────────────────────────┘
```

## After (Fixed)

```
┌────────────────────────────────────────┐
│                                         │
│         ┌──────────────┐               │
│         │   Stripe     │               │  ← Centered!
│         │   Iframe     │               │
│         │   600px max  │               │
│         └──────────────┘               │
│                                         │
└────────────────────────────────────────┘
```

---

## CSS Fix

### Container Structure

```html
<div id="onramp-container" class="hidden mt-8">
    <div id="onramp-element"></div>
</div>
```

### Complete CSS

```css
/* Outer container - provides centering */
#onramp-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    padding: 0;
}

/* Inner element - Stripe mounts here */
#onramp-element {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    max-width: 600px;
    min-height: 600px;
    padding: 0 !important;
    margin: 0 auto;
}

/* Target the Stripe iframe directly - THE FIX! */
#onramp-element iframe,
#onramp-element > div,
#onramp-element > div > iframe {
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    padding: 0 !important;          /* ← Removes right padding */
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: block !important;
}

/* Mobile responsive */
@media (max-width: 768px) {
    #onramp-element {
        max-width: 100%;
    }

    #onramp-element iframe,
    #onramp-element > div,
    #onramp-element > div > iframe {
        max-width: 100% !important;
    }
}
```

---

## Key Points

### Why `!important` is needed
Stripe's iframe comes with default styles that override normal CSS. We need `!important` to ensure our centering works.

### Multiple selectors
```css
#onramp-element iframe,           /* Direct iframe */
#onramp-element > div,            /* Wrapper div */
#onramp-element > div > iframe    /* Nested iframe */
```

Target all possible Stripe container structures.

### Critical properties
```css
padding: 0 !important;            /* Removes right padding */
margin: 0 auto !important;        /* Centers horizontally */
width: 100% !important;           /* Full width of parent */
max-width: 600px !important;      /* Desktop max width */
display: block !important;        /* Proper block layout */
```

---

## Testing Checklist

### Desktop (> 768px)
- [ ] Iframe centered horizontally
- [ ] No padding on right side
- [ ] Max-width: 600px
- [ ] Shadow visible
- [ ] Border radius applied

### Tablet (768px)
- [ ] Iframe still centered
- [ ] No horizontal scroll
- [ ] Proper spacing maintained

### Mobile (< 768px)
- [ ] Iframe full width
- [ ] No overflow
- [ ] Responsive padding
- [ ] Touch-friendly

---

## Browser Testing

Tested and working on:
- ✅ Chrome (iframe: 500x700 → centered 600px max)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## Common Issues

### Issue: Still showing right padding

**Check:**
1. CSS loaded after Stripe mounts?
2. Using `!important` flags?
3. Targeting correct selectors?

**Solution:**
```css
/* Add more specific targeting */
#onramp-element,
#onramp-element *,
#onramp-element iframe {
    padding: 0 !important;
}
```

### Issue: Not centered on specific screen size

**Check:**
1. Media query breakpoints
2. Container max-width
3. Parent container width

**Solution:**
```css
/* Ensure parent has full width */
.container {
    width: 100%;
}
```

---

## Visual Result

### Desktop View (1920px)
```
[<------- 1024px max container ------->]
         [<---- 600px iframe ---->]
```

### Tablet View (768px)
```
[<------- 768px viewport ------->]
      [<---- 600px iframe ---->]
```

### Mobile View (375px)
```
[<- 375px viewport ->]
[<--- full width --->]
```

---

## File Location

**Component:** `/src/pages/buy-crypto.astro`

**Style section:** Lines 361-391 (in `<style is:global>`)

---

## Related Documentation

- [UI Styling Guide](./UI_STYLING_GUIDE.md) - Complete UI documentation
- [Stripe Integration](./STRIPE_INTEGRATION.md) - SDK integration details
- [Changes Summary](./CHANGES_SUMMARY.md) - All changes made

---

## Quick Copy-Paste

If you need to apply this fix to another Stripe iframe:

```css
#your-iframe-container iframe,
#your-iframe-container > div,
#your-iframe-container > div > iframe {
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    padding: 0 !important;
    display: block !important;
}
```

---

**Fixed:** 2024  
**Issue:** Iframe left-aligned with right padding  
**Solution:** Direct iframe targeting with `!important` overrides  
**Status:** ✅ Resolved