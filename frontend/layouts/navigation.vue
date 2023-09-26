<script setup lang="ts">
</script>

<template>
    <div class="antialiased w-screen min-h-screen bg-base-light dark:bg-base-dark">
        <div class="md:hidden">
            <slot />
            <MobileNavigator />
        </div>
        <div class="hidden md:block">
            <Navbar />
            <slot />
        </div>
    </div>
</template>