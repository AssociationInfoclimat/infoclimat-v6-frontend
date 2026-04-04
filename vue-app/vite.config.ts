import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {},
      },
    }),
    // vueDevTools(), // I dont need it right now
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      ...(isSsrBuild
        ? {
            leaflet: fileURLToPath(new URL('./src/ssr-stubs/leaflet.ts', import.meta.url)),
            'leaflet-gesture-handling': fileURLToPath(
              new URL('./src/ssr-stubs/empty.ts', import.meta.url),
            ),
            'leaflet.wms': fileURLToPath(new URL('./src/ssr-stubs/empty.ts', import.meta.url)),
          }
        : {}),
    },
  },
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}))
