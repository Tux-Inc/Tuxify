<script setup lang="ts">
import request from "~/utilities/apiRequest";
import { FormError, FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { IFlow } from "~/types/IFlow";

const toast = useToast();

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
        const res = await request<IFlow>('/flows', {
            method: 'POST',
            body: JSON.stringify(event.data),
        });
        navigateTo(`/app/flows/${res._data?._id}`);
    } catch (e: any) {
        toast.add({
            color: 'red',
            icon: 'i-heroicons-exclamation-circle',
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}
</script>

<template>
    <div class="p-4">
        <div class="flex flex-row items-center justify-start gap-2">
            <UIcon name="i-heroicons-link" class="text-sm text-primary font-bold text-dark dark:text-light" />
            <h1 class="text-sm text-primary font-bold text-dark dark:text-light">New flow</h1>
        </div>
      <UForm class="flex flex-col gap-4 mt-4" :state="state" @submit="submit" :validate="validate">
          <UFormGroup label="Name" description="The name of the flow" name="name" required>
              <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Enabled" description="Enable flow by default" name="enabled">
              <UToggle v-model="state.enabled" />
          </UFormGroup>
          <div class="flex flex-row items-center justify-end gap-4">
              <UButton type="submit" color="primary">Create flow</UButton>
          </div>
      </UForm>
    </div>
</template>