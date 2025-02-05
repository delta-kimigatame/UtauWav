/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    globals: true, // Jestの `global` な関数 (`describe`, `test` など) を有効にする
    environment: "node",
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "utauwav",
      fileName: (format) => `utauwav.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
  },
});
