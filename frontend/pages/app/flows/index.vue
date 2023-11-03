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
import { useI18n } from "vue-i18n";
import { IFlow } from "~/types/IFlow";

definePageMeta({
    layout: "app-navigation",
});

const i18n = useI18n();
const { metaSymbol } = useShortcuts();
const { $event } = useNuxtApp();
const toast = useToast();

const sendEvent = (event: string) => $event(event);

const flows = ref<IFlow[]>([]);

async function getFlows() {
    try {
        const res = await useApiRequest<IFlow[]>("/flows");
        if (!res._data) {
            toast.add({
                color: "red",
                icon: "i-heroicons-exclamation-circle",
                title: `Error`,
                description: `Flows not found`,
            });
        } else {
            return res._data;
        }
    } catch (e: any) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}
onMounted(async () => {
    const rawFlows: IFlow[] = (await getFlows()) ?? [];
    rawFlows.sort((a, b) => {
        return (
            new Date(b.updatedAt as Date).getTime() -
            new Date(a.updatedAt as Date).getTime()
        );
    });
    flows.value = rawFlows;
});
</script>

<template>
    <div class="flex flex-col gap-x-6 gap-y-10 justify-center max">
      <Head>
          <Title>Flows</Title>
      </Head>
      <div class="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          <div>
              <h1 class="text-4xl font-bold text-dark dark:text-light">Flows</h1>
              <span class="text-dark dark:text-light">On this page you can manage your flows, flows are used to automate your tasks.</span>
          </div>
          <UTooltip text="Create a new flow" :shortcuts="[metaSymbol, 'shift', 'F']">
            <UButton icon="i-heroicons-plus" @click="sendEvent('app:newFlow')" color="primary" variant="solid">New flow</UButton>
          </UTooltip>
      </div>
      <div class="w-full mt-4">
          <div v-if="flows.length === 0">
            <AppFlowEmptyList  />
          </div>
          <div v-else>
              <div class="flex flex-col gap-4">
                  <AppFlowCard v-for="flow in flows" :key="flow._id" :flow="flow" />
              </div>
          </div>
      </div>
    </div>
</template>
