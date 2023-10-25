<!--
File Name: Container.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This component is the container of the flow blocks

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
import { randomUUID } from "uncrypto";

const props = defineProps<{
    flowData: IBlockFullProps[];
}>();

console.log("currentFlow props", props.flowData);

const emit = defineEmits<{
    (e: "flow-update", blocks: IBlockFullProps[]): void;
}>();

const isAvailableListOpen = ref(false);
const availableListType = ref<"action" | "reaction">("action");
const flowBlocks = ref<IBlockFullProps[]>(props.flowData);


watch(
    () => flowBlocks.value.length,
    (newVal) => {
        if (newVal > 0) {
            availableListType.value = "reaction";
        } else {
            availableListType.value = "action";
        }
    }
);

watch(
    () => flowBlocks.value,
    (newVal) => {
        emit("flow-update", newVal);
    },
    { deep: true },
)

function addActionReaction(block: IBlockFullProps) {
    isAvailableListOpen.value = false;
    block.uuid = randomUUID();
    flowBlocks.value.push(block);
}

function removeActionReaction(uuid: string) {
    flowBlocks.value = flowBlocks.value.filter((block) => block.uuid !== uuid);
}
</script>

<template>
    <UModal v-model="isAvailableListOpen">
        <AppFlowBlockAvailable :type="availableListType" @flow-add-block="addActionReaction" />
    </UModal>
    <div class="flex flex-col">
        <div v-if="flowBlocks.length === 0" class="flex flex-col items-center justify-center gap-4 mt-4">
            <UIcon name="i-heroicons-cube-transparent" class="text-4xl text-primary font-bold text-dark dark:text-light" />
            <span class="text-dark dark:text-light">No blocks added yet, start by adding a trigger.</span>
            <UButton size="md" @click="isAvailableListOpen = true" color="primary" icon="i-heroicons-plus" label="Add action" />
        </div>
        <div v-else v-for="(actionReaction, index) in flowBlocks" :key="index">
            <AppFlowBlockFull
                :current-block="actionReaction"
                :flow-blocks="flowBlocks"
                @flow-remove-block="removeActionReaction"
            />
            <div v-if="index !== flowBlocks.length - 1" class="flex justify-center">
                <div class="bg-gray-300 dark:bg-gray-700 w-0.5 h-9"></div>
            </div>
            <div v-else class="flex flex-row items-center justify-center gap-4 mt-4">
                <UButton size="md" @click="isAvailableListOpen = true" color="primary" icon="i-heroicons-plus" label="Add reaction" />
            </div>
        </div>
    </div>
</template>