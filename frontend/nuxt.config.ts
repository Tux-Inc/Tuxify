// https://nuxt.com/docs/api/configuration/nuxt-config
import {existsSync, readFileSync} from "node:fs";

export default defineNuxtConfig({
  css: [
    '~/assets/css/main.css',
    'boxicons/css/boxicons.min.css',
  ],
  devtools: { enabled: true },
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
