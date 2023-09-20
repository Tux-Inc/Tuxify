<script setup lang="ts">
definePageMeta({
    layout: 'navigation',
})
</script>

<template>
  <div class="min-h-screen custom-bg p-2">
    <div class="rounded-lg p-2 bg-light dark:bg-dark shadow-lg backdrop-blur-lg backdrop-filter bg-opacity-30 dark:bg-opacity-30 border border-dark dark:border-light border-opacity-3 dark:border-opacity-30">
      <NuxtLayout name="navigation">
          <div class="rounded-lg flex flex-col max-h-[calc(100vh-85px)] min-h-[calc(100vh-85px)] overflow-y-auto w-full h-full p-12 bg-light dark:bg-dark backdrop-blur-lg backdrop-filter bg-opacity-60 dark:bg-opacity-60">
            <NuxtPage />
          </div>
      </NuxtLayout>
    </div>
  </div>
</template>


<style scoped>
.custom-bg {
  background-image: url('/bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>

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