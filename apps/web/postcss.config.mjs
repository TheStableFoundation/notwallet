// PostCSS config is found by walking up the filesystem, and the repo root has a
// postcss.config.cjs for the Tauri app. This file stops the search there and runs
// Tailwind 3 against this site's own tailwind.config.mjs. It replaces the
// @astrojs/tailwind integration, which does not support Astro 6 or later.
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [tailwindcss({ config: "./tailwind.config.mjs" }), autoprefixer()],
};
