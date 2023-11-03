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
import { IIntegrationList } from "~/types/IIntegrationList";

const props = withDefaults(defineProps<IIntegrationList>(), {
    title: "",
    description: "",
    icon: "",
    alt: "",
});
</script>

<template>
    <UCard class="h-full">
        <div class="my-4">
            <NuxtImg
                :src="icon"
                class="w-10 h-10 mx-auto text-primary"
                :alt="alt"
            />
        </div>
        <span class="text-4xl text-center font-bold text-primary">{{
            title
        }}</span>

        <p
            class="mt-2 text-lg text-center tracking-tight text-gray-600 dark:text-gray-300"
        >
            {{ description }}
        </p>
    </UCard>
</template>
