<script setup lang="ts">
import {Handle, Position} from '@vue-flow/core'
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
    <div class="flex flex-row gap-2 items-center justify-start">
      <UIcon name="i-mdi-text" class="text-gray-500 dark:text-gray-300" />
      <span class="text-gray-500 dark:text-gray-300">Void node</span>
    </div>
    <div class="flex flex-col gap-2 w-full h-full">
      <Handle type="source" :position="Position.Right" id="a" />
    </div>
  </div>
</template>
