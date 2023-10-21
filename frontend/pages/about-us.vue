<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { IFounderCardProps } from "~/types/IFounderCardProps";
import { IIntegrationList } from "~/types/IIntegrationList";

definePageMeta({
    layout: "navigation",
});

const i18n = useI18n();
let founders = ref<string[]>(i18n.tm<string[]>("landing.about-us.team.members") as string[]);
onUpdated(() => {
    founders.value = i18n.tm<string[]>("landing.about-us.team.members") as string[];
});

</script>

<template>
    <div>
        <title>About-us</title>
        <div class="py-24 sm:py-32 md:py-40 relative">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-[calc(var(--header-height))]">
                <div class="relative z-[1] text-center">
                    <h1
                        class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl"
                        v-html="i18n.t('landing.about-us.hero.title')"
                    />
                    <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
                        {{ i18n.t("landing.about-us.hero.description") }}
                    </p>
                </div>
            </div>
            <div class="container mx-auto p-6 grid md:grid-cols-4 sm:grid-cols-1 gap-4">
                <FounderCard
                    v-for="(founder, index) in founders"
                    class="md:col-span-2 flex flex-col justify-center"
                    :class="`${
                        index === founders.length - 1 &&
                        founders.length % 2 !== 0
                            ? 'md:col-start-2'
                            : ''
                    }`"
                    :key="index"
                    :image="founder.image"
                    :alt="founder.alt"
                    :name="founder.name"
                    :job="founder.job"
                    :description="founder.description"
                    :socials="founder.socials"
                />
            </div>
        </div>
    </div>
</template>
