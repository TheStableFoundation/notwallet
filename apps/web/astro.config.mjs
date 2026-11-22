import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
  integrations: [tailwind()],
  site: "https://notwallet.eu",
  base: "/",
  redirects: {
    "/a": "/a/solana",
    "/t": "/t/solana",
  },
});
