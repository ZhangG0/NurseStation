import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port:8080,
    host:"0.0.0.0",
    open:true
  },
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:'@import "./src/assets/style/main.scss";'
        }
      },
      devSourcemap:true
    },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },


})
