<script setup lang="ts">
definePageMeta({
    layout: 'navigation',
})
</script>

<template>
    <div>
        <div class="py-24 sm:py-32 md:py-40 relative mb-[calc(var(--header-height)*2)]">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div class="relative z-[1] text-center">
                    <h1 class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl">
                        Welcome to <span class="text-primary">Tuxify</span>
                    </h1>
                    <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                        Tuxify is a full-stack boilerplate for Nuxt.js and Nest.js. It's built with Tailwind CSS and TypeScript.
                    </p>
                    <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                        <UButton icon="i-heroicons-rocket-launch" size="lg" to="/sign-in" color="primary" variant="solid">Get started</UButton>
                        <UButton icon="i-heroicons-document-text" size="lg" to="/docs" color="white" variant="solid">Documentation</UButton>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-24 sm:py-32">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                test
            </div>
        </div>
    </div>
</template>
