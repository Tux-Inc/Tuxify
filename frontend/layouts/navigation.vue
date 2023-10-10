<script setup lang="ts">
import BurgerMenu from "~/components/App/AppBurgerMenu.vue";

const isOpen = ref(false);

const setOpened = () => isOpen.value = !isOpen.value;

</script>

<template>
    <div class="antialiased relative min-h-screen bg-base-light dark:bg-base-dark">
        <img src="/hero.webp" alt="hero"
             class="dark:hidden sm:w-screen md:w-[calc(100vh-var(--header-weight))] md:mx-auto inset-0 h-[20rem] left-0 overflow-hidden absolute object-fit" />
        <img src="/hero-dark.webp" alt="hero"
             class="hidden dark:block sm:w-screen md:w-[calc(100vh-var(--header-weight))] md:mx-auto inset-0 h-[20rem] left-0 overflow-hidden absolute object-fit" />
        <div class="hidden md:block">
            <Navbar :isOpen="isOpen" @setOpened="setOpened" />
        </div>
        <div class="md:hidden">
            <BurgerMenu :isOpen="isOpen" @setOpened="setOpened" />
        </div>
        <div class="min-h-[calc(100vh-var(--header-height))] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <slot />
        </div>
        <Footer />
    </div>
</template>
