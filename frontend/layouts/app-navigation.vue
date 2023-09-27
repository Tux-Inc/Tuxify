<script setup lang="ts">
</script>

<template>
    <div class="antialiased min-h-screen bg-base-light dark:bg-base-dark">
        <div class="md:hidden">
            <slot />
            <MobileNavigator />
        </div>
        <div class="hidden md:block">
            <AppNavbar />
            <div class="flex flex-row items-start justify-start">
                <AppSidebar />
                <div class="w-full h-full overflow-y-auto py-2 ml-[--sidebar-width] mt-[--header-height]">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>