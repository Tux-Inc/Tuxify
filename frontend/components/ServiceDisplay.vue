<!--
File Name: index.client.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the service display component

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

<script lang="ts" setup>
import { IServiceDisplay } from "~/types/IServiceDisplay";

const toast = useToast();

const props = withDefaults(defineProps<IServiceDisplay>(), {
    image: "",
    title: "",
    name: "",
    description: "",
    isConnected: false,
});

async function connect() {
    try {
        const res = await useApiRequest<string>(`/providers/${props.name}/add`);
        navigateTo(res._data as string, { external: true });
    } catch (e: any) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
        return;
    }
}

async function disconnect() {
    try {
        const res = await useApiRequest<string>(
            `/providers/${props.name}/remove`,
        );
        toast.add({
            color: "green",
            icon: "i-heroicons-check-circle",
            title: "Success",
            description: res._data as string,
        });
    } catch (e: any) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
        return;
    }
}
</script>

<template>
    <div
        class="overflow-hidden rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 p-4"
    >
        <div
            class="flex flex-col items-start justify-between gap-4 text-start h-full"
        >
            <div>
                <div class="flex gap-2 items-center">
                    <UTooltip :text="title">
                        <NuxtImg
                            :src="image"
                            class="w-10 h-10 mx-auto text-primary"
                            format="svg"
                            quality="100"
                        />
                    </UTooltip>
                    <span class="text-2xl font-bold text-dark dark:text-light">
                        {{ title }}
                    </span>
                </div>
                <div class="mt-2">
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ description }}
                    </span>
                </div>
                <div class="flex flex-col gap-2 mt-2">
                    <div class="flex flex-col">
                        <span class="text-sm font-bold uppercase">Actions</span>
                        <span v-for="action in actions">
                            {{ action.name }}
                        </span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold uppercase">
                            Reactions
                        </span>
                        <span v-for="reaction in reactions">
                            {{ reaction.name }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="w-full flex flex-row justify-end gap-2">
                <UButton
                    v-if="isConnected"
                    color="gray"
                    icon="i-heroicons-arrow-left-on-rectangle"
                    label="Disconnect service"
                    @click.prevent="disconnect"
                />
                <UButton
                    v-if="!isConnected"
                    icon="i-heroicons-arrow-right-on-rectangle"
                    label="Link account"
                    @click.prevent="connect"
                />
            </div>
        </div>
    </div>
</template>
