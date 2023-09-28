<script setup lang="ts">
import {useI18n} from "vue-i18n";

definePageMeta({
    layout: 'app-navigation'
})

const i18n = useI18n();

const { metaSymbol } = useShortcuts()
</script>

<template>
    <div>
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-4xl font-bold text-dark dark:text-light">Flows</h1>
          <UTooltip text="Create a new flow" :shortcuts="[metaSymbol, 'shift', 'F']">
            <UButton icon="i-heroicons-plus" @click="$emit('newFlow')" color="primary" variant="solid">New flow</UButton>
          </UTooltip>
      </div>
      <div class="w-full mt-4">
      </div>
    </div>
</template>

