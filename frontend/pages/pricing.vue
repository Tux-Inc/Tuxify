<script setup lang="ts">
import {useI18n} from "vue-i18n";

definePageMeta({
    layout: 'navigation',
})

const i18n = useI18n()
</script>

<template>
    <div>
        <UContainer>
            <div class="py-24 sm:py-32 md:py-40 relative mb-[calc(var(--header-height)*2)]">
                <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div class="relative z-[1] text-center">
                        <h1 class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl" v-html="i18n.t('landing.pricing.hero.title')" />
                        <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                            {{ i18n.t('landing.pricing.hero.description') }}
                        </p>
                        <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                            <UCard class="h-full">
                                <span class="text-4xl font-bold text-primary">{{ i18n.t('landing.pricing.hero.free.title') }}</span>
                                <p class="mt-2 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                                    {{ i18n.t('landing.pricing.hero.free.description') }}
                                </p>
                                <div v-for="feature in (i18n.tm<string>('landing.pricing.hero.free.features'))" class="mt-2 flex items-center gap-x-2">
                                    <UIcon name="i-heroicons-check-circle" size="md" color="primary" />
                                    <span class="text-gray-600 dark:text-gray-300" v-html="feature" />
                                </div>
                                <div class="mt-6 flex items-center justify-center">
                                    <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">${{i18n.t('landing.pricing.hero.free.price')}}</span>
                                    <span class="ml-1 text-xl text-gray-600 dark:text-gray-300">/mo</span>
                                </div>
                                <div class="mt-6 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                                    <UButton icon="i-heroicons-rocket-launch" size="lg" to="/sign-in" color="primary" variant="solid">{{ i18n.t('landing.pricing.hero.free.button') }}</UButton>
                                </div>
                            </UCard>
                            <UCard class="h-full">
                                <span class="text-4xl font-bold text-primary">{{ i18n.t('landing.pricing.hero.pro.title') }}</span>
                                <p class="mt-2 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                                    {{ i18n.t('landing.pricing.hero.pro.description') }}
                                </p>
                                <div v-for="feature in (i18n.tm<string>('landing.pricing.hero.pro.features'))" class="mt-2 flex items-center gap-x-2">
                                    <UIcon name="i-heroicons-check-circle" size="md" color="primary" />
                                    <span class="text-gray-600 dark:text-gray-300" v-html="feature" />
                                </div>
                                <div class="mt-6 flex items-center justify-center">
                                    <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">${{i18n.t('landing.pricing.hero.pro.price')}}</span>
                                    <span class="ml-1 text-xl text-gray-600 dark:text-gray-300">/mo</span>
                                </div>
                                <div class="mt-6 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                                    <UButton icon="i-heroicons-rocket-launch" size="lg" to="/sign-in" color="primary" variant="solid">{{ i18n.t('landing.pricing.hero.pro.button') }}</UButton>
                                </div>
                            </UCard>
                            <UCard class="h-full">
                                <span class="text-4xl font-bold text-primary">{{ i18n.t('landing.pricing.hero.enterprise.title') }}</span>
                                <p class="mt-2 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                                    {{ i18n.t('landing.pricing.hero.enterprise.description') }}
                                </p>
                                <div v-for="feature in (i18n.tm<string>('landing.pricing.hero.enterprise.features'))" class="mt-2 flex items-center gap-x-2">
                                    <UIcon name="i-heroicons-check-circle" size="md" color="primary" />
                                    <span class="text-gray-600 dark:text-gray-300" v-html="feature" />
                                </div>
                                <div class="mt-6 flex items-center justify-center">
                                    <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">${{i18n.t('landing.pricing.hero.enterprise.price')}}</span>
                                    <span class="ml-1 text-xl text-gray-600 dark:text-gray-300">/mo</span>
                                </div>
                                <div class="mt-6 flex flex-wrap gap-x-6 gap-y-3 justify-center">
                                    <UButton icon="i-heroicons-phone" size="lg" to="/about-us" color="primary" variant="solid">{{ i18n.t('landing.pricing.hero.enterprise.button') }}</UButton>
                                </div>
                            </UCard>
                        </div>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>
