<script setup lang="ts">
import { INodeListElement } from "~/types/INodeListElement";

defineProps({
    nodeType: {
        type: Object as PropType<INodeListElement>,
        required: true
    }
})

function onDragStart(event: any, nodeType: any) {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/vueflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }
}
</script>

<template>
  <UTooltip :text="nodeType.description">
    <div :draggable="true" @dragstart="onDragStart($event, nodeType.type)" class="flex flex-row items-center justify-start gap-2 w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-base-dark cursor-pointer">
      <UIcon :name="nodeType.icon" class="text-gray-500 dark:text-gray-300" />
      <span class="text-gray-500 dark:text-gray-300">{{ nodeType.name }}</span>
    </div>
  </UTooltip>
</template>