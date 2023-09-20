// https://nuxt.com/docs/api/configuration/nuxt-config
import {existsSync, readFileSync} from "node:fs";

export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: [
    '~/assets/css/main.css',
    'boxicons/css/boxicons.min.css',
    'v-network-graph/lib/style.css',
  ],
  devtools: { enabled: true },
  devServer: {
    port: 8080
  },
  ssr: false,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  vite: {
    vue: {
      script: {
        fs: {
          fileExists(file: string) {
            return existsSync(file);
          },
          readFile(file: string) {
            return readFileSync(file, "utf-8");
          },
        },
      },
    },
  },
})
