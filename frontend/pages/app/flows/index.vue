<script setup lang="ts">
import {useI18n} from "vue-i18n";
import request from "~/utilities/apiRequest";
import { IFlow } from "~/types/IFlow";

definePageMeta({
    layout: 'app-navigation'
});

const i18n = useI18n();
const { metaSymbol } = useShortcuts();
const { $event } = useNuxtApp();
const toast = useToast();

const sendEvent = (event: string) => $event(event);

const flows = ref<IFlow[]>([]);

async function getFlows() {
    try {
        const res = await request<IFlow[]>('/flows');
        if (!res._data) {
            toast.add({
                color: 'red',
                icon: 'i-heroicons-exclamation-circle',
                title: `Error`,
                description: `Flows not found`,
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
    const rawFlows: IFlow[] = await getFlows() ?? [];
    rawFlows.sort((a, b) => {
        return new Date(b.updatedAt as Date).getTime() - new Date(a.updatedAt as Date).getTime();
    });
    flows.value = rawFlows;
});
</script>

<template>
    <div>
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-4xl font-bold text-dark dark:text-light">Flows</h1>
          <UTooltip text="Create a new flow" :shortcuts="[metaSymbol, 'shift', 'F']">
            <UButton icon="i-heroicons-plus" @click="sendEvent('app:newFlow')" color="primary" variant="solid">New flow</UButton>
          </UTooltip>
      </div>
      <div class="w-full mt-4">
          <div v-if="flows.length === 0">
            <AppFlowEmptyList  />
          </div>
          <div v-else>
              <div class="flex flex-col gap-4">
                  <AppFlowCard v-for="flow in flows" :key="flow._id" :flow="flow" />
              </div>
          </div>
      </div>
    </div>
</template>

