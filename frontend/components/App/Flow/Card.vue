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
        <div class="flex flex-col gap-2">
            <span class="text-2xl font-bold">{{ flow.name }}</span>
            <span class="text-center truncate">{{ flow.description }}</span>
        </div>
        <div>
            <UIcon name="i-heroicons-chevron-right" class="text-gray-500 dark:text-gray-400 text-2xl" />
        </div>
    </div>
</template>