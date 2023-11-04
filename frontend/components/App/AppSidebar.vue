<!--
File Name: AppSidebar.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for app sidebar

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
const { $event } = useNuxtApp();

const sendEvent = (event: string) => $event(event);
</script>

<template>
    <div
        class="fixed w-[--sidebar-width] top-[--header-height] z-50 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-var(--header-height))] bg-gray-50/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur"
    >
        <div class="flex flex-col items-start justify-between h-full px-6 py-2">
            <div class="flex flex-col items-start justify-start gap-2 w-full">
                <UButton
                    size="lg"
                    icon="i-heroicons-plus"
                    @click="sendEvent('app:newFlow')"
                    color="primary"
                    variant="solid"
                    >{{ i18n.t("app.sidebar.newFlow") }}</UButton
                >
                <UButton
                    to="/app"
                    size="lg"
                    icon="i-heroicons-home"
                    color="gray"
                    variant="ghost"
                >
                    {{ i18n.t("app.sidebar.home") }}
                </UButton>
                <UButton
                    to="/app/flows"
                    size="lg"
                    icon="i-heroicons-link"
                    color="gray"
                    variant="ghost"
                >
                    {{ i18n.t("app.sidebar.flows") }}
                </UButton>
                <UButton
                    to="/app/services"
                    size="lg"
                    icon="i-heroicons-globe-europe-africa"
                    color="gray"
                    variant="ghost"
                    >{{ i18n.t("app.sidebar.services") }}
                </UButton>
            </div>
            <div class="flex flex-col items-start justify-center gap-4 w-full">
                <UButton
                    to="/app/settings"
                    size="lg"
                    icon="i-heroicons-cog-8-tooth"
                    color="gray"
                    variant="ghost"
                >
                    {{ i18n.t("app.sidebar.settings") }}
                </UButton>
            </div>
        </div>
    </div>
</template>
