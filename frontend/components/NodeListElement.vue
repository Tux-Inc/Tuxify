<script setup lang="ts">
function onDragStart(event: any, nodeType: any) {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/vueflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }
}
</script>

<template>
  <UTooltip text="Trigger when you receive an email">
    <div :draggable="true" @dragstart="onDragStart($event, 'text')" class="flex flex-row items-center justify-start gap-2 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-base-dark">
      <UIcon name="i-mdi-google" class="text-gray-500 dark:text-gray-300" />
      <span class="text-gray-500 dark:text-gray-300">Gmail</span>
    </div>
  </UTooltip>
</template>