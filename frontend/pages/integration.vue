<!--
File Name: index.client.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the oauth page

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
-->

<script lang="ts" setup xmlns="http://www.w3.org/1999/html">
import { useI18n } from "vue-i18n";
import { IIntegrationList } from "~/types/IIntegrationList";

definePageMeta({
    layout: "navigation",
});

const i18n = useI18n();
let integrations = ref<IIntegrationList[]>(
    i18n.tm("landing.integration.services") as IIntegrationList[],
);
onUpdated(() => {
    integrations.value = i18n.tm(
        "landing.integration.services",
    ) as IIntegrationList[];
});

function checkIntegration(integration: IIntegrationList[], index: number) {
    if (index === integration.length - 1 && integration.length % 3 === 0) {
        return "";
    } else if (
        index === integration.length - 2 &&
        integration.length % 2 === 0 &&
        integration.length % 3 !== 0
    ) {
        return "md:col-start-2";
    } else if (
        index === integration.length - 1 &&
        integration.length % 3 === 0
    ) {
        return "md:col-start-2";
    } else if (
        index === integration.length - 1 &&
        (integration.length + 1) % 3 !== 0
    ) {
        return "md:col-start-3";
    }
}
</script>

<template>
    <div
        class="py-24 sm:py-32 md:py-40 relative mb-[calc(var(--header-height)*2)]"
    >
        <Head>
            <Title>Tuxify Integration</Title>
            <Meta name="description" content="Put your description here." />
        </Head>
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div class="relative z-[1] text-center">
                <h1
                    class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl"
                    v-html="i18n.t('landing.integration.title')"
                />
                <p
                    class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300"
                >
                    {{ i18n.t("landing.integration.description") }}
                </p>
            </div>
        </div>
        <div
            class="mt-10 flex flex-wrap justify-centermax text-center mx-auto my-auto grid sm:grid-cols-1 gap-8 md:grid-cols-6 text-5xl md:text-6xl"
        >
            <IntegrationList
                v-for="(integration, index) in integrations"
                :class="`${checkIntegration(integrations, index)}`"
                :description="integration.description"
                :icon="integration.icon"
                :title="integration.title"
                :alt="integration.alt"
                class="md:col-span-2 flex flex-col justify-center"
            />
        </div>
    </div>
</template>
