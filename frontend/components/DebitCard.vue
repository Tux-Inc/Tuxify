<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { IDebitCardProps } from "~/types/IDebitCardProps";
import { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { IRadioProps } from "~/types/IRadioProps";

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

const cardTypes: IRadioProps[] = [
    {
        name: "visa",
        label: "Visa",
        value: "visa",
        icon: "i-heroicons-credit-card",
        click: () => (state.value.card = "visa"),
    },
    {
        name: "mastercard",
        label: "Mastercard",
        value: "mastercard",
        icon: "i-heroicons-credit-card",
        click: () => (state.value.card = "mastercard"),
    },
    {
        name: "amex",
        label: "American Express",
        value: "amex",
        icon: "i-heroicons-credit-card",
        click: () => (state.value.card = "amex"),
    },
    {
        name: "discover",
        label: "Discover",
        value: "discover",
        icon: "i-heroicons-credit-card",
        click: () => (state.value.card = "discover"),
    },
];

const cardSelected = ref<IRadioProps>(
    cardTypes.find((card) => card.value === "visa"),
);
</script>

<template>
    <UForm :validate="validate" :state="state" @submit="submit">
        <span class="text-center text-dark dark:text-light font-bold text-2xl">
            {{ i18n.t("app.settings.billing.title") }}
        </span>
        <UFormGroup
            class="flex justify-center items-center my-5 gap-1"
            :label="i18n.t('app.settings.billing.labels.card')"
        >
            <div class="grid grid-cols-4 gap-4">
                <URadio
                    v-for="(card, index) in cardTypes"
                    v-model="cardSelected.value"
                    :key="index"
                    :name="card.name"
                    :label="card.label"
                    :value="card.value"
                />
            </div>
        </UFormGroup>
        <div class="grid md:grid-cols-4 gap-8 justify-center items-center">
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
        </div>
        <div class="grid md:grid-cols-4 gap-8 justify-center items-center">
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
        </div>
    </UForm>
</template>

<style scoped></style>
