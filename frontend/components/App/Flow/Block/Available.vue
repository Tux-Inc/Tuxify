<!--
File Name: Available.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This component is the available block list modal

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

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
        title: "Receive email",
        name: "provider.google.action.gmail.receive",
        description: "Trigger when you receive an email in your Gmail account",
        service: {
            title: "Google",
            image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
            actions: [],
            reactions: [],
            name: "google",
            description: "",
            isConnected: true,
        },
        inputs: [],
        outputs: [
            {
                label: "From",
            },
            {
                label: "Subject",
            },
            {
                label: "Body",
            },
        ],
    },
    {
        title: "Send email",
        name: "provider.google.action.gmail.send",
        description: "Send an email from your Gmail account",
        service: {
            title: "Google",
            image: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
            actions: [],
            reactions: [],
            name: "google",
            description: "",
            isConnected: true,
        },
        inputs: [
            {
                label: "To",
                placeholder: "john.doe@example.com",
                required: true,
                value: "",
            },
            {
                label: "Subject",
                placeholder: "Subject",
                required: true,
                value: "",
            },
            {
                label: "Body",
                placeholder: "Body",
                required: true,
                value: "",
            },
        ],
        outputs: [
            {
                label: "From",
            },
            {
                label: "Subject",
            },
            {
                label: "Body",
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