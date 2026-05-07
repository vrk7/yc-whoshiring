import { defineConfig } from "vite";

export default defineConfig({
  // index.html at root is automatically the entry point in Vite
  // public/ folder contents are served as-is (manifest.json, icons)
  build: {
    outDir: "dist",
  },
});
