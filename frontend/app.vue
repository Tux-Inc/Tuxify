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
      <main>
        <NuxtLoadingIndicator />
        <NuxtPage />
      </main>
      <UNotifications />
  </NuxtLayout>
</template>

