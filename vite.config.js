import path from 'path';
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from 'unplugin-vue-components/resolvers';
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8080,
        host: "0.0.0.0",
        open: true,
        https:true
    },
    plugins: [
        vue(),
        basicSsl(),
        Components({
            resolvers: [VantResolver()],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "./src/assets/style/main.scss";'
            }
        },
        devSourcemap: true
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },


})
