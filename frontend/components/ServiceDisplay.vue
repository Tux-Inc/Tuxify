<script setup lang="ts">
import { IServiceDisplay } from "~/types/IServiceDisplay";

const toast = useToast();

const props = withDefaults(defineProps<IServiceDisplay>(), {
    image: "",
    title: "",
    name: "",
    description: "",
    isConnected: false,
});

async function connect() {
    try {
        const res = await useApiRequest<string>(`/providers/${props.name}/add`);
        navigateTo(res._data as string, { external: true });
    } catch (e: any) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
        return;
    }
}

async function disconnect() {
    try {
        const res = await useApiRequest<string>(`/providers/${props.name}/remove`);
        toast.add({
            color: "green",
            icon: "i-heroicons-check-circle",
            title: "Success",
            description: res._data as string,
        });
    } catch (e: any) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
        return;
    }
}

</script>

<template>
    <UCard>
        <UTooltip :text="title">
            <NuxtImg src="image" class="w-10 h-10 mx-auto text-primary" />
        </UTooltip>
        <div class="flex flex-col gap-2 mt-2">
            <div class="flex flex-col">
                <span class="text-2xl text-center font-bold">Actions</span>
                <span v-for="action in actions" class="text-center"> - {{ action.name }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-2xl text-center font-bold">Reactions</span>
                <span v-for="reaction in reactions" class="text-center"> - {{ reaction.name }}</span>
            </div>
        </div>
        <div class="mx-auto my-auto mt-5">
            <UButton @click.prevent="disconnect" v-if="isConnected" color="gray" label="Disconnect service" />
            <UButton @click.prevent="connect" v-if="!isConnected" label="Link account" />
        </div>
    </UCard>
</template>
