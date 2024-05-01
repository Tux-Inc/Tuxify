<!--
File Name: confirm-email.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the confirm email page

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

const i18n = useI18n();

const runtimeConfig = useRuntimeConfig();
const confirmationToken = useRoute().query.token;
const router = useRouter();
const toast = useToast();

async function confirmEmail() {
    const { error } = await useFetch(
        `${runtimeConfig.public.API_AUTH_BASE_URL}/api/auth/confirm-email`,
        { method: "POST", body: { confirmationToken }, server: false }
    );
    if (error.value) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
            title: `Error ${error.value.statusCode}`,
            description: error.value.data.message,
        });
    } else {
        toast.add({
            color: "green",
            icon: "i-heroicons-check",
            title: "Success",
            description: "Email confirmed, please sign in",
        });
        await router.push("/auth/sign-in");
    }
}
confirmEmail();
</script>

<template>
    <div class="h-screen w-full flex flex-col items-center justify-center">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12" />
        <h1 class="text-3xl font-bold mt-2">
            Redirecting to the sign-in page...
        </h1>
    </div>
</template>
