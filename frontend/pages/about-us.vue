<!--
File Name: index.client.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
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

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { IFounderCardProps } from "~/types/IFounderCardProps";

definePageMeta({
    layout: "navigation",
});

const i18n = useI18n();
let founders = ref<IFounderCardProps[]>(
    i18n.tm("landing.about-us.team.members") as IFounderCardProps[],
);

onUpdated(() => {
    founders.value = i18n.tm(
        "landing.about-us.team.members",
    ) as IFounderCardProps[];
});
</script>

<template>
    <div>
        <Head>
            <Title>Tuxify About-us</Title>
            <Meta name="description" content="Put your description here." />
        </Head>
        <div class="py-24 sm:py-32 md:py-40 relative">
            <div
                class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-[calc(var(--header-height))]"
            >
                <div class="relative z-[1] text-center">
                    <h1
                        class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl"
                        v-html="i18n.t('landing.about-us.hero.title')"
                    />
                    <p
                        class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300"
                    >
                        {{ i18n.t("landing.about-us.hero.description") }}
                    </p>
                </div>
            </div>
            <div
                class="container mx-auto p-6 grid md:grid-cols-4 sm:grid-cols-1 gap-4"
            >
                <FounderCard
                    v-for="(founder, index) in founders"
                    class="md:col-span-2 flex flex-col justify-center"
                    :class="`${
                        index === founders.length - 1 &&
                        founders.length % 2 !== 0
                            ? 'md:col-start-2'
                            : ''
                    }`"
                    :key="index"
                    :image="founder.image"
                    :alt="founder.alt"
                    :name="founder.name"
                    :job="founder.job"
                    :description="founder.description"
                    :socials="founder.socials"
                />
            </div>
        </div>
    </div>
</template>
