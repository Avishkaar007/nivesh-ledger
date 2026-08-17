import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app from a subpath (/<repo>/).
  base: '/nivesh-ledger/',
})