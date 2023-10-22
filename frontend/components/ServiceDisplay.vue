<!--
File Name: index.client.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
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
    <UCard>
        <UTooltip :text="title">
            <NuxtImg :src="image" class="w-10 h-10 mx-auto text-primary" />
        </UTooltip>
        <div class="flex flex-col gap-2 mt-2">
            <div class="flex flex-col">
                <span class="text-2xl text-center font-bold">Actions</span>
                <span v-for="action in actions" class="text-center">
                    - {{ action.name }}</span
                >
            </div>
            <div class="flex flex-col">
                <span class="text-2xl text-center font-bold">Reactions</span>
                <span v-for="reaction in reactions" class="text-center">
                    - {{ reaction.name }}</span
                >
            </div>
        </div>
        <div class="mx-auto my-auto mt-5">
            <UButton
                @click.prevent="disconnect"
                v-if="isConnected"
                color="gray"
                label="Disconnect service"
            />
            <UButton
                @click.prevent="connect"
                v-if="!isConnected"
                label="Link account"
            />
        </div>
    </UCard>
</template>
