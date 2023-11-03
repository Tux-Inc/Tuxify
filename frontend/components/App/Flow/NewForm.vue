<!--
/**
File Name: useApiRequest.client.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Brief description of the contents of this file.

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
*/
-->

<!--
File Name: index.client.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the oauth page

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

<script setup lang="ts">
import { IFlow } from "~/types/IFlow";
import { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const toast = useToast();
const { $event } = useNuxtApp();

const state = ref({
    name: undefined,
    enabled: false,
});

const validate = (state: any): FormError[] => {
    const errors = [];
    if (!state.name) errors.push({ path: "name", message: "Required" });
    return errors;
};

async function submit(event: FormSubmitEvent<IFlow>) {
    try {
        const res = await useApiRequest<IFlow>("/flows", {
            method: "POST",
            body: JSON.stringify(event.data),
        });
        $event("app:flowCreated", res._data?._id);
        navigateTo(`/app/flows/${res._data?._id}`);
    } catch (e: any) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}
</script>

<template>
    <div class="p-4">
        <div class="flex flex-row items-center justify-start gap-2">
            <UIcon
                name="i-heroicons-link"
                class="text-sm text-primary font-bold text-dark dark:text-light"
            />
            <h1
                class="text-sm text-primary font-bold text-dark dark:text-light"
            >
                New flow
            </h1>
        </div>
        <UForm
            class="flex flex-col gap-4 mt-4"
            :state="state"
            @submit="submit"
            :validate="validate"
        >
            <UFormGroup
                label="Name"
                description="The name of the flow"
                name="name"
                required
            >
                <UInput v-model="state.name" />
            </UFormGroup>
            <UFormGroup
                label="Enabled"
                description="Enable flow by default"
                name="enabled"
            >
                <UToggle v-model="state.enabled" />
            </UFormGroup>
            <div class="flex flex-row items-center justify-end gap-4">
                <UButton type="submit" color="primary">Create flow</UButton>
            </div>
        </UForm>
    </div>
</template>
