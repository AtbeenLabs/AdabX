import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub Pages project URL: https://atbeenlabs.github.io/AdabX/
  base: '/AdabX/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'AdabX | همراه هوشمند ادبیات',
        short_name: 'AdabX',
        description: 'محیط یادگیری ادبیات فارسی و آمادگی المپیاد ادبی',
        lang: 'fa',
        dir: 'rtl',
        theme_color: '#f7f7f2',
        background_color: '#f7f7f2',
        display: 'standalone',
        start_url: '/AdabX/',
        scope: '/AdabX/',
        icons: [
          { src: '/AdabX/favicon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/AdabX/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        navigateFallback: '/AdabX/index.html',
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'adabx-fonts', expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 180 } }
          }
        ]
      }
    })
  ],
  build: { outDir: 'dist', sourcemap: false }
});