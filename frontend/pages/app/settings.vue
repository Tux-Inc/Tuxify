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
        icon: "i-heroicons-check",
        title: "Success",
        description: "You are now logged out",
    });
    router.push("/auth/sign-in");
    isLoading.value = false;
}
</script>
<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-4xl font-bold text-dark dark:text-light hidden sm:block">Settings</h1>
        </div>
        <div class="flex flex-col gap-4 mt-10">
            <span class="text-dark dark:text-light font-bold text-2xl">My account</span>
            <div class="flex items-center gap-2">
                <img :src="`https://www.gravatar.com/avatar/${md5(user.email.trim().toLowerCase())}`" class="w-16 h-16 rounded-full" />
                <div class="flex flex-col">
                    <span class="text-dark dark:text-light font-bold text-xl">{{ user.name }}</span>
                    <span class="text-dark dark:text-light">{{ user.email }}</span>
                </div>
            </div>
            <div>
                <UButton icon="i-heroicons-arrow-left-on-rectangle" color="red" variant="solid" @click="signOut"
                         :loading="isLoading">Sign out
                </UButton>
            </div>
        </div>
    </div>
</template>
