<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import { IIntegrationList} from "~/types/IIntegrationList";

const props = withDefaults(defineProps<IIntegrationList>(), {
  title: "",
  description: "",
  icon: "",
});

</script>

<template>
  <UCard class="h-full">
    <span class="text-4xl text-center font-bold text-primary">{{title}}</span>
    <div class="my-4">
      <UButton :name="icon" size="xl" color="white" variant="ghost" />
    </div>
    <p class="mt-2 text-lg text-center tracking-tight text-gray-600 dark:text-gray-300">
      {{description}}
    </p>
  </UCard>
</template>
