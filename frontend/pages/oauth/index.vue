<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const router = useRouter();
const toast = useToast();
const userCookie = useCookie("user");
const token = useRoute().query.access_token;

async function getUser() {
    const { data, error } = await useFetch(`${runtimeConfig.public.API_AUTH_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}`, }, });
    if (error.value) {
        toast.add({
            color: "red",
            title: `Error ${error.value.statusCode}`,
            description: error.value.message,
        });
    } else {
        toast.add({
            color: "green",
            title: "Success",
            description: "You are now logged in",
        });
        const user = Object.assign({}, data.value);
        const userObject = {
            user,
            access_token: token,
        };
        userCookie.value = JSON.stringify(userObject);
        await router.push("/app");
    }
}
getUser();
</script>

<template>
    <div class="h-screen w-full flex flex-col items-center justify-center">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12" />
        <h1 class="text-3xl font-bold mt-2">Redirecting to the app...</h1>
    </div>
</template>