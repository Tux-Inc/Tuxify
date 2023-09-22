<script setup lang="ts">
definePageMeta({
    layout: 'navigation',
})
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
    <NuxtLayout name="navigation">
        <div class="md:rounded-lg flex flex-col min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] md:max-h-[calc(100vh-85px)] md:min-h-[calc(100vh-85px)] overflow-y-auto w-full h-screen px-4 pb-4 pt-14 md:p-12 bg-light dark:bg-dark backdrop-blur-lg backdrop-filter bg-opacity-60 dark:bg-opacity-60">
          <NuxtPage />
        </div>
    </NuxtLayout>
  </NuxtLayout>
</template>

