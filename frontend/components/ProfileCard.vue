<!--
File Name: ProfileCard.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the profile card component

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
import md5 from "md5";
import { useI18n } from "vue-i18n";
import { IUserCookie } from "~/types/IUserCookie";

const props = defineProps({
    displayTitle: {
        type: Boolean,
        default: false,
    },
});

const userCookie = useCookie<IUserCookie>("user");

const i18n = useI18n();

function getUserImage() {
    try {
        return `https://www.gravatar.com/avatar/${md5(
            userCookie.value.user.email.trim().toLowerCase(),
        )}`;
    } catch (error) {
        return "https://www.gravatar.com/avatar/feur";
    }
}

function getUserAlt() {
    try {
        return userCookie.value.user.name + " avatar";
    } catch (error) {
        return "User";
    }
}
</script>

<template>
    <span
        v-if="displayTitle"
        class="text-dark dark:text-light font-bold text-2xl"
    >
        {{ i18n.t("app.settings.profile.title") }}
    </span>
    <h1
        class="flex justify-center text-center p-5 text-dark dark:text-light font-bold text-2xl"
    >
        Welcome back {{ userCookie.user.name }} !
    </h1>
    <div class="justify-center items-center grid grid-cols-1 p-5">
        <div class="flex justify-center items-center">
            <NuxtImg
                quality="100"
                format="png"
                :src="getUserImage()"
                :alt="getUserAlt()"
                class="w-16 h-16 rounded-full"
            />
        </div>
        <div class="flex justify-center flex-col">
            <span
                class="flex justify-center text-dark dark:text-light font-bold text-xl"
            >
                {{ userCookie.user.name }}
            </span>
            <span class="flex justify-center text-dark dark:text-light">
                {{ userCookie.user.email }}
            </span>
        </div>
    </div>
</template>

<style scoped></style>
