import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 5175,
      cors: true,
      // Allow all hosts or use VITE_ALLOWED_HOSTS from .env
      allowedHosts: env.VITE_ALLOWED_HOSTS 
        ? env.VITE_ALLOWED_HOSTS.split(',')
        : true  // true allows all hosts
    }
  }
})
