<!--
File Name: about.json.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the about page

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

const servicesDisplay = ref<IServiceDisplay[]>([]);

onMounted(async () => {
    const res = await useApiRequest<IServiceDisplay[]>("/providers");
    servicesDisplay.value = res._data as IServiceDisplay[];
});

const aboutJSON = computed(() => {
    return JSON.stringify({
        name: "Tux",
        version: "1.0.0",
        description:
            "Tux is a service that allows you to connect all your accounts to one place.",
        client: {
            host: "https://tux.gwenaelhubler.com",
            port: 443,
            protocol: "https",
        },
        server: {
            current_time: new Date().toISOString(),
            services: servicesDisplay.value,
        },
    });
});
</script>

<template>
    {{ aboutJSON }}
</template>
