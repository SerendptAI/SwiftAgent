import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), tailwindcss(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "SwiftAgentWidget",
      fileName: () => "widget-ui.js",
      formats: ["iife"],
    },
    rollupOptions: {
      // Bundle everything — no externals — must be fully self-contained
      external: [],
    },
    // Single output file, no chunk splitting
    cssCodeSplit: false,
    outDir: "dist",
    emptyOutDir: true,
  },
});
