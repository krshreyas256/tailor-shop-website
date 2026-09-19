import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Prema Tailoring & Design',
        short_name: 'Prema Tailoring',
        description:
          'Prema Tailoring & Design — Crafted with care, stitched to fit.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f3ece2',
        theme_color: '#5f3e22',
        orientation: 'portrait-primary',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})