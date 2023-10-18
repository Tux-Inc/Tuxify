<script setup lang="ts">
import request from "~/utilities/apiRequest";
import { IFlow } from "~/types/IFlow";
definePageMeta({
    layout: 'app-navigation'
})
const toast = useToast();

const flowId = useRoute().params.id;

const currentFlow = ref<IFlow>({} as IFlow);
const deleted = ref(false);
const isSaving = ref(false);
const editingName = ref(false);
const editingDescription = ref(false);


const contextualItems = [
   [{
        label: 'Delete',
        icon: 'i-heroicons-trash',
        click: async () => {
            await deleteFlow();
            deleted.value = true;
            navigateTo('/app/flows');
        }
    }]
]

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

async function updateFlow(): Promise<IFlow | undefined> {
    try {
        isSaving.value = true;
        const res = await request<IFlow>(`/flows/${flowId}`, {
            method: 'PUT',
            body: JSON.stringify(currentFlow.value),
        });
        if (!res._data) {
            isSaving.value = false;
            toast.add({
                color: 'red',
                icon: 'i-heroicons-exclamation-circle',
                title: `Error`,
                description: `Flow not found`,
            });
        } else {
            isSaving.value = false;
            return res._data;
        }
    } catch (e: any) {
        isSaving.value = false;
        toast.add({
            color: 'red',
            icon: 'i-heroicons-exclamation-circle',
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}

async function deleteFlow(): Promise<IFlow | undefined> {
    try {
        const res = await request<IFlow>(`/flows/${flowId}`, {
            method: 'DELETE',
        });
        if (!res._data) {
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
onBeforeUnmount(async () => {
    if (!deleted.value) {
        await updateFlow();
    }
});
</script>

<template>
    <div>
        <div class="flex items-start justify-between gap-4">
            <div class="flex flex-col gap-2">
                <div class="flex flex-col">
                    <div v-if="!editingName" @click="editingName = true" class="flex items-center cursor-pointer">
                        <h1 class="text-4xl font-bold text-dark dark:text-light">{{ currentFlow.name }}</h1>
                        <UIcon name="i-heroicons-pencil-solid" class="ml-2" />
                    </div>
                    <UInput v-else autofocus v-model="currentFlow.name" class="text-4xl font-bold text-dark dark:text-light border rounded" @blur="editingName = false" />
                    <span class="text-sm text-gray-500 dark:text-gray-400">ID: {{ currentFlow._id }}</span>
                </div>

                <div class="flex flex-col mt-2">
                    <div class="flex gap-2">
                        <UToggle v-model="currentFlow.enabled" />
                        <span class="text-sm text-dark dark:text-light">{{ currentFlow.enabled ? 'Enabled' : 'Disabled' }}</span>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label class="text-sm text-gray-500 dark:text-gray-400">Description</label>
                    <div v-if="!editingDescription" @click="editingDescription = true" class="flex items-center cursor-pointer">
                        <span class="text-sm text-dark dark:text-light">{{ currentFlow.description ? currentFlow.description : 'Empty' }}</span>
                        <UIcon name="i-heroicons-pencil-solid" class="ml-2" />
                    </div>
                    <UTextarea v-else autofocus v-model="currentFlow.description" class="border rounded text-dark dark:text-light w-full" @blur="editingDescription = false"></UTextarea>
                </div>

                <div class="flex flex-col">
                    <label class="text-sm text-gray-500 dark:text-gray-400">Last run</label>
                    <span class="text-sm text-dark dark:text-light">{{ currentFlow.lastRun ? currentFlow.lastRun : 'Never' }}</span>
                </div>
            </div>
            <div class="flex gap-2 flex-wrap">
                <UButton @click.prevent="updateFlow" size="md" color="primary" label="Save" icon="i-heroicons-folder-arrow-down" :loading="isSaving" />
                <UDropdown :items="contextualItems" :popper="{ placement: 'bottom-start' }">
                    <UButton size="md" color="white" trailing-icon="i-heroicons-ellipsis-vertical" />
                </UDropdown>
            </div>
        </div>
        <div class="w-full mt-4">
            <Graph />
        </div>
    </div>
</template>

