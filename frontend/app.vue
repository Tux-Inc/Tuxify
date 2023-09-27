<script setup lang="ts">
</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<template>
  <NuxtLayout>
      <main class="min-h-[calc(100vh-var(--header-height))] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <NuxtPage />
      </main>
      <UNotifications />
  </NuxtLayout>
</template>

