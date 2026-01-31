import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  css: {
    devSourcemap: false,
  },
    server: {
    port: 3000,
    allowedHosts: ["localhost", "3000"],
  },
})
