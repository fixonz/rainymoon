import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    host: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          if (id.includes('src/utils/soundEngine.ts')) {
            return 'sound-engine'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
