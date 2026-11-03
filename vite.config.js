import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base lets the build work under /nova-auto/ on GitHub Pages and on a custom domain alike
export default defineConfig({
  base: './',
  plugins: [react()],
})
