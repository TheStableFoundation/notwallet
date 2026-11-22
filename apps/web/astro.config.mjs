import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
  site: "https://notwallet.eu",
  base: "/",
  redirects: {
    "/a": "/a/solana",
    "/t": "/t/solana",
  },
});
