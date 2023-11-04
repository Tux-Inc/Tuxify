<!--
File Name: FounderCard.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the component for the founder card.

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
import { IFounderCardProps, ISocialProps } from "~/types/IFounderCardProps";

const props = withDefaults(defineProps<IFounderCardProps>(), {
    image: "",
    alt: "",
    name: "",
    job: "",
    description: "",
    socials: () => [],
});
</script>

<template>
    <UCard class="flex flex-col">
        <div
            class="md:flex md:flex-row gap-4 md:flex-nowrap items-center justify-start"
        >
            <NuxtImg
                class="rounded-md mx-auto"
                :src="props.image"
                quality="100"
                format="png"
                :alt="props.alt"
                width="250"
                height="250"
            />
            <div>
                <br />
                <div
                    class="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl text-center"
                >
                    {{ props.name }}
                </div>
                <div
                    class="text-xs font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl text-center"
                >
                    {{ props.job }}
                </div>
                <br />
                <p
                    class="text-gray-600 dark:text-gray-300 text-justify whitespace-wrap"
                >
                    {{ props.description }}
                </p>
                <div class="flex flex-row items-center justify-center">
                    <div v-for="(social, index) in props.socials">
                        <UButton
                            :key="props.name + social.name + index"
                            :aria-label="`${social.name}`"
                            :icon="`${social.icon}`"
                            size="lg"
                            :to="social.link"
                            variant="ghost"
                        />
                    </div>
                </div>
            </div>
        </div>
    </UCard>
</template>

<style scoped></style>
