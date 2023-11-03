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
import { IServiceDisplay } from "~/types/IServiceDisplay";

definePageMeta({
    layout: "app-navigation",
});

const servicesDisplay = ref<IServiceDisplay[]>([]);

onMounted(async () => {
    const res = await useApiRequest<IServiceDisplay[]>("/providers");
    servicesDisplay.value = res._data as IServiceDisplay[];
});
</script>

<template>
    <div class="flex flex-col gap-x-6 gap-y-10 justify-center max">
        <Head>
            <Title>Services</Title>
        </Head>
        <div>
            <h1 class="text-4xl font-bold text-dark dark:text-light hidden sm:block">Services</h1>
            <span class="text-dark dark:text-light">On this page you can connect your services to your account.</span>
        </div>
        <div class="container mx-auto my-auto grid md:grid-cols-3 sm:grid-cols-1 gap-8 text-center">
            <ServiceDisplay
                v-for="service in servicesDisplay"
                :image="service.image"
                :name="service.name"
                :title="service.title"
                :description="service.description"
                :isConnected="service.isConnected"
                :actions="service.actions"
                :reactions="service.reactions"
            />
        </div>
    </div>
</template>

<style scoped></style>
