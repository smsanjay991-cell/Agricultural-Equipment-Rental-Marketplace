import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: [
      "dazzling-patience-production-43e0.up.railway.app",
      ".up.railway.app",
    ],
  },
});
