<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useColorMode } from "@vueuse/core";
import { ILanguageSelectProps } from "~/types/ILanguageSelectProps";

const colorMode = useColorMode();

const isDark = computed({
    get: () => colorMode.value === "dark",
    set: (value) => colorMode.value = value ? "dark" : "light",
});

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits<{
    (e: "setOpened"): void
}>();

const i18n = useI18n();
let availableLocales = computed(() => i18n.availableLocales);

const localesItems: ILanguageSelectProps[][] = [];

for (const locale of availableLocales.value) {
    localesItems.push([{
        label: i18n.t(`locales.${locale}`),
        icon: "i-heroicons-globe-alt",
        click: () => i18n.locale.value = locale,
    }]);
}
</script>

<template>
    <header
        class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-base-light/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur">
        <div class="flex items-center gap-3 h-[--header-height] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div class="flex gap-4">
                <UButton
                    aria-label="Menu"
                    color="gray"
                    icon="i-heroicons-bars-4-20-solid"
                    variant="ghost"
                    @click="emit('setOpened')"
                />
                <ClientOnly>
                    <UButton
                        :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                        aria-label="Theme"
                        color="gray"
                        variant="ghost"
                        @click="isDark = !isDark"
                    />
                </ClientOnly>
            </div>
            <NuxtLink class="mx-auto" to="/">
                <svg class="h-8 fill-primary dark:fill-base-light" viewBox="0 0 600 782" aria-label="TuxifyLogo"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M198.863 302.876C164.945 208.09 49.406 202.205 0 208.09C11.8797 194.451 47.4614 175.075 82.2401 142.113C111.209 114.658 137.202 75.4932 170.985 43.61C222.095 0.86487 272.275 -2.19441 308.981 0.864822C370.313 5.97645 469.279 31.9951 469.279 147.224C464.633 302.876 377.747 351.727 353.586 426.468C329.425 501.209 353.586 554.307 353.586 554.307C353.586 554.307 357.767 473.991 422.816 450.229C487.865 426.468 541.298 366.131 541.298 366.131C564.065 506.915 436.526 516.607 400.514 652.28C380.535 727.55 431.18 781.554 422.816 778.195C198.863 688.258 243.932 466.891 252.76 426.468C267.981 356.773 389.363 88.115 222.095 90.0737C164.599 90.7469 131.956 113.77 136.602 152.334C141.248 190.899 185.573 211.66 198.863 242.473C214.695 279.179 198.863 302.876 198.863 302.876Z" />
                </svg>
            </NuxtLink>
            <div class="flex gap-2">
                <ClientOnly>
                    <UDropdown :items="localesItems" :popper="{ placement: 'bottom-start' }"
                               :ui="{ item: { disabled: 'cursor-text select-text' } }"
                               class="ml-2.5">
                        <UButton
                            aria-label="Language"
                            color="gray"
                            icon="i-heroicons-language"
                            variant="ghost"
                        />
                    </UDropdown>
                </ClientOnly>
                <UButton
                    :aria-label="i18n.t('auth.signIn')"
                    color="primary"
                    icon="i-heroicons-arrow-right-on-rectangle"
                    to="/auth/sign-in"
                    variant="solid"
                />
            </div>
        </div>
    </header>
    <transition
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-[-100%]"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="duration-300 ease-out"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-[-100%]"
    >
        <div v-show="props.isOpen" class="absolute w-full z-40 bg-base-light dark:bg-base-dark inset-0 overflow-hidden">
            <div class="overflow-y-auto relative py-24 grid grid-cols-1 px-8 justify-center items-center center">
                <UButton
                    class="my-5 justify-center" color="gray" icon="i-heroicons-home" size="xl" to="/"
                    :label="i18n.t('landing.navbar.home')"
                    variant="ghost"
                    @click="emit('setOpened')" />
                <UButton :label="i18n.t('landing.navbar.pricing')" class="my-3 justify-center" color="gray"
                         icon="i-heroicons-currency-dollar" size="xl"
                         to="/pricing"
                         variant="ghost"
                         @click="emit('setOpened')" />
                <UButton :label="i18n.t('landing.navbar.aboutUs')" class="my-3 justify-center" color="gray"
                         icon="i-heroicons-question-mark-circle" size="xl"
                         to="/about-us"
                         variant="ghost"
                         @click="emit('setOpened')" />
                <UButton :label="i18n.t('landing.navbar.changelog')" class="my-3 justify-center" color="gray"
                         icon="i-heroicons-book-open"
                         size="xl" to="https://github.com/tux-inc/Tuxify/releases"
                         variant="ghost"
                         @click="emit('setOpened')" />
                <UButton :label="i18n.t('landing.navbar.documentation')" class="my-3 justify-center" color="gray"
                         icon="i-heroicons-information-circle"
                         size="xl" to="https://github.com/tux-inc/Tuxify/wiki"
                         variant="ghost"
                         @click="emit('setOpened')" />
                <UButton :label="i18n.t('landing.navbar.integration')" class="my-3 justify-center" color="gray"
                         icon="i-heroicons-bars-4-20-solid" size="xl"
                         to="/integration"
                         variant="ghost"
                         @click="emit('setOpened')" />
                <UButton :label="i18n.t('landing.navbar.contact')" class="my-3 justify-center" color="gray"
                         icon="i-heroicons-user" size="xl"
                         to="/contact"
                         variant="ghost"
                         @click="emit('setOpened')" />
            </div>
            <Footer class="mt-auto" />
        </div>
    </transition>
</template>

<style scoped>

</style>
