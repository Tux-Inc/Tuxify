<script setup>
</script>

<template>
    <aside class="rounded-lg bg-base-light dark:bg-gray-800 p-4 flex flex-col gap-4 m-2 absolute z-10 bg-opacity-90 dark:bg-opacity-90">
        <div class="text-dark dark:text-light font-bold text-xl">Available services</div>
        <UInput icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." size="sm" color="white" :trailing="false" />
        <div class="flex flex-col gap-2 w-full h-full">
            <NodeListElement />
            <NodeListElement />
            <NodeListElement />
        </div>
    </aside>
</template>
