<script setup lang="ts">
</script>

<template>
    <div class="antialiased w-screen min-h-screen bg-base-light dark:bg-base-dark">
        <div class="md:hidden">
            <slot />
            <MobileNavigator />
        </div>
        <div class="hidden md:block">
            <AppNavbar />
            <div class="flex flex-row items-start justify-start">
                <AppSidebar />
                <div class="w-full h-full overflow-y-auto">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>