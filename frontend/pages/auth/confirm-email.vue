<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

const runtimeConfig = useRuntimeConfig();
const confirmationToken = useRoute().query.token;
const router = useRouter();
const toast = useToast();

async function confirmEmail() {
    const { data, pending, error } = await useAsyncData("user", () =>
        $fetch(`${runtimeConfig.public.API_AUTH_BASE_URL}/api/auth/confirm-email`, {
            method: "POST",
            body: {
                confirmationToken,
            }
        })
    );
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
        <h1 class="text-3xl font-bold mt-2">Redirecting to the sign-in page...</h1>
    </div>
</template>

