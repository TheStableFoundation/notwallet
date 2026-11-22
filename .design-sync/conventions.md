# NotWallet Design Conventions

NotWallet is a cross-platform crypto wallet app (Tauri + React). Its design language combines
Material UI v7 (default theme) for interactive widgets with Tailwind CSS utility classes for layout,
color, and animation.

## Palette

The brand color is **purple** (#9932CC). All brand-colored elements use this or its scale:

| Token | Value | Use |
|---|---|---|
| `--color-primary-main` | `#9932CC` | Buttons, active nav, brand text |
| `--color-primary-light` | `#A64DFF` | Hover states, accents |
| `--color-primary-dark` | `#800080` | Pressed states |
| `--color-secondary-main` | `#AD5AD7` | Secondary actions |
| `--color-secondary-light` | `#C792EA` | Secondary accents |
| `--color-bg-default` | `#f5f6fa` | Page background (fallback) |
| `--color-bg-paper` | `#ffffff` | Cards, sheets |
| `--color-text-primary` | `#222222` | Body text |
| `--color-text-secondary` | `#5E81AC` | Captions, metadata |
| `--color-info-main` | `#ECEFF4` | Info chips, neutral backgrounds |

Tailwind class equivalents (from the custom Tailwind config):

- `text-primary-main`, `bg-primary-main` → `#9932CC`
- `text-secondary-main`, `bg-secondary-main` → `#AD5AD7`
- `bg-background-default`, `bg-background-paper` → page/card backgrounds
- `text-text-primary`, `text-text-secondary` → body/caption text

**App root gradient**: `bg-gradient-to-tr from-fuchsia-100 to-sky-100` (applied to the outermost wrapper). Use this as the page background — it gives the soft purple-to-blue look.

Active/selected states use `bg-fuchsia-100` with `text-primary-main`.

## Styling idiom

**Use Tailwind utility classes for layout and spacing.** Use MUI components for interactive widgets
(buttons, text fields, cards, dialogs, typography scale).

**No custom CSS modules.** No inline `style={}` for design-language concerns — only for dynamic values (widths, heights from JS). Use Tailwind classes for spacing, color, and typography.

**Where to look**: `_ds_bundle.css` holds the compiled token values as CSS custom properties.
The `var(--color-primary-main)` etc. variables are defined there and usable in any inline style
or custom CSS when you need a brand color outside of Tailwind's class vocabulary.

## Layout structure

Every screen follows this shell:

```jsx
// Outermost: gradient background
<div className="bg-gradient-to-tr from-fuchsia-100 to-sky-100 min-h-screen w-full font-sans relative safe-area">
  {/* Fixed top bar (h ≈ 3.5rem) */}
  {/* Fixed bottom nav (h ≈ 3.5rem) */}
  {/* Scrollable main content */}
  <main className="py-4 bottom-nav-safe max-w-2xl mx-auto px-4">
    {/* page content */}
  </main>
</div>
```

Max content width is `max-w-2xl` (42rem) centered with `mx-auto`. Use `px-4` for horizontal padding.

## Navigation pattern

- **Top bar**: fixed, `bg-white/70 backdrop-blur-lg`, shows app name in `text-primary-main font-bold text-xl`
- **Bottom tab nav**: fixed, `bg-white/90 backdrop-blur-md border-t`, 3 tabs (Home / Wallet / Settings)
- Active tab: `bg-fuchsia-100 text-primary-main shadow font-semibold`
- Inactive tab: `hover:bg-fuchsia-50 text-slate-800`

## Animations

Apply `fade-in` class to page-level containers for enter animation (0.6s ease, slides up 12px).
Apply `wiggle` class for error/validation feedback (0.25s).
