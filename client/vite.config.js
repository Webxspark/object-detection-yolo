import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const proxyTarget = process.env.VITE_PROXY_TARGET ?? "http://localhost:5000"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
    port: 3000,
  },
})
