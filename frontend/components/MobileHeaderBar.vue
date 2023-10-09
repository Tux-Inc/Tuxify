<script setup lang="ts">
const menus = [
    {
        name: "Home",
        icon: "bx bx-home",
        path: "/app",
    },
    {
        name: "Flows",
        icon: "bx bx-link",
        path: "/app/flows",
    },
    {
        name: "Services",
        icon: "bx bx-server",
        path: "/app/services",
    },
    {
        name: "Settings",
        icon: "bx bx-cog",
        path: "/app/settings",
    },
];
</script>

<template>
    <header
        class="fixed w-screen top-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-base-light/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur">
        <div
            class="flex items-center justify-center min-h-[--mobile-menu-height] max-h-[--mobile-menu-height] px-4 bg-light dark:bg-dark">
            <h1 class="text-4xl font-bold text-dark dark:text-light">
                Services
            </h1>
        </div>
    </header>
</template>
