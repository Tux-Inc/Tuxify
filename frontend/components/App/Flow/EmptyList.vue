<!--
File Name: EmptyList.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for empty list

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
const { $event } = useNuxtApp();

const sendEvent = (event: string) => $event(event);
</script>
<template>
    <div
        class="flex flex-col w-full items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8"
    >
        <div class="flex flex-col items-center justify-center">
            <UIcon
                name="i-heroicons-archive-box"
                class="text-base-dark dark:text-base-light font-bold text-6xl"
            />
            <span
                class="text-base-dark dark:text-base-light font-bold text-2xl mt-2"
                >Uh oh, you don't have any flows yet!</span
            >
            <span class="text-gray-500 dark:text-gray-400 text-lg"
                >Create a new flow to get started</span
            >
        </div>
        <div class="mt-4">
            <UButton
                size="xl"
                icon="i-heroicons-plus"
                @click="sendEvent('app:newFlow')"
                color="primary"
                variant="solid"
                >New flow</UButton
            >
        </div>
    </div>
</template>
