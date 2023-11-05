/*
File Name: nuxt.config.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This is the nuxt configuration file : https://nuxt.com/docs/api/configuration/nuxt-config

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { existsSync, readFileSync } from "node:fs";

export default defineNuxtConfig({
    ssr: true,
    // routeRules: {
    //     "/_nuxt/**": {
    //         cache: {
    //             maxAge: 60 * 60 * 24 * 30 * 12,
    //         },
    //     },
    //     "/_ipx/**": {
    //         cache: {
    //             maxAge: 60 * 60 * 24 * 30 * 12,
    //         },
    //     },
    // },
    // nitro: {
    //     compressPublicAssets: true,
    // },
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.API_BASE_URL || "https://api.tuxify.fr",
            API_AUTH_BASE_URL:
                process.env.API_AUTH_BASE_URL || "https://auth.api.tuxify.fr",
            NUXT_IS_CAPACITOR: process.env.NUXT_IS_CAPACITOR || "false",
        },
    },
    app: {
        pageTransition: { name: "page", mode: "out-in" },
        head: {
            htmlAttrs: {
                lang: "en",
            },
            viewport:
                "width=device-width, initial-scale=1, user-scalable=1, minimum-scale=1, maximum-scale=5",
        },
    },
    modules: ["@nuxt/ui", "@nuxt/image", "@nuxtjs/device"],
    ui: {
        icons: ["heroicons", "mdi"],
    },
    css: ["~/assets/css/main.css"],
    devtools: {
        enabled: false,
    },
    devServer: {
        port: 8080,
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
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
});
