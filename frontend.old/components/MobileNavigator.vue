<!--
File Name: MobileNavigator.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the mobile navigator component

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

<script setup lang="ts">
const menus = [
    {
        name: "Home",
        icon: "i-heroicons-home",
        path: "/app",
    },
    {
        name: "Flows",
        icon: "i-heroicons-link",
        path: "/app/flows",
    },
    {
        name: "Services",
        icon: "i-heroicons-server",
        path: "/app/services",
    },
    {
        name: "Settings",
        icon: "i-heroicons-cog",
        path: "/app/settings",
    },
];
</script>

<template>
    <header
        class="fixed w-screen bottom-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-gray-50/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur"
    >
        <div
            class="flex items-start justify-between min-h-[--mobile-menu-height] max-h-[--mobile-menu-height] py-2 px-4 bg-light dark:bg-dark"
        >
            <MobileNavigationButton
                v-for="menu in menus"
                :key="menu.name"
                :text="menu.name"
                :icon="menu.icon"
                :onClick="() => navigateTo(menu.path)"
            ></MobileNavigationButton>
        </div>
    </header>
</template>
