// https://nuxt.com/docs/api/configuration/nuxt-config
import {existsSync, readFileSync} from "node:fs";

export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      viewport: 'width=device-width, initial-scale=1, user-scalable=no',
    }
  },
  css: [
    '~/assets/css/main.css',
    'boxicons/css/boxicons.min.css',
    '@vue-flow/core/dist/style.css',
    '@vue-flow/core/dist/theme-default.css',
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
