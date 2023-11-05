<!--
File Name: settings.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the settings page

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

definePageMeta({
    layout: "app-navigation",
});

const i18n = useI18n();
const toast = useToast();
let isLoading = ref(false);
const router = useRouter();
const userCookie = useCookie("user");

function signOut() {
    isLoading.value = true;
    userCookie.value = null;
    toast.add({
        color: "green",
        icon: "i-heroicons-check",
        title: "Success",
        description: "You are now logged out",
    });
    router.push("/auth/sign-in");
    isLoading.value = false;
}

const { isMobile } = useDevice();
</script>

<template>
    <div class="flex flex-col gap-x-6 gap-y-10 justify-center max">
        <Head>
            <Title>{{ i18n.t("app.settings.title") }}</Title>
        </Head>
        <div
            class="flex justify-center items-center md:justify-between gap-4 flex-wrap md:flex-nowrap"
        >
            <div>
                <h1
                    v-if="!isMobile"
                    class="text-4xl font-bold text-dark dark:text-light"
                >
                    {{ i18n.t("app.settings.title") }}
                </h1>
                <span class="text-dark dark:text-light">
                    {{ i18n.t("app.settings.description") }}
                </span>
            </div>
            <UButton
                icon="i-heroicons-arrow-left-on-rectangle"
                color="red"
                variant="solid"
                @click="signOut"
                :loading="isLoading"
                label="Sign Out"
            />
        </div>
    </div>
    <div>
        <div class="flex flex-col gap-4 mt-10">
            <ProfileCard :display-title="true" />
            <AccountSettings />
            <DebitCard />
            <UserPreferences />
        </div>
        <div class="mt-10 flex items-center justify-between">
            <UButton type="button" label="Cancel" />
            <UButton type="submit" label="Save" />
        </div>
    </div>
</template>
