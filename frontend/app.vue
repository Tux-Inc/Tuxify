<template>
  <div class="bg-light dark:bg-dark min-h-screen">
    <NuxtLayout name="navigation">
        <div class="flex flex-col max-h-[calc(100vh-52px)] overflow-y-auto w-full h-full p-12">
          <NuxtPage />
        </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'navigation',
})
</script>