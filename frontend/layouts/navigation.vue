<script setup lang="ts">
</script>

<template>
    <div class="md:hidden">
        <slot />
        <MobileNavigator />
    </div>
    <div class="hidden md:block">
        <Navbar />
        <div class="flex flex-row items-start justify-start gap-2 overflow-hidden">
            <Sidebar />
            <slot />
        </div>
    </div>
</template>