<!--
File Name: UserPreferences.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for user preferences

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useColorMode } from "@vueuse/core";
import { ISelectOptionsProps, ISelectProps } from "~/types/ISelectProps";

const i18n = useI18n();
const colorMode = useColorMode();
const isDark = computed({
    get: () => colorMode.value === "dark",
    set: (value) => (colorMode.value = value ? "dark" : "light"),
});

const localesItems: ISelectOptionsProps[][] = [];
let availableLocales = computed(() => i18n.availableLocales);

for (const locale of availableLocales.value) {
    localesItems.push([
        {
            name: locale,
            label: i18n.t(`locales.${locale}`),
            value: locale,
            icon: "i-heroicons-globe-alt",
            click: () => (i18n.locale.value = locale),
        },
    ]);
}

const languagesSelector = ref<ISelectProps>({
    label: "Language",
    name: "language",
    id: "language",
    options: localesItems.flat(),
    "option-attribute": "label",
});

const languageSelected = ref<ISelectOptionsProps>(
    languagesSelector.value.options.find(
        (option) => option.value === i18n.locale.value,
    ) ?? languagesSelector.value.options[0],
);

const themesSelector = ref<ISelectProps>({
    label: "Theme",
    name: "theme",
    id: "theme",
    options: [
        {
            name: "Dark",
            label: "Dark",
            value: "dark",
            icon: "i-heroicons-moon",
            click: () => (isDark.value = true),
        },
        {
            name: "Light",
            label: "Light",
            value: "light",
            icon: "i-heroicons-sun",
            click: () => (isDark.value = false),
        },
    ],
    "option-attribute": "name",
});

const themeSelected = ref<ISelectOptionsProps>(
    themesSelector.value.options.find(
        (option) => option.value === colorMode.value,
    ) ?? themesSelector.value.options[0],
);
</script>

<template>
    <span class="text-dark dark:text-light font-bold text-2xl">
        {{ i18n.t("app.settings.preferences.title") }}
    </span>
    <p class="text-sm leading-6 text-gray-600">
        {{ i18n.t("app.settings.preferences.description") }}
    </p>
    <div class="md:grid md:grid-cols-2 gap-8">
        <!-- {{ languageSelected }} -->
        <USelect
            @click="
                () => {
                    console.log('click');
                    if (languageSelected.click) languageSelected.click();
                }
            "
            :v-model="languageSelected"
            :options="languagesSelector.options"
            :option-attribute="languagesSelector['option-attribute']"
        />
        <div class="grid-cols-2 mt-5 md:mt-0">
            <UButton
                v-for="(theme, index) in themesSelector.options"
                class="w-1/2"
                @click="
                    () => {
                        themeSelected = theme;
                        if (theme.click) theme.click();
                    }
                "
                :key="theme.name + index"
                :label="theme.name"
                :color="
                    themeSelected.value === theme.value ? 'gray' : 'primary'
                "
            />
        </div>
    </div>
</template>

<style scoped></style>
