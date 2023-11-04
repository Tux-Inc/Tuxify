<!--
File Name: Footer.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for footer

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const currentYear = new Date().getFullYear();
</script>

<template>
    <div>
        <div
            class="w-full h-px bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
        >
            <div class="bg-gray-50 dark:bg-gray-900 px-2">
                <svg
                    class="h-8 w-8 fill-primary dark:fill-base-light"
                    width="500"
                    height="500"
                    viewBox="0 0 1000 1000"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M378.863 413.876C344.945 319.09 229.406 313.205 180 319.09C191.88 305.451 227.461 286.075 262.24 253.113C291.209 225.658 317.202 186.493 350.985 154.61C402.095 111.865 452.275 108.806 488.981 111.865C550.313 116.976 649.279 142.995 649.279 258.224C644.633 413.876 557.747 462.727 533.586 537.468C509.425 612.209 533.586 665.307 533.586 665.307C533.586 665.307 537.767 584.991 602.816 561.229C667.865 537.468 721.298 477.131 721.298 477.131C744.065 617.915 616.526 627.607 580.514 763.28C560.535 838.55 611.18 892.554 602.816 889.195C378.863 799.258 423.932 577.891 432.76 537.468C447.981 467.773 569.363 199.115 402.095 201.074C344.599 201.747 311.956 224.77 316.602 263.334C321.248 301.899 365.573 322.66 378.863 353.473C394.695 390.179 378.863 413.876 378.863 413.876Z"
                    />
                    <path
                        d="M366.319 238.71V259.618H341.228C341.228 259.618 341.228 297.718 370.036 297.718C390.943 297.718 401.631 288.954 401.631 267.581C401.631 248.996 390.014 238.71 366.319 238.71Z"
                    />
                </svg>
            </div>
        </div>
        <footer class="relative">
            <div
                class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:flex lg:items-center lg:justify-between lg:py-4"
            >
                <div
                    class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3"
                >
                    <UButton
                        aria-label="Discord Logo"
                        icon="i-mdi-discord"
                        size="sm"
                        to="https://discord.gg/2YHSAeV"
                        color="gray"
                        variant="ghost"
                    />
                    <UButton
                        aria-label="Linkedin Logo"
                        icon="i-mdi-linkedin"
                        size="sm"
                        to="https://www.linkedin.com/company/tux-inc"
                        color="gray"
                        variant="ghost"
                    />
                    <UButton
                        aria-label="Twitter Logo"
                        icon="i-mdi-twitter"
                        size="sm"
                        to="https://x.com/tuxinc"
                        color="gray"
                        variant="ghost"
                    />
                    <UButton
                        aria-label="Github Logo"
                        icon="i-mdi-github"
                        size="sm"
                        to="https://github.com/tux-inc"
                        color="gray"
                        variant="ghost"
                    />
                </div>
                <div
                    class="mt-3 lg:mt-0 lg:order-2 flex items-center justify-center"
                >
                    <span
                        class="text-sm text-gray-500 dark:text-gray-400"
                        v-html="i18n.t('landing.footer.publishedWith')"
                    />
                </div>
                <div
                    class="lg:flex-1 flex items-center justify-center lg:justify-start gap-x-1.5 lg:order-1"
                >
                    <span
                        class="text-sm text-gray-500 dark:text-gray-400"
                        v-html="i18n.t('landing.footer.poweredBy')"
                    />
                </div>
            </div>
        </footer>
    </div>
</template>
