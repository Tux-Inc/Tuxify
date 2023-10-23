<script setup lang="ts">
import { IBlockFullProps } from "~/types/IBlockFullProps";
import { IBlockAvailableProps } from "~/types/IBlockAvailableProps";

const props: IBlockAvailableProps = defineProps<IBlockAvailableProps>();
const search: string = ref("");

defineEmits<{
    (e: "flow-add-block", block: IBlockFullProps): void;
}>();

const sampleData: IBlockFullProps[] = [
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
                value: "",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
    {
        title: "Title",
        name: "Name",
        description: "Description",
        service: {
            title: "Service",
            image: "https://via.placeholder.com/150",
            actions: [],
            reactions: [],
            name: "",
            description: "",
            isConnected: false,
        },
        inputs: [
            {
                label: "Input",
                placeholder: "Placeholder",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "Output",
            },
        ],
    },
];
</script>

<template>
    <div class="p-4">
        <div class="flex flex-row items-center justify-start gap-2">
            <UIcon name="i-heroicons-link" class="text-sm text-primary font-bold text-dark dark:text-light" />
            <h1 class="text-sm text-primary font-bold text-dark dark:text-light">Add action/reaction {{props.type}}</h1>
        </div>
        <div class="flex flex-col overflow-y-auto max-h-96 gap-2 mt-4 p-2">
            <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Search" />
            <div v-for="(block, index) in sampleData" :key="index">
                <AppFlowBlockPreview @click="$emit('flow-add-block', block)" :name="block.name" :title="block.title" :description="block.description" :service="block.service" />
            </div>
        </div>
    </div>
</template>