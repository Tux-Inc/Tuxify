<script setup lang="ts">
import { IServiceDisplay } from "~/types/IServiceDisplay";
const userCookie = useCookie("user");
const runtimeConfig = useRuntimeConfig();
const toast = useToast();

definePageMeta({
    layout: "app-navigation",
});

async function getProviders(): Promise<IServiceDisplay[]> {
    const { data, pending, error } = await useAsyncData("user", () =>
        $fetch(`${runtimeConfig.public.API_BASE_URL}/providers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${toRaw(userCookie.value)?.access_token}`,
            },
        }),
    );
    if (error.value) {
        toast.add({
            color: "red",
            title: `Error ${error.value.statusCode}`,
            description: error.value.data.message,
        });
        return [];
    } else {
        return data.value as IServiceDisplay[];
    }
}

const services = ref<IServiceDisplay[]>([]);
onMounted(async () => {
    services.value = await getProviders();
});


</script>

<template>
    <div class="flex flex-col gap-x-6 gap-y-10 justify-center max">
        <h1 class="text-4xl font-bold text-dark dark:text-light hidden sm:block">Services</h1>
        <div class="container mx-auto my-auto grid md:grid-cols-3 sm:grid-cols-1 gap-8 text-center">
            <ServiceDisplay
                v-for="(service) in services"
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

<style scoped>

</style>
