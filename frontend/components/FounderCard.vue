<script setup lang="ts">
import { IFounderCardProps, ISocialProps } from "~/types/IFounderCardProps";
import { PropType } from "@vue/runtime-core";

const props = withDefaults(defineProps<IFounderCardProps>(), {
    image: "",
    alt: "",
    name: "",
    job: "",
    description: "",
    socials: {
        type: Array as PropType<ISocialProps[]>,
        default: () => [],
    },
});

</script>

<template>
    <UCard class="flex flex-col">
        <div class="md:flex md:flex-row gap-4 md:flex-nowrap items-center justify-start">
            <img class="rounded-md mx-auto" :src="props.image" :alt="props.alt" width="250" height="250" />
            <div>
                <br />
                <div
                    class="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl text-center">
                    {{ props.name }}
                </div>
                <div
                    class="text-xs font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl text-center">
                    {{ props.job }}
                </div>
                <br />
                <p class="text-gray-600 dark:text-gray-300 text-justify whitespace-wrap">
                    {{ props.description }}
                </p>
                <div class="flex flex-row items-center justify-center">
                    <div v-for="(social, index) in props.socials">
                        <UButton
                            :key="props.name + social.name + index"
                            :icon="`${social.icon}`"
                            size="lg"
                            :to="social.link"
                            color="grey"
                            variant="ghost"
                        />
                    </div>
                </div>
            </div>
        </div>
    </UCard>
</template>

<style scoped></style>
