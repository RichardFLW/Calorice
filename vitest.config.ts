// vitest.config.ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    css: true,
    globals: true,
    include: ["__tests__/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  // ✅ Indique à esbuild d'utiliser le runtime JSX automatique (React 17+ / 19)
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
});
