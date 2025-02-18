import orange from "@orange-js/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [orange(), tsconfigPaths()],
  build: {
    minify: true,
  },
  optimizeDeps: {
    include: ["tldraw", "@tldraw/sync-core"],
    exclude: ["@cloudflare/puppeteer"],
  },
});
