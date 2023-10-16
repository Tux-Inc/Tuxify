<script setup lang="ts">
import {useI18n} from "vue-i18n";

definePageMeta({
    layout: 'app-navigation'
})

const i18n = useI18n();
const { metaSymbol } = useShortcuts()
const { $event } = useNuxtApp()

const sendEvent = (event: string) => $event(event)
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
          <div class="flex flex-col w-full items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
              <div class="flex flex-col items-center justify-center">
                  <UIcon name="i-heroicons-archive-box" class="text-base-dark dark:text-base-light font-bold text-6xl" />
                  <span class="text-base-dark dark:text-base-light font-bold text-2xl mt-2">Uh oh, you don't have any flows yet!</span>
                  <span class="text-gray-500 dark:text-gray-400 text-lg">Create a new flow to get started</span>
              </div>
              <div class="mt-4">
                  <UButton size="xl" icon="i-heroicons-plus" @click="sendEvent('app:newFlow')" color="primary" variant="solid">New flow</UButton>
              </div>
          </div>
      </div>
    </div>
</template>

