<script setup>
function onDragStart(event, nodeType) {
    if (event.dataTransfer) {
        event.dataTransfer.setData('application/vueflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }
}
</script>

<template>
    <aside class="rounded-lg bg-tint-light dark:bg-tint-dark p-4 flex flex-col gap-4 m-4 absolute z-10 h-full bg-opacity-80">
        <div class="text-dark dark:text-light font-bold text-xl">Available nodes</div>

        <div class="flex flex-col gap-2">
            <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'input')">Input Node</div>

            <div class="vue-flow__node-default" :draggable="true" @dragstart="onDragStart($event, 'default')">Default Node</div>

            <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'output')">Output Node</div>
        </div>
    </aside>
</template>
