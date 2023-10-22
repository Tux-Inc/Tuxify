<script setup lang="ts">
import { IServiceDisplay } from "~/types/IServiceDisplay";

definePageMeta({
    layout: "app-navigation",
});

const servicesDisplay = ref<IServiceDisplay[]>([]);

onMounted(async () => {
    const res = await useApiRequest<IServiceDisplay[]>('/providers');
    servicesDisplay.value = res._data as IServiceDisplay[];
    servicesDisplay.value = [] as IServiceDisplay[];
});


</script>

<template>
    <div class="flex flex-col gap-x-6 gap-y-10 justify-center max">
        <h1 class="text-4xl font-bold text-dark dark:text-light hidden sm:block">Services</h1>
        <div class="container mx-auto my-auto grid md:grid-cols-3 sm:grid-cols-1 gap-8 text-center">
            <ServiceDisplay
                v-for="(service) in servicesDisplay"
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
