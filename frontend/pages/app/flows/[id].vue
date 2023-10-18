<script setup lang="ts">
import request from "~/utilities/apiRequest";
import { IFlow } from "~/types/IFlow";
definePageMeta({
    layout: 'app-navigation'
})
const toast = useToast()

const flowId = useRoute().params.id

const currentFlow = ref<IFlow>({} as IFlow);

async function getFlow(): Promise<IFlow | undefined> {
    try {
        const res = await request<IFlow>(`/flows/${flowId}`);
        if (!res._data) {
            navigateTo('/app/flows');
            toast.add({
                color: 'red',
                icon: 'i-heroicons-exclamation-circle',
                title: `Error`,
                description: `Flow not found`,
            });
        } else {
            return res._data;
        }
    } catch (e: any) {
        navigateTo('/app/flows');
        toast.add({
            color: 'red',
            icon: 'i-heroicons-exclamation-circle',
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}
onMounted(async () => {
    currentFlow.value = await getFlow() as IFlow;
});
</script>

<template>
    <div>
        <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col">
                <h1 class="text-4xl font-bold text-dark dark:text-light">{{ currentFlow.name }}</h1>
                <span class="text-sm text-gray-500 dark:text-gray-400">ID: {{ currentFlow._id }}</span>
            </div>
        </div>
        <div class="w-full mt-4">
            <Graph />
        </div>
    </div>
</template>

