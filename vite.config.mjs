// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',               // Electron'da file:// için şart
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: false }
})
