import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/hophub/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons/apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/maskable-512.png',
        'data/prices.json',
        'data/meta.json',
      ],
      manifest: {
        name: 'HopHub — пиво, цены, бары, AI',
        short_name: 'HopHub',
        description:
          'Цены на пиво в магазинах РФ, оценки и отзывы, топ недели, бары на карте, AI-сомелье.',
        theme_color: '#e9a92a',
        background_color: '#fff8e6',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/hophub/',
        start_url: '/hophub/',
        lang: 'ru',
        categories: ['lifestyle', 'food', 'social'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,json}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.endsWith('/data/prices.json') ||
              url.pathname.endsWith('/data/meta.json'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'hophub-feed',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          {
            urlPattern: /^https:\/\/(?:[a-z0-9-]+\.)?basemaps\.cartocdn\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'hophub-tiles',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30, maxEntries: 200 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'hophub-fonts',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
