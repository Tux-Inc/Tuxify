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

const toast = useToast();
const { isMobile } = useDevice();

definePageMeta({
    layout: "app-navigation",
});

let loading = ref(false);

function setLoading() {
    loading.value = !loading.value;
}

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
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
        <Head>
            <Title>Home</Title>
            <Meta name="description" content="Put your description here." />
        </Head>
        <div v-if="!isMobile">
            <h1 class="text-4xl font-bold text-dark dark:text-light">Home</h1>
        </div>
    </div>
    <div class="gap-4 mt-10">
        <div
            class="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
        >
            <ProfileCard />
        </div>
    </div>
    <div v-if="flows.length === 0">
        <AppFlowHomeEmptyList
            class="flex items-center justify-center gap-4 mt-10"
        />
    </div>
    <div
        class="grid md:grid-cols-2 grid-cols-1 items-center justify-between gap-4 mt-10"
        v-else
    >
        <AppFlowHomeCard v-for="flow in flows" :key="flow._id" :flow="flow" />
    </div>
  </div>
</template>
