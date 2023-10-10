<script setup lang="ts">
import { IServiceDisplay } from "~/types/IServiceDisplay";

const props = withDefaults(defineProps<IServiceDisplay>(), {
    image: "",
    title: "",
    identifier: "",
    description: "",
    isConnected: false,
});

</script>

<template>
    <UCard>
        <img :src="image" class="w-10 h-10 mx-auto text-primary" />
        <span class="text-4xl text-center font-bold text-primary">{{ title }}</span>
        <div class="mx-auto my-auto p-8">
            <UButton v-if="isConnected" color="gray" label="Se Déconnecter" />
            <UButton v-if="!isConnected" label="Se Connecter" />
        </div>
    </UCard>
</template>
