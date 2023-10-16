<script setup lang="ts">
import { IServiceDisplay } from "~/types/IServiceDisplay";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const userCookie = useCookie("user");

const props = withDefaults(defineProps<IServiceDisplay>(), {
    image: "",
    title: "",
    name: "",
    description: "",
    isConnected: false,
});

async function connect() {
    const { data, pending, error } = await useAsyncData("user", () =>
        $fetch(`${runtimeConfig.public.API_BASE_URL}/providers/${props.name}/add`, {
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
    } else {
        navigateTo(data.value as string, { external: true });
    }
}

async function disconnect() {
    navigateTo(`${runtimeConfig.public.API_BASE_URL}/providers/${props.name}/remove`, { external: true });
}

</script>

<template>
    <UCard>
        <UTooltip :text="title">
            <img :src="image" class="w-10 h-10 mx-auto text-primary" />
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
            <UButton @click.prevent="disconnect" v-if="isConnected" color="gray" label="Se Déconnecter" />
            <UButton @click.prevent="connect" v-if="!isConnected" label="Se Connecter" />
        </div>
    </UCard>
</template>
