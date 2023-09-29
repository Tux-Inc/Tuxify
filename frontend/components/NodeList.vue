<script setup lang="ts">
import { INodeType } from "~/types/INodeType";

defineProps({
    nodeTypes: {
        type: Array as PropType<INodeType[]>,
        required: true
    }
})
</script>

<template>
    <aside class="rounded-lg bg-white dark:bg-gray-800 p-4 flex flex-col gap-4 m-2 absolute z-10 bg-opacity-90 dark:bg-opacity-90">
        <div class="text-dark dark:text-light font-bold text-xl">Available nodes</div>
        <UInput icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." size="sm" color="white" :trailing="false" />
        <div class="flex flex-col gap-2">
            <NodeListElement v-for="nodeType in nodeTypes" :key="nodeType.name" :nodeType="nodeType" />
        </div>
    </aside>
</template>
