<!--
File Name: AccountSettings.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for account settings

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
import { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const i18n = useI18n();

const state = ref({
    name: "",
    email: "",
    password: "",
});

const validate = (state: any): FormError[] => {
    const errors = [];
    if (!state.name) errors.push({ path: "name", message: "Required" });
    if (!state.email) errors.push({ path: "email", message: "Required" });
    if (!state.phone) errors.push({ path: "phone", message: "Required" });
    if (!state.reason) errors.push({ path: "reason", message: "Required" });
    return errors;
};

async function submit(event: FormSubmitEvent<any>) {
    // Do something with data
    console.log(event.data);
}
</script>

<template>
    <UForm :validate="validate" :state="state" @submit="submit">
        <span class="text-dark dark:text-light font-bold text-2xl">
            {{ i18n.t("app.settings.account.title") }}
        </span>
        <p class="text-sm leading-6 text-gray-600">
            Customize your user informations.
        </p>
        <div class="grid md:grid-cols-4 sm:grid-cols-1 gap-8">
            <UFormGroup
                class="md:col-start-2 md:col-span-1"
                :label="i18n.t('app.settings.account.title')"
            >
                <UInput
                    v-model="state.name"
                    :placeholder="
                        i18n.t('app.settings.account.placeholders.name')
                    "
                />
            </UFormGroup>
            <UFormGroup
                class="md:col-start-3 md:col-span-1"
                :label="i18n.t('app.settings.account.labels.email')"
            >
                <UInput
                    v-model="state.email"
                    :placeholder="
                        i18n.t('app.settings.account.placeholders.email')
                    "
                />
            </UFormGroup>
        </div>
        <div class="mt-5 grid md:grid-cols-3 sm:grid-cols-1 gap-8">
            <UFormGroup :label="i18n.t('app.settings.account.labels.password')">
                <UInput
                    v-model="state.password"
                    :placeholder="
                        i18n.t('app.settings.account.placeholders.password')
                    "
                />
            </UFormGroup>
            <UFormGroup
                :label="i18n.t('app.settings.account.labels.newPassword')"
            >
                <UInput
                    v-model="state.password"
                    :placeholder="
                        i18n.t('app.settings.account.placeholders.newPassword')
                    "
                />
            </UFormGroup>
            <UFormGroup
                :label="
                    i18n.t('app.settings.account.labels.confirmNewPassword')
                "
            >
                <UInput
                    v-model="state.password"
                    :placeholder="
                        i18n.t(
                            'app.settings.account.placeholders.confirmNewPassword',
                        )
                    "
                />
            </UFormGroup>
        </div>
        <div class="mt-5 flex justify-center items-center text-center">
            <UButton type="button" label="Change" />
        </div>
    </UForm>
</template>

<style scoped></style>
