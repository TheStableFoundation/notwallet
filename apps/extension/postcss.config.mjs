// Intentionally empty. PostCSS config is found by walking up the filesystem, and the
// repo root has a postcss.config.cjs for the Tauri app (Tailwind 3).
// An empty file here stops the search so the root config never runs here (this extension uses Tailwind 4 through @tailwindcss/vite).
export default { plugins: {} };
