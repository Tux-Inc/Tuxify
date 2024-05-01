<!--
File Name: HomeCard.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for home card

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
import { IFlow } from "~/types/IFlow";

const props = defineProps({
    flow: {
        type: Object as PropType<IFlow>,
        required: true,
    },
});

async function redirectToFlow() {
    navigateTo(`/app/flows/${props.flow._id}`);
}
</script>

<template>
    <div
        @click.prevent="redirectToFlow"
        class="flex justify-between items-center bg-white dark:bg-transparent p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
    >
        <div class="flex flex-col gap-1 w-full">
            <div class="flex justify-center gap-2 items-center">
                <span
                    class="text-2xl font-bold text-ellipsis overflow-hidden line-clamp-1"
                >
                    {{ flow.name }}
                </span>
                <UTooltip v-if="flow.enabled" text="Flow enabled">
                    <UIcon
                        name="i-heroicons-check-circle-solid"
                        class="text-green-500 dark:text-green-400"
                    />
                </UTooltip>
                <UTooltip v-else text="Flow disabled">
                    <UIcon
                        name="i-heroicons-x-circle-solid"
                        class="text-red-500 dark:text-red-400"
                    />
                </UTooltip>
            </div>
            <div class="flex justify-center">
                <span
                    class="text-ellipsis overflow-hidden line-clamp-1 text-gray-500 dark:text-gray-400"
                >
                    {{ flow.description ? flow.description : "No description" }}
                </span>
            </div>
        </div>
    </div>
</template>
