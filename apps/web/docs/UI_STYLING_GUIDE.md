# UI Styling Guide - Buy Crypto Page

## Overview

This document describes the UI/UX styling and layout decisions for the buy-crypto page, particularly the Stripe Crypto Onramp widget integration.

---

## 🎨 Design Principles

### Nordic Theme
- Clean, minimalist design
- Light color palette with subtle shadows
- Ample white space
- Focus on readability and usability

### Color Scheme
```css
nordic-text: #222           /* Primary text */
nordic-text-secondary: #5E81AC  /* Secondary text */
nordic-accent: #9932CC      /* Purple accent */
nordic-bg: #f5f6fa          /* Light gray background */
white: #fff                 /* Pure white for cards */
```

---

## 📐 Layout Structure

### Page Container
```html
<main class="min-h-screen bg-gradient-to-b from-nordic-bg to-white py-20">
  <div class="container mx-auto px-4 max-w-4xl">
    <!-- Content -->
  </div>
</main>
```

**Properties:**
- Max width: `1024px` (4xl container)
- Centered horizontally with `mx-auto`
- Responsive padding: `px-4`
- Gradient background for depth

---

## 💳 Stripe Widget Styling

### Container Structure

```html
<!-- Crypto Onramp Container -->
<div id="onramp-container" class="hidden mt-8">
    <div id="onramp-element"></div>
</div>
```

### CSS Styling

```css
/* Outer container - provides centering */
#onramp-container {
    display: flex;
    justify-content: center;  /* Center horizontally */
    align-items: flex-start;  /* Align to top */
    width: 100%;
    padding: 0;               /* Remove any padding */
}

/* Inner element - Stripe mounts here */
#onramp-element {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    max-width: 600px;         /* Desktop max width */
    min-height: 600px;        /* Minimum height */
    padding: 0 !important;    /* Force remove padding */
    margin: 0 auto;           /* Center with margin */
}

/* Target the Stripe iframe directly */
#onramp-element iframe,
#onramp-element > div,
#onramp-element > div > iframe {
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    padding: 0 !important;    /* Remove iframe padding */
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: block !important;
}

/* Mobile responsive */
@media (max-width: 768px) {
    #onramp-element {
        max-width: 100%;      /* Full width on mobile */
    }

    #onramp-element iframe,
    #onramp-element > div,
    #onramp-element > div > iframe {
        max-width: 100% !important;
    }
}
```

**Key fixes:**
- `!important` flags to override Stripe's default styles
- Direct iframe targeting to remove padding
- Flexbox on both container and element for proper centering
- `margin: 0 auto` as backup centering method

---

## 🖥️ Desktop Layout

### Widget Positioning
- **Centered horizontally** using flexbox
- **Max width: 600px** for optimal readability
- **Shadow effect** for visual hierarchy
- **Rounded corners** matching card design

### Visual Hierarchy
```
┌─────────────────────────────────────────────────┐
│              Page Header (centered)              │
├─────────────────────────────────────────────────┤
│                                                  │
│     ┌─────────────────────────────────┐        │
│     │   Wallet Address Input Form     │        │
│     │   (max-width: 100% of container)│        │
│     └─────────────────────────────────┘        │
│                                                  │
│                                                  │
│         ┌─────────────────────┐                │
│         │  Stripe Widget      │  ← Centered    │
│         │  (max-width: 600px) │                │
│         │                     │                │
│         └─────────────────────┘                │
│                                                  │
│     ┌─────────────────────────────────┐        │
│     │   Information Cards (3 cols)    │        │
│     └─────────────────────────────────┘        │
└─────────────────────────────────────────────────┘
```

---

## 📱 Mobile Layout

### Responsive Breakpoints

**Mobile (< 768px):**
- Widget: Full width (100%)
- Form: Full width
- Info cards: Stack vertically (1 column)

**Tablet (768px - 1024px):**
- Widget: Max 600px, centered
- Form: Full width of container
- Info cards: 2-3 columns

**Desktop (> 1024px):**
- Widget: Max 600px, centered
- Form: Full width of container (max 4xl)
- Info cards: 3 columns

---

## 🎯 Component Styling

### Form Card
```css
.form-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Input Fields
```css
.input-field {
    width: 100%;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    color: #222;
}

.input-field:focus {
    outline: none;
    ring: 2px solid #9932CC;
}
```

### Button
```css
.buy-button {
    width: 100%;
    background: linear-gradient(to right, #9932CC, #3b82f6);
    color: white;
    font-weight: 600;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    transition: opacity 0.2s;
}

.buy-button:hover {
    opacity: 0.9;
}

.buy-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

---

## 🎭 Visual Effects

### Shadows
- **Form card**: `0 10px 15px rgba(0, 0, 0, 0.1)`
- **Stripe widget**: `0 10px 25px rgba(0, 0, 0, 0.1)`
- **Info cards**: `0 10px 15px rgba(0, 0, 0, 0.1)`

### Transitions
- Button hover: `opacity 0.2s`
- Focus rings: Instant (no transition)

### Border Radius
- Large cards: `1rem` (16px)
- Small cards: `0.75rem` (12px)
- Inputs: `0.5rem` (8px)
- Buttons: `0.5rem` (8px)

---

## 📊 Spacing System

### Margins
- Section spacing: `mt-12` (3rem / 48px)
- Card spacing: `mb-8` (2rem / 32px)
- Widget spacing: `mt-8` (2rem / 32px)

### Padding
- Large cards: `p-8` (2rem / 32px)
- Medium cards: `p-6` (1.5rem / 24px)
- Small cards: `p-4` (1rem / 16px)
- Inputs: `py-3 px-4` (0.75rem 1rem)

---

## 🔤 Typography

### Headings
```css
h1 {
    font-size: 2.5rem;      /* 40px on mobile */
    font-size: 3rem;        /* 48px on desktop (md:) */
    font-weight: 700;
    color: #222;
    margin-bottom: 1rem;
}

h3 {
    font-size: 1.125rem;    /* 18px */
    font-weight: 600;
    color: #222;
    margin-bottom: 0.5rem;
}
```

### Body Text
```css
p.lead {
    font-size: 1.125rem;    /* 18px */
    color: #5E81AC;
}

p.small {
    font-size: 0.875rem;    /* 14px */
    color: #5E81AC;
}
```

---

## 🎨 Widget Appearance

### Stripe Configuration
```javascript
const session = stripeOnramp.createSession({
    clientSecret: client_secret,
    appearance: {
        theme: 'dark',  // Can be 'dark' or 'light'
    },
});
```

### Custom Styling
The widget inherits:
- Border radius from container
- Shadow effects
- Max width constraints
- Responsive behavior

---

## 🔄 State Changes

### Loading State
```css
.loading {
    opacity: 0.5;
    cursor: wait;
}
```

### Error State
```css
.error-message {
    color: #ef4444;  /* red-400 */
    font-size: 0.875rem;
    margin-top: 1rem;
}
```

### Hidden State
```css
.hidden {
    display: none;
}
```

### Visible State
Widget transitions from hidden to visible when mounted:
```javascript
onrampContainer.classList.remove("hidden");
```

---

## 📏 Dimensions

### Desktop
- **Page max-width**: 1024px (4xl)
- **Widget max-width**: 600px
- **Widget min-height**: 600px
- **Form card width**: 100% of container

### Mobile
- **Page max-width**: 100vw - 2rem (px-4)
- **Widget max-width**: 100%
- **Widget min-height**: 600px
- **Form card width**: 100%

---

## 🎯 Alignment

### Horizontal Alignment
- **Page content**: Centered with `mx-auto`
- **Stripe widget**: Centered with flexbox
- **Form elements**: Full width (left-aligned content)
- **Headings**: Center aligned (`text-center`)

### Vertical Alignment
- **Widget container**: `align-items: flex-start`
- **Cards**: Natural block flow
- **Buttons**: Full width, no vertical alignment needed

---

## 💡 Best Practices

### Do's ✅
- Keep widget centered on desktop
- Use max-width for readability
- Maintain consistent spacing
- Apply subtle shadows for depth
- Use responsive breakpoints
- Keep mobile-first approach

### Don'ts ❌
- Don't make widget full width on desktop
- Don't use harsh shadows
- Don't mix different spacing scales
- Don't ignore mobile responsiveness
- Don't use fixed heights (except min-height)

---

## 🔧 Customization

### Changing Widget Width
```css
#onramp-element {
    max-width: 700px;  /* Increase from 600px */
}
```

### Adjusting Shadow
```css
#onramp-element {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);  /* Stronger */
}
```

### Changing Theme
```javascript
appearance: {
    theme: 'light',  // Switch to light theme
}
```

---

## 🧪 Testing

### Visual Testing Checklist
- [ ] Widget centered on desktop (1024px+)
- [ ] Widget full-width on mobile (< 768px)
- [ ] Shadows visible but subtle
- [ ] Border radius consistent
- [ ] Text readable on all backgrounds
- [ ] Buttons accessible and clear
- [ ] Focus states visible
- [ ] Loading states clear
- [ ] Error messages prominent
- [ ] Smooth transitions

---

## 🐛 Troubleshooting

### Issue: Iframe has right padding / not centered

**Symptoms:**
- Iframe appears left-aligned with padding on the right
- Default Stripe iframe size is 500x700px
- Extra white space on the right side

**Root Cause:**
Stripe's iframe has default padding that needs to be overridden.

**Solution:**
Target the iframe directly with `!important` flags:

```css
#onramp-element iframe,
#onramp-element > div,
#onramp-element > div > iframe {
    width: 100% !important;
    max-width: 600px !important;
    margin: 0 auto !important;
    padding: 0 !important;
    display: block !important;
}
```

### Issue: Iframe not responsive on mobile

**Solution:**
Add mobile-specific overrides:

```css
@media (max-width: 768px) {
    #onramp-element iframe,
    #onramp-element > div,
    #onramp-element > div > iframe {
        max-width: 100% !important;
    }
}
```

### Issue: Shadow or border radius not visible

**Cause:**
Styles applied to wrong element (parent vs iframe).

**Solution:**
Apply visual effects directly to iframe:

```css
#onramp-element iframe {
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

### Issue: Iframe alignment changes after Stripe loads

**Cause:**
Stripe dynamically adds styles after mounting.

**Solution:**
Use `!important` flags and apply to multiple selectors:

```css
/* Target all possible Stripe containers */
#onramp-element,
#onramp-element > *,
#onramp-element iframe {
    padding: 0 !important;
    margin: 0 auto !important;
}
```

---

## 📚 References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stripe Elements Appearance API](https://stripe.com/docs/elements/appearance-api)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Responsive Design Patterns](https://web.dev/responsive-web-design-basics/)
- [CSS Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

---

**Last Updated:** 2024  
**Version:** 1.1  
**Status:** Production