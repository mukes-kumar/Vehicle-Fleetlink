import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(),
   VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GoRent Car',
        short_name: 'GoRent',
        description: 'Book affordable cars for days, weeks, or months 🚗',
        theme_color: '#2d89ef',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-512.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})



// export default defineConfig({
//   plugins: [
//     react(),
   
//   ],
// });
