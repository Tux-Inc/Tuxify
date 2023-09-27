<script setup lang="ts">
</script>

<template>
    <div class="antialiased relative min-h-screen bg-base-light dark:bg-base-dark">
        <img src="/hero.webp" alt="hero" class="dark:hidden inset-0 w-screen h-[20rem] left-0 overflow-hidden absolute object-fit"/>
        <img src="/hero-dark.webp" alt="hero" class="hidden dark:block inset-0 w-screen h-[20rem] left-0 overflow-hidden absolute object-fit"/>
        <Navbar />
        <div class="min-h-[calc(100vh-var(--header-height))] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <slot />
        </div>
        <Footer />
    </div>
</template>