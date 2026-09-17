import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API calls through the dev server so the browser sees them as
      // same-origin (localhost -> localhost), avoiding CORS issues in dev.
      "/api/v1": {
        target: "https://1-community-watch-api.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
