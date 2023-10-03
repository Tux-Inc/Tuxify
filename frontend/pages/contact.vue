<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

definePageMeta({
    layout: "navigation",
});

const state = ref({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
});

const reasons = [
    {
        name: "Type of request",
        value: "",
        disabled: true,
    },
    {
        name: "Ask a question",
        value: "ask",
    },
    {
        name: "Report a bug",
        value: "report",
    },
    {
        name: "Suggest an idea",
        value: "idea",
    },
    {
        name: "Suggest a feature",
        value: "feature",
    },
    {
        name: "Other",
        value: "other",
    },
];

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

const i18n = useI18n();

</script>

<template>
    <div>
        <div class="py-24 sm:py-32 md:py-40 relative">
            <div
                class="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mb-[calc(var(--header-height))]"
            >
                <div class="relative z-[1] text-center">
                    <h1
                        class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl"
                        v-html="i18n.t('landing.contact.hero.title')"
                    />
                    <p
                        class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300"
                    >
                        {{ i18n.t("landing.contact.hero.description") }}
                    </p>
                </div>
            </div>
            <div class="container mx-auto grid gap-4 grid-cols-5 p-4">
                <div class="col-start-1 col-end-3 p-8 my-auto">
                    <h1 class="text-center text-3xl font-extrabold text-dark dark:text-light my-4">
                        {{ i18n.t("landing.contact.form.title") }}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-300">
                        {{ i18n.t("landing.contact.form.description") }}
                    </p>
                    <p class="text-gray-600 dark:text-gray-300 my-5">
                        {{ i18n.t("landing.contact.form.address") }}
                    </p>
                    <div class="items-center text-center text-gray-600 dark:text-gray-300">
                        <UButton icon="i-mdi-phone" :to="`tel:${i18n.t('landing.contact.form.phone')}`" color="gray"
                                 variant="ghost"
                                 :label="i18n.t('landing.contact.form.phone')" />
                        <UButton icon="i-mdi-mail" :to="`mailto:${i18n.t('landing.contact.form.email')}`" color="gray"
                                 variant="ghost"
                                 :label="i18n.t('landing.contact.form.email')" />
                    </div>
                </div>
                <UForm
                    class="col-start-3 col-end-6 gap-4"
                    :validate="validate"
                    :state="state"
                    @submit="submit"
                >
                    <UFormGroup class="my-5" :label="i18n.t('landing.contact.form.labels.name')">
                        <UInput v-model="state.name" :placeholder="i18n.t('landing.contact.form.placeholders.name')" />
                    </UFormGroup>
                    <UFormGroup class="my-5" :label="i18n.t('landing.contact.form.labels.email')">
                        <UInput v-model="state.email"
                                :placeholder="i18n.t('landing.contact.form.placeholders.email')" />
                    </UFormGroup>
                    <UFormGroup class="my-5" :label="i18n.t('landing.contact.form.labels.phone')">
                        <UInput v-model="state.phone"
                                :placeholder="i18n.t('landing.contact.form.placeholders.phone')" />
                    </UFormGroup>
                    <UFormGroup class="my-5" :label="i18n.t('landing.contact.form.labels.reason')">
                        <USelect v-model="state.reason" :options="reasons" option-attribute="name" />
                    </UFormGroup>
                    <UFormGroup class="my-5" :label="i18n.t('landing.contact.form.labels.message')">
                        <UTextarea v-model="state.message"
                                   :placeholder="i18n.t('landing.contact.form.placeholders.message')" />
                    </UFormGroup>
                </UForm>
                <UButton block class="col-start-4 text-center" type="submit"
                         :label="i18n.t('landing.contact.form.labels.submit')" />
            </div>
        </div>
    </div>
</template>
