<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { IDebitCardProps } from "~/types/IDebitCardProps";
import { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const state = ref<IDebitCardProps>({
    card: "visa",
    cardName: "John Doe",
    cardNumber: "**** **** **** 1234",
    cardExpiry: "12/22",
    cardCvc: "***",
});

const i18n = useI18n();

const validate = (state: any): FormError[] => {
    const errors = [];
    if (!state.cardName) errors.push({ path: "cardName", message: "Required" });
    if (!state.cardNumber)
        errors.push({ path: "cardNumber", message: "Required" });
    if (!state.cardExpiry)
        errors.push({ path: "cardExpiry", message: "Required" });
    if (!state.cardCvc) errors.push({ path: "cardCvc", message: "Required" });
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
            {{ i18n.t("app.settings.billing.title") }}
        </span>
        <UFormGroup
            class="flex justify-between"
            :label="i18n.t('app.settings.billing.labels.card')"
        >
            <UButton type="button" label="Change" />
            <UButton type="button" label="Change" />
            <UButton type="button" label="Change" />
        </UFormGroup>
        <UFormGroup
            class="my-5"
            :label="i18n.t('app.settings.billing.labels.cardName')"
        >
            <UInput
                v-model="state.cardName"
                :placeholder="
                    i18n.t('app.settings.billing.placeholders.cardName')
                "
            />
        </UFormGroup>
        <UFormGroup
            class="my-5"
            :label="i18n.t('app.settings.billing.labels.cardNumber')"
        >
            <UInput
                v-model="state.cardNumber"
                :placeholder="
                    i18n.t('app.settings.billing.placeholders.cardNumber')
                "
            />
        </UFormGroup>
        <UFormGroup
            class="my-5"
            :label="i18n.t('app.settings.billing.labels.cardExpiry')"
        >
            <UInput
                v-model="state.cardExpiry"
                :placeholder="
                    i18n.t('app.settings.billing.placeholders.cardExpiry')
                "
            />
        </UFormGroup>
        <UFormGroup
            class="my-5"
            :label="i18n.t('app.settings.billing.labels.cardCvc')"
        >
            <UInput
                v-model="state.cardCvc"
                :placeholder="
                    i18n.t('app.settings.billing.placeholders.cardCvc')
                "
            />
        </UFormGroup>
    </UForm>
</template>

<style scoped></style>
