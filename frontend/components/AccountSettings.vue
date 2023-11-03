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
        <div class="grid md:grid-cols-4 gap-8 justify-center items-center">
            <UFormGroup
                class="col-start-2 col-span-1"
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
                class="col-start-3 col-span-1"
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
        <div class="mt-5 grid md:grid-cols-3 gap-8 justify-center items-center">
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
