// Supplemental Tailwind build for the screenshot generator.
//
// The app's own bundle (dist/assets/*.css) only contains the utilities
// Tailwind found in src/ and app/. The generator composes a few marketing-only
// screens that use utilities the app itself never uses (p-5, text-3xl,
// divide-y, ...), and a class Tailwind never emitted silently renders as
// nothing — which is exactly how the wallet card first came out squashed.
//
// Rather than widen the app's content glob (which would ship marketing-only
// CSS to every user), this config generates those utilities into a separate
// sheet from the SAME theme, which the generator links after the app bundle.
import path from "node:path";
import { fileURLToPath } from "node:url";
import base from "../../../../../tailwind.config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  content: [path.join(__dirname, "generate.mjs")],
  theme: base.theme,
  corePlugins: { preflight: false },
  plugins: [],
};
