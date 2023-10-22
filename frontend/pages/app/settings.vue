<!--
File Name: settings.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Settings page

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
import md5 from "md5";
import { User } from "~/types/IUser";

definePageMeta({
    layout: "app-navigation",
});

let isLoading = ref(false);
const router = useRouter();
const toast = useToast();
const userCookie = useCookie("user");

const user: User = toRaw(userCookie.value?.user);

function signOut() {
    isLoading.value = true;
    userCookie.value = null;
    toast.add({
        color: "green",
        icon: "i-heroicons-check-circle",
        title: "Success",
        description: "You are now logged out",
    });
    router.push("/auth/sign-in");
    isLoading.value = false;
}
</script>

<template>
    <ClientOnly>
        <div>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <h1
                    class="text-4xl font-bold text-dark dark:text-light hidden sm:block"
                >
                    Settings
                </h1>
            </div>
            <div class="flex flex-col gap-4 mt-10">
                <span class="text-dark dark:text-light font-bold text-2xl"
                    >My account</span
                >
                <div class="flex items-center gap-2">
                    <NuxtImg
                        :src="`https://www.gravatar.com/avatar/${md5(
                            user.email.trim().toLowerCase(),
                        )}`"
                        class="w-16 h-16 rounded-full"
                    />
                    <div class="flex flex-col">
                        <span
                            class="text-dark dark:text-light font-bold text-xl"
                            >{{ user.name }}</span
                        >
                        <span class="text-dark dark:text-light">{{
                            user.email
                        }}</span>
                    </div>
                </div>
                <div>
                    <UButton
                        icon="i-heroicons-arrow-left-on-rectangle"
                        color="red"
                        variant="solid"
                        @click="signOut"
                        :loading="isLoading"
                        >Sign out
                    </UButton>
                </div>
            </div>
        </div>
    </ClientOnly>
</template>
