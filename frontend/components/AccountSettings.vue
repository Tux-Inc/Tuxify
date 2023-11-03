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
        <UFormGroup :label="i18n.t('app.settings.account.title')">
            <UInput
                v-model="state.name"
                :placeholder="i18n.t('app.settings.account.placeholders.name')"
            />
        </UFormGroup>
        <UFormGroup :label="i18n.t('app.settings.account.labels.email')">
            <UInput
                v-model="state.email"
                :placeholder="i18n.t('app.settings.account.placeholders.email')"
            />
        </UFormGroup>
        <UFormGroup :label="i18n.t('app.settings.account.labels.password')">
            <UInput
                v-model="state.password"
                :placeholder="
                    i18n.t('app.settings.account.placeholders.password')
                "
            />
        </UFormGroup>
        <UFormGroup :label="i18n.t('app.settings.account.labels.newPassword')">
            <UInput
                v-model="state.password"
                :placeholder="
                    i18n.t('app.settings.account.placeholders.newPassword')
                "
            />
        </UFormGroup>
        <UFormGroup
            class="my-5"
            :label="i18n.t('app.settings.account.labels.confirmNewPassword')"
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
        <UButton type="button" label="Change" />
    </UForm>
</template>

<style scoped></style>
