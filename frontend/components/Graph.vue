<script setup>
import {VueFlow, useVueFlow} from '@vue-flow/core'
import {Background} from '@vue-flow/background'
import {nextTick, watch} from 'vue'
import Text from "~/components/Node/Text.vue";

const nodeTypes = {
  text: markRaw(Text),
}

let id = 0

function getId() {
  return `dndnode_${id++}`
}

const {findNode, onConnect, addEdges, addNodes, project, vueFlowRef} = useVueFlow({
  nodes: [
    {
      id: '1',
      type: 'input',
      label: 'input node',
      position: {x: 250, y: 25},
    },
  ],
})

function onDragOver(event) {
  event.preventDefault()

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

onConnect((params) => addEdges({...params, type: 'smoothstep'}))

function onDrop(event) {
  const type = event.dataTransfer?.getData('application/vueflow')

  const {left, top} = vueFlowRef.value.getBoundingClientRect()

  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  })

  const newNode = {
    id: getId(),
    type,
    position,
    label: `${type} node`,
  }

  addNodes([newNode])

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(newNode.id)
    const stop = watch(
        () => node.dimensions,
        (dimensions) => {
          if (dimensions.width > 0 && dimensions.height > 0) {
            node.position = {
              x: node.position.x - node.dimensions.width / 2,
              y: node.position.y - node.dimensions.height / 2
            }
            stop()
          }
        },
        {deep: true, flush: 'post'},
    )
  })
}
</script>

<template>
  <div class="dndflow relative" @drop="onDrop">
    <NodeList/>
    <VueFlow @dragover="onDragOver" :style="{ height: 'calc(100vh - 10rem)' }" :node-types="nodeTypes">
      <Background gap="12"/>
    </VueFlow>
  </div>
</template>

<style>
.dndflow {
  flex-direction: column;
  display: flex;
  height: 100%
}

.dndflow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%
}

@media screen and (min-width: 640px) {
  .dndflow {
    flex-direction: row
  }

  .dndflow aside {
    min-width: 25%
  }
}

@media screen and (max-width: 639px) {
  .dndflow aside .nodes {
    display: flex;
    flex-direction: row;
    gap: 5px
  }
}
</style>