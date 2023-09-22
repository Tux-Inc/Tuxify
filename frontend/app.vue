<script setup lang="ts">
definePageMeta({
    layout: 'navigation',
})
</script>

<template>
  <div class="min-h-screen custom-bg md:p-2">
    <div class="h-full md:rounded-lg md:p-2 bg-light dark:bg-dark shadow-lg backdrop-blur-lg backdrop-filter bg-opacity-30 dark:bg-opacity-30 md:border md:border-dark md:dark:border-light md:border-opacity-3 md:dark:border-opacity-30">
      <NuxtLayout name="navigation">
          <div class="md:rounded-lg flex flex-col min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] md:max-h-[calc(100vh-85px)] md:min-h-[calc(100vh-85px)] overflow-y-auto w-full h-screen px-4 pb-4 pt-14 md:p-12 bg-light dark:bg-dark backdrop-blur-lg backdrop-filter bg-opacity-60 dark:bg-opacity-60">
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