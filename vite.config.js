import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // Tailwind v4 uses the PostCSS plugin to transform
      // `@import "tailwindcss";` in your CSS.
      plugins: [tailwindcss],
    },
  },
})
