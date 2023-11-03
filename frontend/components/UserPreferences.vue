<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ILanguageSelectProps } from "~/types/ILanguageSelectProps";
import { ISelectOptionsProps, ISelectProps } from "~/types/ISelectProps";
import { useColorMode } from "@vueuse/core";

const i18n = useI18n();
const colorMode = useColorMode();
const isDark = computed({
    get: () => colorMode.value === "dark",
    set: (value) => (colorMode.value = value ? "dark" : "light"),
});
const localesItems: ILanguageSelectProps[][] = [];
let availableLocales = computed(() => i18n.availableLocales);

for (const locale of availableLocales.value) {
    localesItems.push([
        {
            label: i18n.t(`locales.${locale}`),
            icon: "i-heroicons-globe-alt",
            click: () => (i18n.locale.value = locale),
        },
    ]);
}

// const languagesSelector = ref<ISelectProps>({
//     label: "Language",
//     name: "language",
//     id: "language",
//     "option-attribute": "label",
// });

const themesSelector = ref<ISelectProps>({
    label: "Theme",
    name: "theme",
    id: "theme",
    options: [
        {
            name: "Light",
            label: "Light",
            value: "light",
            icon: "i-heroicons-sun",
            click: () => (isDark.value = false),
        },
        {
            name: "Dark",
            label: "Dark",
            value: "dark",
            icon: "i-heroicons-moon",
            click: () => (isDark.value = true),
        },
    ],
    "option-attribute": "name",
});

const themeSelected = ref<ISelectOptionsProps>(
    themesSelector.value.options.find((option) => option.value === "light"),
);
</script>

<template>
    <span class="text-dark dark:text-light font-bold text-2xl">
        {{ i18n.t("app.settings.preferences.title") }}
    </span>
    <p class="text-sm leading-6 text-gray-600">
        {{ i18n.t("app.settings.preferences.description") }}
    </p>

    <div class="sm:col-span-4">
        <USelect id="language" name="language" :options="localesItems" />
    </div>
    <div class="sm:col-span-4">
        <USelect
            :id="themesSelector.id"
            :name="themesSelector.name"
            :options="themesSelector.options"
            v-model="themeSelected.value"
            @click="themeSelected.click"
            option-attribute="name"
        />
    </div>
</template>

<style scoped></style>
