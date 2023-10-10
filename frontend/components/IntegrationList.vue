<script setup lang="ts">
import { IIntegrationList } from "~/types/IIntegrationList";

const props = withDefaults(defineProps<IIntegrationList>(), {
    title: "",
    description: "",
    icon: "",
});

</script>

<template>
    <UCard class="h-full">
        <div class="my-4">
            <NuxtImg :src="icon" class="w-10 h-10 mx-auto text-primary" />
        </div>
        <span class="text-4xl text-center font-bold text-primary">{{ title }}</span>

        <p class="mt-2 text-lg text-center tracking-tight text-gray-600 dark:text-gray-300">
            {{ description }}
        </p>
    </UCard>
</template>
