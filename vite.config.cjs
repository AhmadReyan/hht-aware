// Polyfill crypto for Node < 19 where globalThis.crypto is not defined
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('node:crypto').webcrypto || require('node:crypto');
}

const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const { VitePWA } = require('vite-plugin-pwa');

module.exports = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: "HHT Aware — Awareness App",
        short_name: "HHTAware",
        description: "HHT Awareness App for patients, families, and the public",
        theme_color: "#C0392B",
        background_color: "#1C1C1E",
        display: "standalone",
        orientation: "portrait",
        categories: ["health", "medical", "education"],
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "icons/icon-72.png",
            sizes: "72x72",
            type: "image/png"
          },
          {
            src: "icons/icon-96.png",
            sizes: "96x96",
            type: "image/png"
          },
          {
            src: "icons/icon-128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "icons/icon-144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "icons/icon-152.png",
            sizes: "152x152",
            type: "image/png"
          },
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/icon-384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        screenshots: [
          {
            src: "screenshots/screenshot-1.png",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "HHT Aware Home Screen"
          },
          {
            src: "screenshots/screenshot-2.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
            label: "HHT Aware Dashboard"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          }
        ]
      }
    })
  ]
});
