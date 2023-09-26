<script setup lang="ts">
const menus = [
    {
        name: 'Home',
        icon: 'bx bx-home',
        path: '/app',
    },
    {
        name: 'Flows',
        icon: 'bx bx-link',
        path: '/app/flow',
    },
    {
        name: 'Components',
        icon: 'bx bx-cog',
        path: '/components',
    },
    {
        name: 'Settings',
        icon: 'bx bx-cog',
        path: '/app/settings',
    },
]
</script>

<template>
    <header class="sticky bottom-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-base-light/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur">
        <div class="flex items-start justify-between min-h-[80px] max-h-[80px] px-4 bg-light dark:bg-dark">
            <MobileNavigationButton v-for="menu in menus" :key="menu.name" :text="menu.name" :icon="menu.icon" :onClick="() => navigateTo(menu.path)"></MobileNavigationButton>
        </div>
    </header>
</template>