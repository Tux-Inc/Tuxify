<script setup lang="ts">
definePageMeta({
    layout: 'navigation',
})
</script>

<template>
  <div>
    <div class="flex items-center justify-start gap-4 mb-16">
      <h1 class="text-3xl font-bold text-dark dark:text-light">Design System - Components</h1>
    </div>
    <div class="flex flex-col">
        <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">Buttons</h2>
        <div class="flex flex-col gap-2">
          <UButton>Button</UButton>
          <UButton loading>Button</UButton>
          <UButton icon="i-heroicons-pencil-square" size="sm" color="primary" variant="solid" label="Button" :trailing="false" />
          <UButton color="white" variant="solid">Button</UButton>
          <UButton color="gray" variant="solid">Button</UButton>
          <UButtonGroup size="sm" orientation="horizontal">
              <UButton label="Action" color="white" />
              <UButton icon="i-heroicons-chevron-down-20-solid" color="gray" />
          </UButtonGroup>
          <UButton label="Button" color="gray">
              <template #leading>
                  <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="3xs" />
              </template>
          </UButton>
          <UButton label="Button" color="gray">
              <template #trailing>
                  <UIcon name="i-heroicons-arrow-right-20-solid" />
              </template>
          </UButton>
        </div>
    </div>
    <div class="flex flex-col mt-24">
        <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">Links</h2>
        <div class="flex flex-col gap-2">
            <UButton to="http://tuxify.fr" target="_blank" variant="ghost">Link</UButton>
        </div>
    </div>
    <div class="flex flex-col mt-24">
        <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">Navbar</h2>
        <div class="flex flex-col gap-2">
            <Navbar></Navbar>
        </div>
    </div>
    <div class="flex flex-col mt-24">
        <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">Sidebar</h2>
        <div class="flex flex-col gap-2">
            <Sidebar></Sidebar>
        </div>
    </div>
  </div>
</template>

