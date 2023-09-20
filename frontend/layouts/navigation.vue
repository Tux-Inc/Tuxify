<script setup lang="ts">
</script>

<template>
    <Navbar />
    <div class="flex flex-row items-start justify-start gap-2 overflow-hidden">
        <Sidebar />
        <slot />
    </div>
</template>