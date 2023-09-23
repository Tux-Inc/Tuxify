<script setup lang="ts">
const topMenus = [
    {
        name: 'Home',
        icon: 'bx bx-home',
        path: '/',
    },
    {
        name: 'Flows',
        icon: 'bx bx-link',
        path: '/flow',
    },
    {
        name: 'Components',
        icon: 'bx bx-cog',
        path: '/components',
    },
]
const bottomMenus = [
    {
        name: 'Settings',
        icon: 'bx bx-cog',
        path: '/settings',
    },
]
const topButtons = [
    {
        name: 'New flow',
        icon: 'bx bx-plus',
        path: '/flow',
    },
]
</script>

<template>
  <div class="flex flex-col items-start justify-between min-h-[calc(100vh-85px)] px-2 py-4">
    <div class="flex flex-col items-start justify-center gap-4 w-full">
        <div v-for="menu in topButtons" :key="menu.name" class="w-full">
            <Button type="primary" custom-class="w-full" :text="menu.name" :icon="menu.icon" :onClick="() => navigateTo(menu.path)"></Button>
        </div>
        <div v-for="menu in topMenus" :key="menu.name" class="w-full">
            <ButtonLink custom-class="w-full" :text="menu.name" :icon="menu.icon" :onClick="() => navigateTo(menu.path)"></ButtonLink>
        </div>
    </div>
    <div class="flex flex-col items-start justify-center gap-4 w-full">
        <div v-for="menu in bottomMenus" :key="menu.name" class="w-full">
            <ButtonLink custom-class="w-full" :text="menu.name" :icon="menu.icon" :onClick="() => navigateTo(menu.path)"></ButtonLink>
        </div>
    </div>
  </div>
</template>