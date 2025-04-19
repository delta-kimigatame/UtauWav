/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [ wasm() ],
  test: {
    globals: true, // Jestの `global` な関数 (`describe`, `test` など) を有効にする
    environment: "jsdom",      // ←ここを node から jsdom に変更
    deps: {
      inline: [                 // node_modules 内のこのパッケージも変換を通す
        "@delta-kimigatame/fft-wasm-lib"
      ]}
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
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.wasm']
  },
  server: {
    port: 3000,
  },
});
