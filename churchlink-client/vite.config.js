import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ This tells Vite to fallback to index.html for all 404 routes
    fs: {
      allow: ['..'],
    },
    // The correct fallback option is here:
    historyApiFallback: true
  },
});
