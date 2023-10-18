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
    <div @click.prevent="redirectToFlow" class="flex justify-between items-center p-4 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
        <div class="flex flex-col gap-1 w-full">
            <div class="flex gap-2 items-center">
                <span class="text-2xl font-bold text-ellipsis overflow-hidden line-clamp-1">{{ flow.name }}</span>
                <UTooltip v-if="flow.enabled" text="Flow enabled">
                    <UIcon name="i-heroicons-check-circle-solid" class="text-green-500 dark:text-green-400" />
                </UTooltip>
                <UTooltip v-else text="Flow disabled">
                    <UIcon name="i-heroicons-x-circle-solid" class="text-red-500 dark:text-red-400" />
                </UTooltip>
            </div>
            <div class="w-2/3">
                <span class="text-ellipsis overflow-hidden line-clamp-1 text-gray-500 dark:text-gray-400">{{ flow.description ? flow.description : 'No description' }}</span>
            </div>
        </div>
        <div>
            <UIcon name="i-heroicons-chevron-right" class="text-gray-500 dark:text-gray-400 text-2xl" />
        </div>
    </div>
</template>