<script setup lang="ts">
import { IBlockFullProps } from "~/types/IBlockFullProps";
import { randomUUID } from "uncrypto";

const isAvailableListOpen = ref(false);
const availableListType = ref<"action" | "reaction">("action");

const flowBlocks = ref<IBlockFullProps[]>([]);

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