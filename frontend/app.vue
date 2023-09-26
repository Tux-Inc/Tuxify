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

::-webkit-scrollbar {
    width: 7px;
    border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #04070A;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #0085BD;
}
::-webkit-scrollbar {
    display: none;
}
</style>

<template>
  <NuxtLayout>
      <main class="min-h-[calc(100vh-var(--header-height))] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <NuxtPage />
      </main>
  </NuxtLayout>
</template>

