// Intentionally empty. PostCSS config is found by walking up the filesystem, and the
// repo root has a postcss.config.cjs for the Tauri app (Tailwind 3 over its own config).
// An empty file here stops the search so the root config never runs on this site.
export default { plugins: {} };
