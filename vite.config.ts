import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://samhsteinmetz.github.io/samhsteinmetz.github.io',
  plugins: [react()],
})
