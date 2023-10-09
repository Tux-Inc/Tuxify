<script setup lang="ts">

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
});

</script>

<template>
    <header
        class="fixed w-screen top-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-base-light/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur">
        <div
            class="flex items-center justify-center min-h-[--mobile-menu-height] max-h-[--mobile-menu-height] px-4 bg-light dark:bg-dark">
            <h1 class="text-4xl font-bold text-dark dark:text-light">
                {{ props.title }}
            </h1>
        </div>
    </header>
</template>
