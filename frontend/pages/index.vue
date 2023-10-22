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

<script setup lang="ts">
import { useI18n } from "vue-i18n";

definePageMeta({
    layout: "navigation",
});

const i18n = useI18n();
</script>

<template>
    <div>
        <Head>
            <Title>Tuxify Home</Title>
            <Meta name="description" content="Put your description here." />
        </Head>
        <div
            class="relative py-24 sm:py-32 md:py-40 mb-[calc(var(--header-height)*2)]"
        >
            <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div class="relative z-[1] text-center">
                    <h1
                        class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl"
                        v-html="i18n.t('landing.home.hero.title')"
                    />
                    <p
                        class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300"
                    >
                        {{ i18n.t("landing.home.hero.description") }}
                    </p>
                    <div
                        class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center"
                    >
                        <UButton
                            icon="i-heroicons-rocket-launch"
                            size="lg"
                            to="/auth/sign-in"
                            color="primary"
                            variant="solid"
                            >{{ i18n.t("landing.home.hero.getStarted") }}
                        </UButton>
                        <UButton
                            icon="i-mdi-github"
                            size="lg"
                            to="https://github.com/tux-inc/Tuxify"
                            target="_blank"
                            color="white"
                            variant="solid"
                            >{{ i18n.t("landing.home.hero.viewOnGitHub") }}
                        </UButton>
                    </div>
                </div>
            </div>
            <div
                class="flex justify-center items-center w-full absolute bottom-0 left-0 right-0"
            >
                <UIcon
                    name="i-heroicons-chevron-down"
                    class="text-4xl text-dark dark:text-light animate-bounce"
                />
            </div>
        </div>
        <div class="py-24 sm:py-32">
            <UContainer>
                <h2
                    class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl text-center"
                    v-html="i18n.t('landing.home.features.title')"
                />
                <div
                    class="flex flex-raw gap-4 flex-wrap lg:flex-nowrap justify-center items-center mt-8"
                >
                    <UCard
                        class="hover:bg-gray-50 dark:hover:bg-gray-800 hover:outline-primary hover:outline transition duration-150 ease-in-out"
                    >
                        <div
                            class="flex flex-row gap-4 flex-nowrap items-center justify-start"
                        >
                            <NuxtImg
                                alt="ai"
                                class="h-24"
                                src="/landing/ai.png"
                            />
                            <div>
                                <span
                                    class="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl text-center"
                                >
                                    {{
                                        i18n.t("landing.home.features.ai.title")
                                    }}
                                </span>
                                <p
                                    class="text-gray-600 dark:text-gray-300 text-left whitespace-wrap"
                                >
                                    {{
                                        i18n.t(
                                            "landing.home.features.ai.description",
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </UCard>
                    <UCard
                        class="hover:bg-gray-50 dark:hover:bg-gray-800 hover:outline-blue-300 hover:outline transition duration-150 ease-in-out"
                    >
                        <div
                            class="flex flex-row gap-4 flex-nowrap items-center justify-start"
                        >
                            <NuxtImg
                                alt="graph"
                                class="h-24"
                                src="/landing/graph.png"
                            />
                            <div>
                                <span
                                    class="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl text-center"
                                >
                                    {{
                                        i18n.t(
                                            "landing.home.features.graphFlow.title",
                                        )
                                    }}
                                </span>
                                <p
                                    class="text-gray-600 dark:text-gray-300 text-left whitespace-wrap"
                                >
                                    {{
                                        i18n.t(
                                            "landing.home.features.graphFlow.description",
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </UCard>
                    <UCard
                        class="hover:bg-gray-50 dark:hover:bg-gray-800 hover:outline-green-300 hover:outline transition duration-150 ease-in-out"
                    >
                        <div
                            class="flex flex-row gap-4 flex-nowrap items-center justify-start"
                        >
                            <NuxtImg
                                alt="graph"
                                class="h-24"
                                src="/landing/services.png"
                            />
                            <div>
                                <span
                                    class="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl text-center"
                                >
                                    {{
                                        i18n.t(
                                            "landing.home.features.services.title",
                                        )
                                    }}
                                </span>
                                <p
                                    class="text-gray-600 dark:text-gray-300 text-left whitespace-wrap"
                                >
                                    {{
                                        i18n.t(
                                            "landing.home.features.services.description",
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </UCard>
                </div>
            </UContainer>
        </div>
    </div>
</template>
