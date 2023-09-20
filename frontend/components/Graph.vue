<script setup lang="ts">
import * as vNG from "v-network-graph"
const configs = vNG.defineConfigs({
    node: {
        selectable: true,
        normal: {
            type: "rect",
            width: 100,
            height: 100,
            borderRadius: 8,
            color: "#e9f3ff",
            strokeColor: "#0085FF",
            strokeWidth: 2,
        },
        hover: {
            color: "#e9f3ff",
            strokeColor: "#148eff",
            strokeWidth: 2,
            width: 110,
            height: 110,
            borderRadius: 8,
        },
        label: {
            fontSize: 16,
            color: "#FFF",
            direction: "north",
        },
    },
    edge: {
        gap: 40,
        type: "curve",
        normal: {
            width: 2,
            color: "#0085FF",
            dasharray: "4 6",
            linecap: "round",
        },
        hover: {
            color: "#148eff",
        },
    },
    path: {
        visible: true,
        curveInNode: true,
        normal: {
            width: 10,
        },
    }
})
const nodes = {
    node1: { name: "Node 1" },
    node2: { name: "Node 2" },
    node3: { name: "Node 3" },
    node4: { name: "Node 4" },
}

const edges = {
    edge1: { source: "node1", target: "node2" },
    edge2: { source: "node2", target: "node3" },
    edge3: { source: "node3", target: "node4" },
}
</script>

<template>
    <v-network-graph
            class="w-full h-[calc(100vh-85px)]"
            :nodes="nodes"
            :edges="edges"
            :configs="configs"
    />
</template>