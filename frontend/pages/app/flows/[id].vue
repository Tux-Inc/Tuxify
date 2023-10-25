<!--
File Name: [id].vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is flow slug page

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
import { IBlockFullProps } from "~/types/IBlockFullProps";
definePageMeta({
    layout: "app-navigation",
});
const toast = useToast();

const flowId = useRoute().params.id;

const currentFlow = ref<IFlow>({} as IFlow);
const deleted = ref(false);
const isSaving = ref(false);
const editingName = ref(false);
const editingDescription = ref(false);

const contextualItems = [
    [
        {
            label: "Delete",
            icon: "i-heroicons-trash",
            click: async () => {
                await deleteFlow();
                deleted.value = true;
                navigateTo("/app/flows");
            },
        },
    ],
];

async function getFlow(): Promise<IFlow | undefined> {
    try {
        const res = await useApiRequest<IFlow>(`/flows/${flowId}`);
        if (!res._data) {
            navigateTo("/app/flows");
            toast.add({
                color: "red",
                icon: "i-heroicons-exclamation-circle",
                title: `Error`,
                description: `Flow not found`,
            });
        } else {
            return res._data;
        }
    } catch (e: any) {
        navigateTo("/app/flows");
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}

async function updateFlow(): Promise<IFlow | undefined> {
    try {
        isSaving.value = true;
        const res = await useApiRequest<IFlow>(`/flows/${flowId}`, {
            method: "PUT",
            body: JSON.stringify(currentFlow.value),
        });
        if (!res._data) {
            isSaving.value = false;
            toast.add({
                color: "red",
                icon: "i-heroicons-exclamation-circle",
                title: `Error`,
                description: `Flow not found`,
            });
        } else {
            isSaving.value = false;
            return res._data;
        }
    } catch (e: any) {
        isSaving.value = false;
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}

async function deleteFlow(): Promise<IFlow | undefined> {
    try {
        const res = await useApiRequest<IFlow>(`/flows/${flowId}`, {
            method: "DELETE",
        });
        if (!res._data) {
            toast.add({
                color: "red",
                icon: "i-heroicons-exclamation-circle",
                title: `Error`,
                description: `Flow not found`,
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
    currentFlow.value = (await getFlow()) as IFlow;
});
onBeforeUnmount(async () => {
    if (!deleted.value) {
        await updateFlow();
    }
});

function flowComponentUpdated(flowData: IBlockFullProps[]) {
    currentFlow.value.data = flowData;
}
</script>

<template>
    <div>
        <div
            class="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap"
        >
            <div class="flex flex-col gap-2">
                <div class="flex flex-col">
                    <div
                        v-if="!editingName"
                        @click="editingName = true"
                        class="flex items-center cursor-pointer"
                    >
                        <h1
                            class="text-4xl font-bold text-dark dark:text-light"
                        >
                            {{ currentFlow.name }}
                        </h1>
                        <UIcon name="i-heroicons-pencil-solid" class="ml-2" />
                    </div>
                    <UInput
                        v-else
                        autofocus
                        v-model="currentFlow.name"
                        class="text-4xl font-bold text-dark dark:text-light border rounded"
                        @blur="editingName = false"
                    />
                    <span class="text-sm text-gray-500 dark:text-gray-400"
                        >ID: {{ currentFlow._id }}</span
                    >
                </div>

                <div class="flex flex-col mt-2">
                    <div class="flex gap-2">
                        <UToggle v-model="currentFlow.enabled" />
                        <span class="text-sm text-dark dark:text-light">{{
                            currentFlow.enabled ? "Enabled" : "Disabled"
                        }}</span>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label class="text-sm text-gray-500 dark:text-gray-400"
                        >Description</label
                    >
                    <div
                        v-if="!editingDescription"
                        @click="editingDescription = true"
                        class="flex items-center cursor-pointer"
                    >
                        <span
                            class="text-sm text-dark dark:text-light text-justify"
                            >{{
                                currentFlow.description
                                    ? currentFlow.description
                                    : "No description"
                            }}</span
                        >
                        <UIcon name="i-heroicons-pencil-solid" class="ml-2" />
                    </div>
                    <UTextarea
                        v-else
                        autofocus
                        v-model="currentFlow.description"
                        class="border rounded text-dark dark:text-light w-full"
                        @blur="editingDescription = false"
                    ></UTextarea>
                </div>

                <div class="flex flex-col">
                    <label class="text-sm text-gray-500 dark:text-gray-400"
                        >Last run</label
                    >
                    <span class="text-sm text-dark dark:text-light">{{
                        currentFlow.lastRun ? currentFlow.lastRun : "Never"
                    }}</span>
                </div>
            </div>
            <div class="flex gap-2 flex-nowrap">
                <UButton
                    @click.prevent="updateFlow"
                    size="md"
                    color="primary"
                    label="Save"
                    icon="i-heroicons-folder-arrow-down"
                    :loading="isSaving"
                />
                <UDropdown
                    :items="contextualItems"
                    :popper="{ placement: 'bottom-start' }"
                >
                    <UButton
                        size="md"
                        color="white"
                        trailing-icon="i-heroicons-ellipsis-vertical"
                    />
                </UDropdown>
            </div>
        </div>
        <div v-if="currentFlow.data" class="w-full mt-4">
            <AppFlowBlockContainer
                :flow-data="currentFlow.data"
                @flow-update="flowComponentUpdated($event)"
            />
            <!-- TODO: Add a switcher to switch to graph mode
            <Graph />
            -->
        </div>
    </div>
</template>
