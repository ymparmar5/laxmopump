import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: false,
  },
  optimizeDeps: {
    exclude: ["js-big-decimal", "chunk_react"],
  },
});