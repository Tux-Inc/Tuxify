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
                        Get more than an <span class="text-primary">automation</span> tool
                    </h1>
                    <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                        Tuxify is a platform that helps you to automate your business processes and workflows, so you can focus on what really matters.
                    </p>
                    <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                        <UButton icon="i-heroicons-rocket-launch" size="lg" to="/sign-in" color="primary" variant="solid">Get started</UButton>
                        <UButton icon="i-mdi-github" size="lg" to="https://github.com/tux-inc/" target="_blank" color="white" variant="solid">View on GitHub</UButton>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-24 sm:py-32">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl text-center">
                    Everything you need to automate your business processes and workflows <span class="text-primary">in one place</span>
                </h2>
            </div>
        </div>
    </div>
</template>
