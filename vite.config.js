import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false
  },
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, './src/shared/context'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'), 
      '@modules': path.resolve(__dirname, './src/features/modules/components/'),
      '@images' : path.resolve(__dirname, './src/assets/images'),
      '@components': path.resolve(__dirname, './src/shared/components/')
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
})
