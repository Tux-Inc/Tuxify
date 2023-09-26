<script setup lang="ts">
import {useI18n} from "vue-i18n";

definePageMeta({
    layout: 'navigation',
})

const i18n = useI18n()
</script>

<template>
    <div>
        <div class="py-24 sm:py-32 md:py-40 relative mb-[calc(var(--header-height)*2)]">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <div class="relative z-[1] text-center">
                    <h1 class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl" v-html="i18n.t('landing.home.hero.title')" />
                    <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                        {{ i18n.t('landing.home.hero.description') }}
                    </p>
                    <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                        <UButton icon="i-heroicons-rocket-launch" size="lg" to="/sign-in" color="primary" variant="solid">{{ i18n.t('landing.home.hero.getStarted') }}</UButton>
                        <UButton icon="i-mdi-github" size="lg" to="https://github.com/tux-inc/Tuxify" target="_blank" color="white" variant="solid">{{ i18n.t('landing.home.hero.viewOnGitHub') }}</UButton>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-24 sm:py-32">
            <UContainer>
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl text-center">
                    Everything you need to automate your business processes and workflows <span class="text-primary">in one place</span>
                </h2>
            </UContainer>
        </div>
    </div>
</template>
