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
import { IUserCookie } from "~/types/IUserCookie";
import { User } from "~/types/IUser";

const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const toast = useToast();
const userCookie = useCookie("user");
const accessToken = useRoute().query.access_token as string;
const refreshToken = useRoute().query.refresh_token as string;

async function getUser() {
    await useFetch(`${runtimeConfig.public.API_AUTH_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        server: false,
        onResponse({ response }) {
            if (response._data.statusCode === 401) {
                toast.add({
                    color: "red",
                    title: `Error ${response._data.statusCode}`,
                    description: response._data.message,
                });
                router.push("/auth/sign-in");
            } else {
                toast.add({
                    color: "green",
                    icon: "i-heroicons-check-circle",
                    title: "Success",
                    description: "You are now logged in",
                });
                const user: User = Object.assign({}, response._data) as User;
                const userObject: IUserCookie = {
                    user,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
                userCookie.value = JSON.stringify(userObject);
                router.push("/app");
            }
        },
    });
}
getUser();
</script>

<style scoped>
.loader {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: relative;
    animation: rotate 1s linear infinite;
}
.loader::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #fff;
    animation: prixClipFix 2s linear infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes prixClipFix {
    0% {
        clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    25% {
        clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    50% {
        clip-path: polygon(
            50% 50%,
            0 0,
            100% 0,
            100% 100%,
            100% 100%,
            100% 100%
        );
    }
    75% {
        clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
    }
    100% {
        clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
    }
}
</style>

<template>
    <div class="h-screen w-full flex flex-col items-center justify-center">
        <span class="loader"></span>
    </div>
</template>
