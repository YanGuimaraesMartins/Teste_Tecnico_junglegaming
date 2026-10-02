import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@game': resolve(__dirname, 'src/game'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@api': resolve(__dirname, 'src/api'),
      '@mocks': resolve(__dirname, 'src/mocks'),
      '@config': resolve(__dirname, 'src/config'),
    },
  },
  server: {
    port: 5173,
  },
})
