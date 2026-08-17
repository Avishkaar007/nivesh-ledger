import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the app from a subpath (/<repo>/); Vercel serves from root (/).
  // Override per deployment with the VITE_BASE env var (set in the deploy configs).
  base: process.env.VITE_BASE || '/nivesh-ledger/',
})