import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ IP máy
    port: 5173, // Port mặc định của Vite
    strictPort: false, // Tự động tìm port khác nếu port bị chiếm
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
})
