import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// I created my custom server port a@ 4000, the default was 5173
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000
  },
})
