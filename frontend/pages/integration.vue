<script setup lang="ts" xmlns="http://www.w3.org/1999/html">
import {useI18n} from "vue-i18n";
import { IIntegrationList} from "~/types/IIntegrationList";

definePageMeta({
  layout: 'navigation',
})

const i18n = useI18n()
const integrations : IIntegrationList[] = i18n.tm<IIntegrationList[]>("landing.integration.services");

</script>

<template>
  <div class="py-24 sm:py-32 md:py-40 relative mb-[calc(var(--header-height)*2)]">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="relative z-[1] text-center">
        <h1 class="text-4xl font-extrabold text-dark dark:text-light sm:text-5xl md:text-6xl" v-html="i18n.t('landing.integration.title')" />
        <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
          {{ i18n.t('landing.integration.description') }}
        </p>
      </div>
      <div class="mt-10 flex flex-wrap gap-x-6 gap-y-10 justify-center max text-center">
        <IntegrationList
          v-for="(integration) in integrations"
          :title="integration.title"
          :description="integration.description"
          :icon="integration.icon"
        />
      </div>
    </div>
  </div>
</template>