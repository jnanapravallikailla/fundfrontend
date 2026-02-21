import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cesium(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg'],
      workbox: {
        // Raise the limit to cover Cesium.js (5.73 MB)
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        // Don't try to precache huge Cesium assets in the service worker
        globIgnores: [
          '**/cesium/**',
          '**/*.wasm',
        ],
      },
      manifest: {
        name: 'Vriksha Assets',
        short_name: 'Vriksha',
        description: 'Premium Agricultural Asset Management Dashboard',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
