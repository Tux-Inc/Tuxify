<!--
File Name: DebitCard.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for debit card

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
import { IRadioProps } from "~/types/IRadioProps";
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
    cardTypes.find((card) => card.value === "visa") ?? cardTypes[0],
);
</script>

<template>
    <UForm :validate="validate" :state="state" @submit="submit">
        <span class="text-center text-dark dark:text-light font-bold text-2xl">
            {{ i18n.t("app.settings.billing.title") }}
        </span>
        <div
            class="grid sm:grid-cols-2 md:grid-cols-4 my-2"
            :label="i18n.t('app.settings.billing.labels.card')"
        >
            <URadio
                v-for="(card, index) in cardTypes"
                :class="`col-start-${index % 2 === 1 ? 2 : 1} md:col-start-${
                    index % 2 === 1 ? 3 : 2
                }`"
                v-model="cardSelected.value"
                :key="index"
                :name="card.name"
                :label="card.label"
                :value="card.value"
            />
        </div>
        <div class="md:grid md:grid-cols-4 gap-8">
            <UFormGroup
                class="my-5 md:col-start-2 md:col-span-1"
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
                class="my-5 md:col-start-3 md:col-span-1"
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
        <div class="md:grid md:grid-cols-4 gap-8">
            <UFormGroup
                class="my-5 md:col-start-2 md:col-span-1"
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
                class="my-5 md:col-start-3 md:col-span-1"
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
