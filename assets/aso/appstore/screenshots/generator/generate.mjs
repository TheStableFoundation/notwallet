// App Store Connect screenshot generator — NotWallet.
//
// Renders honest marketing screenshots from the app's REAL markup and the
// production stylesheet (the built Tailwind bundle in dist/assets/*.css),
// framed with captions in the brand's own type and palette, at exact App
// Store Connect pixel sizes.
//
// Adapted from the smbCloud MailX generator. Two differences matter:
//
//   1. MailX ships a single hand-written src/App.css. NotWallet styles come
//      from Tailwind, so the "production stylesheet" is the *built* bundle —
//      run `pnpm build` first and this script picks up dist/assets/*.css.
//   2. NotWallet's iPhone slot on this App Store record is the 6.5" class at
//      1242x2688 (verified against the live AppScreenshotSet). Do not
//      substitute Apple's newer 6.9" size; ASC rejects it for this record.
//
// The screen fragments below reuse the exact Tailwind class names from
// src/components/navbar.tsx and app/chat/_components/chat-view.tsx, so the
// rendered pixels come from the shipped stylesheet rather than from invented
// marketing CSS.
//
// Prerequisites:
//   pnpm build                       # produces dist/assets/index-*.css
//   (cd .ds-sync && npm i playwright)
//
// Run from the repo root:
//   node assets/aso/appstore/screenshots/generator/generate.mjs
//   node assets/aso/appstore/screenshots/generator/generate.mjs --device mac
//
// Output: assets/aso/appstore/screenshots/<dir>/[<locale>/]NN-slug.png

import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "../../../../..");
const require = createRequire(path.join(REPO, ".ds-sync/node_modules/"));
const { chromium } = require("playwright");

// The production Tailwind bundle. Hash changes every build, so glob for it.
const distDir = path.join(REPO, "dist/assets");
if (!existsSync(distDir)) {
  console.error("dist/assets not found — run `pnpm build` first.");
  process.exit(1);
}
const cssFile = readdirSync(distDir).find((f) => f.endsWith(".css"));
if (!cssFile) {
  console.error("No built CSS in dist/assets — run `pnpm build` first.");
  process.exit(1);
}
const APP_CSS = `file://${path.join(distDir, cssFile)}`;

// Supplemental utilities. The app bundle only contains classes Tailwind found
// in src/ and app/; the composed marketing screens below use a few the app
// never uses, and a class Tailwind never emitted silently renders as nothing.
// Build them from the same theme into a separate sheet instead of widening the
// app's content glob (which would ship marketing-only CSS to every user).
const GEN_CSS_OUT = path.join(__dirname, ".gen-utilities.build.css");
execFileSync(
  "npx",
  [
    "tailwindcss",
    "-c", path.join(__dirname, "tailwind.gen.config.js"),
    "-i", path.join(__dirname, "gen-utilities.css"),
    "-o", GEN_CSS_OUT,
  ],
  { cwd: REPO, stdio: "pipe" },
);
const GEN_CSS = `file://${GEN_CSS_OUT}`;

const outDirFor = (device) =>
  path.join(REPO, "assets/aso", device.store, "screenshots", device.dir);

// ── Brand ─────────────────────────────────────────────────────────────────────
// Values mirror tailwind.config.js so the frame and the app agree.

const BRAND = {
  primary: "#9932CC",
  primaryLight: "#A64DFF",
  ink: "#222222",
  inkSoft: "#5E81AC",
  paper: "#ffffff",
};

// ── Icons — copied from src/components/navbar.tsx ────────────────────────────

const navIcons = {
  chat: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4.5 4.2c-.5.47-1.3.12-1.3-.57V5z" stroke="#a21caf" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 9h8M8 12.5h5" stroke="#a21caf" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  wallet: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 19V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v13M9 6v13" stroke="#a21caf" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  profile: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="#a21caf" stroke-width="1.5"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="#a21caf" stroke-width="1.5"/></svg>`,
};

const sparkle = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2z"/></svg>`;
const sendIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="#9932CC"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
const qrIcon = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none"><rect x="6" y="6" width="34" height="34" rx="6" stroke="#222" stroke-width="6"/><rect x="80" y="6" width="34" height="34" rx="6" stroke="#222" stroke-width="6"/><rect x="6" y="80" width="34" height="34" rx="6" stroke="#222" stroke-width="6"/><rect x="18" y="18" width="10" height="10" fill="#222"/><rect x="92" y="18" width="10" height="10" fill="#222"/><rect x="18" y="92" width="10" height="10" fill="#222"/><path d="M56 6v18M56 40v10M74 56H56M114 56H92M56 74v40M74 92h18M92 114v-22M74 74h8" stroke="#222" stroke-width="6" stroke-linecap="square"/></svg>`;

// ── App chrome — exact classes from navbar.tsx / App.tsx ─────────────────────

const topBar = (appName) => `
  <div class="w-full bg-white/70 backdrop-blur-lg shadow">
    <div class="max-w-2xl mx-auto flex flex-row justify-center items-center px-4 py-3 w-full">
      <span class="font-bold text-xl text-primary-main">${appName}</span>
    </div>
  </div>`;

const bottomNav = (active, labels) => {
  const item = (key, label) => {
    const on = key === active;
    const cls = on
      ? "bg-fuchsia-100 text-primary-main shadow font-semibold"
      : "hover:bg-fuchsia-50 text-slate-800";
    return `<div class="flex flex-col items-center justify-center gap-1 px-3 py-1 rounded transition-all duration-200 ${cls}" style="min-width:60px">
      ${navIcons[key]}<span class="text-xs">${label}</span>
    </div>`;
  };
  return `
  <nav class="w-full bg-white/90 backdrop-blur-md border-t shadow-lg mt-auto">
    <div class="max-w-2xl mx-auto flex justify-around items-center px-4 py-2 w-full">
      ${item("chat", labels.chat)}${item("wallet", labels.wallet)}${item("profile", labels.profile)}
    </div>
  </nav>`;
};

// ── Chat screens — exact markup from app/chat/_components/chat-view.tsx ──────

const chatHeader = (name, status, dot = "bg-emerald-500") => `
  <div class="flex items-center gap-3 px-1">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100 text-primary-main">${sparkle}</div>
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-text-primary">${name}</span>
        <span class="inline-block h-2 w-2 rounded-full ${dot}"></span>
      </div>
      <span class="text-xs text-text-secondary">${status}</span>
    </div>
  </div>`;

const composer = (placeholder, disclaimer) => `
  <div class="mt-auto flex flex-col gap-2">
    <div class="flex items-end gap-2 rounded-2xl border bg-white/90 p-2 shadow-lg backdrop-blur-md">
      <div class="flex-1 px-2 py-2 text-sm text-text-secondary">${placeholder}</div>
      <div class="p-1">${sendIcon}</div>
    </div>
    <p class="px-2 text-center text-[11px] text-text-secondary">${disclaimer}</p>
  </div>`;

const userBubble = (t) => `
  <div class="flex justify-end">
    <div class="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm shadow-sm bg-primary-main text-white">${t}</div>
  </div>`;

const botBubble = (t) => `
  <div class="flex justify-start">
    <div class="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm shadow-sm bg-white/90 text-text-primary">${t}</div>
  </div>`;

const chatEmptyScreen = (L) => `
  ${chatHeader(L.assistant, L.statusReady)}
  <div class="flex flex-1 flex-col gap-3 px-1">
    <div class="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-100 text-primary-main">${sparkle}</div>
      <p class="text-lg font-semibold text-text-primary">${L.emptyTitle}</p>
      <p class="max-w-xs text-sm text-text-secondary">${L.tagline}</p>
      <div class="mt-4 flex flex-wrap justify-center gap-2">
        ${L.suggestions
          .map(
            (s) =>
              `<div class="rounded-full border border-fuchsia-200 bg-white/80 px-3 py-1.5 text-xs text-primary-main shadow-sm">${s}</div>`,
          )
          .join("")}
      </div>
    </div>
  </div>
  ${composer(L.placeholder, L.disclaimer)}`;

const chatAnswerScreen = (L) => `
  ${chatHeader(L.assistant, L.statusReady)}
  <div class="flex flex-1 flex-col gap-3 px-1 pt-2 overflow-hidden">
    ${userBubble(L.q1)}
    ${botBubble(L.a1)}
    ${userBubble(L.q2)}
    ${botBubble(L.a2)}
  </div>
  ${composer(L.placeholder, L.disclaimer)}`;

const chatPrivateScreen = (L) => `
  ${chatHeader(L.assistant, L.statusOffline, "bg-slate-300")}
  <div class="flex flex-1 flex-col gap-3 px-1 pt-2 overflow-hidden">
    ${userBubble(L.q3)}
    ${botBubble(L.a3)}
  </div>
  ${composer(L.placeholder, L.disclaimer)}`;

// ── Wallet-side screens ──────────────────────────────────────────────────────
// Built from the same Tailwind vocabulary the app uses (gradient card, rounded
// panels, brand purple). Balances are deliberately modest and generic — never
// imply returns on a financial listing.

const walletScreen = (L) => `
  <div class="px-1 pt-2 flex flex-1 flex-col gap-3">
    <div class="shrink-0 rounded-2xl p-5 shadow-lg" style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.primaryLight});color:#fff">
      <p class="text-xs opacity-80">${L.totalBalance}</p>
      <p class="text-3xl font-bold mt-1">$248.20</p>
      <p class="text-xs opacity-80 mt-2 font-mono">7xKX…9fRt</p>
    </div>
    <div class="shrink-0 rounded-2xl bg-white/90 shadow-sm divide-y">
      ${[
        ["SOL", "Solana", "1.42", "$212.90"],
        ["USDC", "USD Coin", "30.00", "$30.00"],
        ["BACH", "Bach", "120.0", "$5.30"],
      ]
        .map(
          ([sym, nm, amt, usd]) => `
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-100 text-primary-main text-xs font-bold">${sym.slice(0, 2)}</div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-text-primary">${nm}</p>
            <p class="text-xs text-text-secondary">${amt} ${sym}</p>
          </div>
          <p class="text-sm font-semibold text-text-primary">${usd}</p>
        </div>`,
        )
        .join("")}
    </div>
  </div>`;

const receiveScreen = (L) => `
  <div class="px-1 pt-2 flex flex-1 flex-col items-center gap-4">
    <p class="text-lg font-semibold text-text-primary">${L.receiveTitle}</p>
    <div class="shrink-0 rounded-2xl bg-white p-6 shadow-lg">${qrIcon}</div>
    <p class="text-xs text-text-secondary font-mono">7xKX…9fRt</p>
    <div class="rounded-full bg-primary-main text-white px-5 py-2 text-sm font-semibold shadow">${L.copyAddress}</div>
  </div>`;

const profileScreen = (L) => `
  <div class="px-1 pt-2 flex flex-1 flex-col gap-3">
    <div class="shrink-0 rounded-2xl bg-white/90 shadow-sm divide-y">
      ${L.profileRows
        .map(
          (r) => `
        <div class="flex items-center gap-3 px-4 py-4">
          <div class="h-6 w-6 rounded-md bg-fuchsia-100"></div>
          <p class="flex-1 text-sm font-medium text-text-primary">${r}</p>
          <span class="text-text-secondary">›</span>
        </div>`,
        )
        .join("")}
    </div>
    <p class="text-center text-[11px] text-text-secondary pt-2">${L.foot}</p>
  </div>`;

// ── Shots ─────────────────────────────────────────────────────────────────────
// Order matters: the App Store shows only the first 1-3 in search results, so
// the new on-device educator leads.

const SHOTS = [
  { slug: "chat-learn", nav: "chat", screen: chatEmptyScreen, key: "s1" },
  { slug: "chat-answers", nav: "chat", screen: chatAnswerScreen, key: "s2", stampKey: "stampNew" },
  { slug: "chat-on-device", nav: "chat", screen: chatPrivateScreen, key: "s3" },
  { slug: "wallet-keys", nav: "wallet", screen: walletScreen, key: "s4" },
  { slug: "wallet-receive", nav: "wallet", screen: receiveScreen, key: "s5" },
  { slug: "profile-privacy", nav: "profile", screen: profileScreen, key: "s6" },
];

// ── Locales ───────────────────────────────────────────────────────────────────
// Both the marketing caption AND the in-app strings are translated here,
// because NotWallet genuinely ships all four locales (app/lib/utils/i18n.ts) —
// so a Swedish screenshot showing Swedish UI is honest, not a mockup.

const LOCALES = {
  en: {
    dir: "ltr",
    appName: "NotWallet",
    assistant: "Amethyst",
    statusReady: "On-device · private",
    statusOffline: "Offline · on your device",
    emptyTitle: "What would you like to learn?",
    tagline: "Learn how crypto works. Private, on your device.",
    placeholder: "Ask about crypto…",
    disclaimer: "Amethyst explains, it doesn't advise. Not financial advice.",
    suggestions: ["What is a stablecoin?", "How do I keep my wallet safe?", "Why do I need SOL for fees?"],
    q1: "What is a stablecoin?",
    a1: "A stablecoin is a token designed to hold a steady value, usually $1. It does that by holding reserves or using an algorithm — so the peg can break.",
    q2: "What are network fees?",
    a2: "On Solana you pay a small fee in SOL for every transaction. It's usually a fraction of a cent.",
    q3: "Does any of this leave my phone?",
    a3: "No. The model runs on your device, so your questions are never sent to a server.",
    totalBalance: "Total balance",
    receiveTitle: "Receive",
    copyAddress: "Copy address",
    profileRows: ["Activity Feed", "About", "App Info", "Language Preferences"],
    foot: "© 2026 The Stable Foundation",
    nav: { chat: "Chat", wallet: "Wallet", profile: "Profile" },
    tag: "by The Stable Foundation",
    footline: "NotWallet — Solana self-custody, on-device AI",
    stampNew: "New",
    captions: {
      s1: { eyebrow: "On-device AI", headline: "Learn crypto, <em>privately</em>." },
      s2: { eyebrow: "Amethyst", headline: "Plain answers, <em>not hype</em>." },
      s3: { eyebrow: "Private by design", headline: "Runs on your device. <em>Always</em>." },
      s4: { eyebrow: "Self-custody", headline: "Your keys. <em>Your crypto</em>." },
      s5: { eyebrow: "Send & receive", headline: "Move tokens in <em>seconds</em>." },
      s6: { eyebrow: "Yours alone", headline: "Five languages, <em>zero tracking</em>." },
    },
  },
  sv: {
    dir: "ltr",
    appName: "NotWallet",
    assistant: "Amethyst",
    statusReady: "På enheten · privat",
    statusOffline: "Offline · på din enhet",
    emptyTitle: "Vad vill du lära dig?",
    tagline: "Lär dig hur krypto fungerar. Privat, på din enhet.",
    placeholder: "Fråga om krypto…",
    disclaimer: "Amethyst förklarar, men ger inte råd. Inte finansiell rådgivning.",
    suggestions: ["Vad är ett stablecoin?", "Hur skyddar jag min plånbok?", "Varför behöver jag SOL?"],
    q1: "Vad är ett stablecoin?",
    a1: "Ett stablecoin är en token som ska hålla ett stabilt värde, oftast 1 dollar. Det sker via reserver eller en algoritm — så kopplingen kan brista.",
    q2: "Vad är nätverksavgifter?",
    a2: "På Solana betalar du en liten avgift i SOL för varje transaktion. Oftast en bråkdel av ett öre.",
    q3: "Lämnar något min telefon?",
    a3: "Nej. Modellen körs på din enhet, så dina frågor skickas aldrig till en server.",
    totalBalance: "Totalt saldo",
    receiveTitle: "Ta emot",
    copyAddress: "Kopiera adress",
    profileRows: ["Aktivitetsflöde", "Om", "Appinfo", "Språkinställningar"],
    foot: "© 2026 The Stable Foundation",
    nav: { chat: "Chatt", wallet: "Plånbok", profile: "Profil" },
    tag: "av The Stable Foundation",
    footline: "NotWallet — Solana självförvaring, AI på enheten",
    stampNew: "Nytt",
    captions: {
      s1: { eyebrow: "AI på enheten", headline: "Lär dig krypto, <em>privat</em>." },
      s2: { eyebrow: "Amethyst", headline: "Raka svar, <em>ingen hype</em>." },
      s3: { eyebrow: "Privat i grunden", headline: "Körs på din enhet. <em>Alltid</em>." },
      s4: { eyebrow: "Självförvaring", headline: "Dina nycklar. <em>Din krypto</em>." },
      s5: { eyebrow: "Skicka & ta emot", headline: "Flytta tokens på <em>sekunder</em>." },
      s6: { eyebrow: "Bara din", headline: "Fem språk, <em>noll spårning</em>." },
    },
  },
  id: {
    dir: "ltr",
    appName: "NotWallet",
    assistant: "Amethyst",
    statusReady: "Di perangkat · privat",
    statusOffline: "Offline · di perangkatmu",
    emptyTitle: "Mau belajar apa?",
    tagline: "Pelajari cara kerja kripto. Privat, di perangkatmu.",
    placeholder: "Tanya soal kripto…",
    disclaimer: "Amethyst menjelaskan, bukan memberi nasihat keuangan.",
    suggestions: ["Apa itu stablecoin?", "Bagaimana menjaga dompet aman?", "Kenapa perlu SOL?"],
    q1: "Apa itu stablecoin?",
    a1: "Stablecoin adalah token yang dirancang menjaga nilai tetap, biasanya $1. Caranya lewat cadangan aset atau algoritma — jadi patokannya bisa lepas.",
    q2: "Apa itu biaya jaringan?",
    a2: "Di Solana kamu membayar biaya kecil dalam SOL untuk tiap transaksi. Biasanya sepersekian sen.",
    q3: "Apakah ada yang keluar dari ponsel?",
    a3: "Tidak. Modelnya berjalan di perangkatmu, jadi pertanyaanmu tidak pernah dikirim ke server.",
    totalBalance: "Total saldo",
    receiveTitle: "Terima",
    copyAddress: "Salin alamat",
    profileRows: ["Feed Aktivitas", "Tentang", "Info Aplikasi", "Preferensi Bahasa"],
    foot: "© 2026 The Stable Foundation",
    nav: { chat: "Obrolan", wallet: "Dompet", profile: "Profil" },
    tag: "oleh The Stable Foundation",
    footline: "NotWallet — self-custody Solana, AI di perangkat",
    stampNew: "Baru",
    captions: {
      s1: { eyebrow: "AI di perangkat", headline: "Belajar kripto, <em>privat</em>." },
      s2: { eyebrow: "Amethyst", headline: "Jawaban jelas, <em>tanpa hype</em>." },
      s3: { eyebrow: "Privat sejak awal", headline: "Berjalan di perangkatmu. <em>Selalu</em>." },
      s4: { eyebrow: "Self-custody", headline: "Kuncimu. <em>Kriptomu</em>." },
      s5: { eyebrow: "Kirim & terima", headline: "Pindahkan token dalam <em>detik</em>." },
      s6: { eyebrow: "Milikmu saja", headline: "Lima bahasa, <em>tanpa pelacakan</em>." },
    },
  },
  ar: {
    dir: "rtl",
    appName: "NotWallet",
    assistant: "أميثيست",
    statusReady: "على الجهاز · خاص",
    statusOffline: "دون اتصال · على جهازك",
    emptyTitle: "ماذا تريد أن تتعلم؟",
    tagline: "تعلّم كيف تعمل العملات الرقمية. بخصوصية، على جهازك.",
    placeholder: "اسأل عن العملات الرقمية…",
    disclaimer: "أميثيست يشرح ولا يقدّم نصيحة مالية.",
    suggestions: ["ما هي العملة المستقرة؟", "كيف أحمي محفظتي؟", "لماذا أحتاج SOL؟"],
    q1: "ما هي العملة المستقرة؟",
    a1: "العملة المستقرة رمز مصمم للحفاظ على قيمة ثابتة، غالباً دولار واحد. يتم ذلك عبر احتياطيات أو خوارزمية — لذا قد ينكسر الربط.",
    q2: "ما هي رسوم الشبكة؟",
    a2: "على سولانا تدفع رسماً صغيراً بعملة SOL لكل معاملة، وغالباً جزء من السنت.",
    q3: "هل يغادر أي شيء هاتفي؟",
    a3: "لا. النموذج يعمل على جهازك، لذا لا تُرسل أسئلتك إلى أي خادم.",
    totalBalance: "الرصيد الإجمالي",
    receiveTitle: "استقبال",
    copyAddress: "نسخ العنوان",
    profileRows: ["موجز النشاط", "حول", "معلومات التطبيق", "تفضيلات اللغة"],
    foot: "© 2026 The Stable Foundation",
    nav: { chat: "الدردشة", wallet: "المحفظة", profile: "الملف" },
    tag: "من The Stable Foundation",
    footline: "NotWallet — حفظ ذاتي على سولانا، ذكاء على الجهاز",
    stampNew: "جديد",
    captions: {
      s1: { eyebrow: "ذكاء على الجهاز", headline: "تعلّم الكريبتو <em>بخصوصية</em>." },
      s2: { eyebrow: "أميثيست", headline: "إجابات واضحة <em>بلا مبالغة</em>." },
      s3: { eyebrow: "خاص بالتصميم", headline: "يعمل على جهازك. <em>دائماً</em>." },
      s4: { eyebrow: "حفظ ذاتي", headline: "مفاتيحك. <em>عملاتك</em>." },
      s5: { eyebrow: "أرسل واستقبل", headline: "حرّك الرموز في <em>ثوانٍ</em>." },
      s6: { eyebrow: "لك وحدك", headline: "خمس لغات، <em>بلا تتبّع</em>." },
    },
  },
};

// ── Devices ───────────────────────────────────────────────────────────────────
//
// iPhone 1242x2688 is the 6.5" slot this App Store record accepts — verified
// against the live AppScreenshotSet (APP_IPHONE_65). iPad 2048x2732 matches
// APP_IPAD_PRO_3GEN_129. Mac 2880x1800 is the 16:10 class ASC accepts.

// screenW/screenH are the app's *logical* points (iPhone 14 Pro Max is
// 430x932); `zoom` scales that up to fill the frame. Keeping a real device
// aspect ratio is what stops the shell from stretching.
const DEVICES = [
  { store: "appstore", dir: "iphone-6.5", w: 1242, h: 2688, kind: "portrait", zoom: 2.14, captionPx: 100, screenW: 430, screenH: 932, grid: 26 },
  { store: "appstore", dir: "ipad-13", w: 2048, h: 2732, kind: "portrait", zoom: 2.72, captionPx: 124, screenW: 512, screenH: 683, grid: 34 },
  { store: "appstore", dir: "mac", w: 2880, h: 1800, kind: "mac", zoom: 1.62, captionPx: 116, screenW: 900, screenH: 580, grid: 40 },
];

// ── Frame ─────────────────────────────────────────────────────────────────────

const frameCss = (d) => `
  * { box-sizing: border-box; }
  html, body { margin: 0; width: ${d.w}px; height: ${d.h}px; overflow: hidden; }

  /* Grid paper + the app's own fuchsia→sky wash. */
  body {
    background:
      linear-gradient(rgba(34, 34, 34, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34, 34, 34, 0.035) 1px, transparent 1px),
      radial-gradient(circle at 14% 10%, rgba(153, 50, 204, 0.16), transparent 32%),
      radial-gradient(circle at 86% 8%, rgba(56, 152, 236, 0.14), transparent 28%),
      linear-gradient(160deg, #fdf4ff 0%, #f0f9ff 100%);
    background-size: ${d.grid}px ${d.grid}px, ${d.grid}px ${d.grid}px, 100% 100%, 100% 100%, 100% 100%;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .shot { width: 100%; height: 100%; display: flex; flex-direction: column; padding: ${d.w * 0.055}px; position: relative; }

  .wordmark {
    font-weight: 800; letter-spacing: -0.055em; line-height: 0.9;
    color: ${BRAND.ink}; font-size: ${d.captionPx * 0.42}px;
  }
  .wordmark .accent { color: ${BRAND.primary}; }
  .brandline { display: flex; align-items: center; gap: ${d.captionPx * 0.28}px; margin-bottom: ${d.captionPx * 0.5}px; }
  .brandline .tag {
    font-family: ui-monospace, "SF Mono", monospace;
    font-size: ${d.captionPx * 0.155}px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: #6b6b7b;
  }

  .caption { flex: 0 0 auto; padding-bottom: ${d.captionPx * 0.55}px; position: relative; z-index: 2; }
  .caption .cap-eyebrow {
    font-size: ${d.captionPx * 0.24}px; margin: 0 0 ${d.captionPx * 0.28}px;
    letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; color: ${BRAND.inkSoft};
  }
  .caption h1 {
    margin: 0; font-size: ${d.captionPx}px; line-height: 1.02;
    letter-spacing: -0.045em; font-weight: 800; color: ${BRAND.ink}; max-width: 15ch;
  }
  .caption h1 em { font-style: normal; color: ${BRAND.primary}; }

  .stamp {
    position: absolute; top: ${d.w * 0.045}px; ${d.dirRtl ? "left" : "right"}: ${d.w * 0.055}px;
    transform: rotate(7deg); z-index: 3;
    background: ${BRAND.primary}; color: #fff;
    font-family: ui-monospace, "SF Mono", monospace;
    font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    font-size: ${d.captionPx * 0.2}px;
    padding: ${d.captionPx * 0.18}px ${d.captionPx * 0.3}px;
    border-radius: 10px;
    box-shadow: 0 14px 34px rgba(153, 50, 204, 0.32);
  }

  /* Device: tilted card on an offset accent backing sheet. */
  .stage { flex: 1; min-height: 0; position: relative; display: flex; justify-content: center; }
  .stage::before {
    content: ""; position: absolute; z-index: 0;
    top: ${d.captionPx * 0.35}px; bottom: ${d.captionPx * 0.35}px;
    left: 50%;
    width: ${Math.round(d.screenW * d.zoom + 32)}px;
    background: rgba(153, 50, 204, 0.10);
    border: 1px solid rgba(153, 50, 204, 0.18);
    border-radius: 46px;
    transform: translateX(-44%) rotate(2.6deg);
  }
  .device {
    position: relative; z-index: 1; width: ${Math.round(d.screenW * d.zoom + 32)}px;
    background: #fff;
    border: 1px solid rgba(34, 34, 34, 0.10);
    border-radius: 42px;
    box-shadow: 0 40px 90px rgba(34, 34, 34, 0.18), inset 0 1px 0 rgba(255,255,255,0.7);
    overflow: hidden; padding: 16px;
    transform: rotate(-1.6deg);
    align-self: center;
  }
  /* The app's own gradient shell, exactly as App.tsx renders it. */
  .app-shell {
    width: ${d.screenW}px; height: ${d.screenH}px; zoom: ${d.zoom};
    border-radius: 26px; overflow: hidden;
    display: flex; flex-direction: column;
    background: linear-gradient(to top right, #fae8ff, #e0f2fe);
  }
  .app-main { flex: 1; min-height: 0; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }

  /* The app uses viewport-relative and sticky utilities that assume a real
     browser viewport. Inside the zoomed shell those resolve against the
     2688px canvas and blow the layout apart, so neutralise them here — the
     shell itself already provides the device-sized box. */
  .app-shell [class*="min-h-"] { min-height: 0 !important; }
  .app-shell .sticky { position: static !important; }

  .foot {
    position: absolute; ${d.dirRtl ? "right" : "left"}: ${d.w * 0.055}px; bottom: ${d.w * 0.026}px; z-index: 2;
    font-family: ui-monospace, "SF Mono", monospace;
    font-size: ${d.captionPx * 0.15}px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: #8b8ba0;
  }

  /* Mac layout: caption left, window right. */
  .mac-cols { flex: 1; min-height: 0; display: flex; gap: ${d.w * 0.03}px; align-items: stretch; }
  .mac-caption { flex: 0 0 ${d.w * 0.3}px; display: flex; flex-direction: column; justify-content: center; }
  .mac-stage { flex: 1; min-width: 0; position: relative; display: flex; align-items: center; justify-content: center; }
  .mac-stage::before {
    content: ""; position: absolute; z-index: 0; inset: 6% -1% 4% 6%;
    background: rgba(153, 50, 204, 0.10);
    border: 1px solid rgba(153, 50, 204, 0.18);
    border-radius: 34px; transform: rotate(1.6deg);
  }
  .window {
    position: relative; z-index: 1; width: 100%; max-height: 100%;
    background: #fff;
    border: 1px solid rgba(34,34,34,0.10); border-radius: 26px; overflow: hidden;
    box-shadow: 0 40px 90px rgba(34, 34, 34, 0.20);
    display: flex; flex-direction: column; transform: rotate(-1deg);
  }
  .window__bar {
    flex: 0 0 auto; display: flex; gap: 10px; padding: 16px 20px;
    border-bottom: 1px solid rgba(34,34,34,0.08); background: #faf7ff;
  }
  .window__dot { width: 15px; height: 15px; border-radius: 50%; }
  .window__body { flex: 1; min-height: 0; display: flex; justify-content: center; padding: 26px; background: linear-gradient(to top right, #fae8ff, #e0f2fe); }
  .window__body .app-shell { zoom: ${d.zoom * 0.72}; height: auto; background: none; }
`;

function shotHtml(device, shot, localeKey) {
  const L = LOCALES[localeKey];
  const cap = L.captions[shot.key];
  const d = { ...device, dirRtl: L.dir === "rtl" };

  const brandline = `
    <div class="brandline">
      <span class="wordmark">Not<span class="accent">Wallet</span></span>
      <span class="tag">${L.tag}</span>
    </div>`;
  const caption = `
    <div class="caption">
      ${brandline}
      <p class="cap-eyebrow">${cap.eyebrow}</p>
      <h1>${cap.headline}</h1>
    </div>`;
  const stampText = shot.stampKey ? L[shot.stampKey] : null;
  const stamp = stampText ? `<div class="stamp">${stampText}</div>` : "";
  const foot = `<div class="foot">${L.footline}</div>`;

  // The real app shell: top bar, content, three-tab bottom nav.
  const appShell = `
    <div class="app-shell" dir="${L.dir}">
      ${topBar(L.appName)}
      <div class="app-main">${shot.screen(L)}</div>
      ${bottomNav(shot.nav, L.nav)}
    </div>`;

  const titlebar =
    device.kind === "mac"
      ? `<div class="window__bar">
          <span class="window__dot" style="background:#f2564d"></span>
          <span class="window__dot" style="background:#f5b031"></span>
          <span class="window__dot" style="background:#3fb950"></span>
        </div>`
      : "";

  const body =
    device.kind === "mac"
      ? `${stamp}
         <div class="mac-cols">
           <div class="mac-caption">${caption}</div>
           <div class="mac-stage">
             <div class="window">${titlebar}<div class="window__body">${appShell}</div></div>
           </div>
         </div>
         ${foot}`
      : `${stamp}${caption}
         <div class="stage"><div class="device">${appShell}</div></div>
         ${foot}`;

  return `<!doctype html>
<html dir="${L.dir}"><head><meta charset="utf-8">
<link rel="stylesheet" href="${APP_CSS}">
<link rel="stylesheet" href="${GEN_CSS}">
<style>${frameCss(d)}</style>
</head><body><div class="shot">${body}</div></body></html>`;
}

// ── Render ────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const only = argv.includes("--device") ? argv[argv.indexOf("--device") + 1] : null;
const onlyLocale = argv.includes("--locale") ? argv[argv.indexOf("--locale") + 1] : null;

const browser = await chromium.launch();
try {
  const devices = only ? DEVICES.filter((d) => d.dir === only) : DEVICES;
  if (!devices.length) {
    console.error(`Unknown --device ${only}. Options: ${DEVICES.map((d) => d.dir).join(", ")}`);
    process.exit(1);
  }
  const locales = onlyLocale ? [onlyLocale] : Object.keys(LOCALES);

  for (const device of devices) {
    const baseDir = outDirFor(device);
    const page = await browser.newPage({ viewport: { width: device.w, height: device.h } });
    for (const locale of locales) {
      // "en" stays at the flat path so existing markdown references keep working.
      const outDir = locale === "en" ? baseDir : path.join(baseDir, locale);
      mkdirSync(outDir, { recursive: true });
      for (const [i, shot] of SHOTS.entries()) {
        const tmp = path.join(outDir, `.${shot.slug}.html`);
        writeFileSync(tmp, shotHtml(device, shot, locale));
        await page.goto(`file://${tmp}`);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(220);
        const file = path.join(outDir, `${String(i + 1).padStart(2, "0")}-${shot.slug}.png`);
        await page.screenshot({ path: file, clip: { x: 0, y: 0, width: device.w, height: device.h } });
        rmSync(tmp);
        console.log(`✓ ${device.dir}/${locale === "en" ? "" : locale + "/"}${path.basename(file)}`);
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log("done");
