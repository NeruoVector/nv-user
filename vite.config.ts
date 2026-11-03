import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = {
    '/api': { target: env.NV_BACKEND || 'https://neurovector-backend.forge-lang.org', changeOrigin: true, secure: true },
  }
  return {
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { host: '127.0.0.1', port: 5175, proxy },
    preview: { host: '127.0.0.1', port: 4175, proxy },
  }
})
