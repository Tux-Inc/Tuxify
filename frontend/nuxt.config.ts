// https://nuxt.com/docs/api/configuration/nuxt-config
import { existsSync, readFileSync } from "node:fs";

export default defineNuxtConfig({
    // nitro: {
    //     prerender: {
    //         routes: [
    //             "/_ipx/s_250x250/landing/contributors/alexandre-kevin_de_freitas_martins.jpg",
    //             "/_ipx/s_250x250/landing/contributors/gwenael_hubler.jpg",
    //             "/_ipx/s_250x250/landing/contributors/stephane_fievez.jpg",
    //             "/_ipx/s_250x250/landing/contributors/roman_lopes.jpg",
    //             "/_ipx/s_250x250/landing/contributors/bouna_diallo.jpg",
    //             "/_ipx/_/landing/ai.png",
    //             "/_ipx/_/landing/services.png",
    //             "/_ipx/_/landing/graph.png",
    //             "/_ipx/_/landing/integration_icons/gmail.svg",
    //             "/_ipx/_/landing/integration_icons/google-calendar.svg",
    //             "/_ipx/_/landing/integration_icons/google-sheets.svg",
    //             "/_ipx/_/landing/integration_icons/google-docs.svg",
    //             "/_ipx/_/landing/integration_icons/google-drive.svg",
    //             "/_ipx/_/landing/integration_icons/linkedin.svg",
    //             "/_ipx/_/landing/integration_icons/slack.svg",
    //         ],
    //     },
    // },
    ssr: true,
    runtimeConfig: {
        public: {
            API_BASE_URL: process.env.API_BASE_URL || "https://api.tuxify.fr",
            API_AUTH_BASE_URL:
                process.env.API_AUTH_BASE_URL || "https://auth.api.tuxify.fr",
            NUXT_IS_CAPACITOR: process.env.NUXT_IS_CAPACITOR || "false",
        },
    },
    build: {
        transpile: ["vue-flow-chart"],
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
    css: [
        "boxicons/css/boxicons.min.css",
        "@vue-flow/core/dist/style.css",
        "@vue-flow/core/dist/theme-default.css",
        "~/assets/css/main.css",
    ],
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
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
