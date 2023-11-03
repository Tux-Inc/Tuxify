<!--
File Name: Full.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This component is the full block

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
import { IBlockFullProps } from "~/types/IBlockFullProps";
import { PropType } from "@vue/runtime-core";

const props = defineProps({
    currentBlock: {
        type: Object as PropType<IBlockFullProps>,
        required: true,
    },
    flowBlocks: {
        type: Array as PropType<IBlockFullProps[]>,
        required: true,
    },
});

const isValid = ref(true);
const emit = defineEmits<{
    (e: "flow-remove-block", uuid: string): void;
}>();

const localInputs = ref([...props.currentBlock.inputs]);

watch(
    () => localInputs.value,
    (newVal) => {
        for (let i = 0; i < newVal.length; i++) {
            props.currentBlock.inputs[i].value = newVal[i].value;
        }
        isValid.value = validate();
    },
    { deep: true },
);

function validate() {
    if (props.currentBlock.inputs) {
        for (const input of props.currentBlock.inputs) {
            if (!input.value && input.required) {
                return false;
            }
        }
    }
    return true;
}

const contextualItems = [
    [
        {
            label: "Delete",
            icon: "i-heroicons-trash",
            click: async () => {
                if (props.currentBlock.uuid != null) {
                    emit("flow-remove-block", props.currentBlock.uuid);
                }
            },
        },
    ],
];
</script>

<template>
    <div
        class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-lg p-4"
    >
        <div class="flex justify-between flex-wrap md:flex-nowrap">
            <div class="flex gap-2 items-center justify-start">
                <UTooltip :text="props.currentBlock.service.title">
                    <img
                        :src="props.currentBlock.service.image"
                        class="w-5 h-5 mx-auto text-primary"
                        alt="icon"
                    />
                </UTooltip>
                <span class="text-2xl font-bold text-dark dark:text-light">{{
                    props.currentBlock.title
                }}</span>
            </div>
            <div class="flex items-center gap-2">
                <div v-if="!isValid">
                    <UTooltip
                        text="Invalid block check required inputs and types"
                    >
                        <UIcon
                            name="i-heroicons-exclamation-circle"
                            class="text-red-500"
                        />
                    </UTooltip>
                </div>
                <UDropdown
                    :items="contextualItems"
                    :popper="{ placement: 'bottom-start' }"
                >
                    <UButton
                        size="md"
                        color="white"
                        trailing-icon="i-heroicons-ellipsis-vertical"
                    />
                </UDropdown>
            </div>
        </div>
        <div class="flex flex-col">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{
                props.currentBlock.name
            }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{
                props.currentBlock.uuid
            }}</span>
        </div>
        <div class="flex flex-col gap-2 mt-4">
            <span class="text-dark dark:text-light">{{
                props.currentBlock.description
            }}</span>
            <div
                v-for="(input, index) in localInputs"
                class="flex flex-col gap-2"
            >
                <label class="text-dark dark:text-light">{{
                    input.title
                }}</label>
                <AppFlowBlockAutocompleteInput
                    :input="input"
                    :current-block="props.currentBlock"
                    :flow-blocks="props.flowBlocks"
                    @flow-block-autocomplete="localInputs[index].value = $event"
                />
            </div>
        </div>
    </div>
</template>
