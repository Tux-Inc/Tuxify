<!--
File Name: Available.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
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
import { IActionReaction } from "~/types/IActionReaction";
import { IBlockAvailableProps } from "~/types/IBlockAvailableProps";
import { IActionReactionService } from "~/types/IActionReactionService";

const search = ref("");
const toast = useToast();

const availableActionsReactionsServices = ref<any[]>([]);
const props: IBlockAvailableProps = defineProps<IBlockAvailableProps>();

const emit = defineEmits<{
    (e: "flow-add-block", block: IBlockFullProps): void;
}>();

async function getAvailableBlocks() {
    try {
        const res = await useApiRequest<IActionReactionService[]>(`/providers`);
        if (!res._data) {
            toast.add({
                color: "red",
                icon: "i-heroicons-exclamation-circle",
                title: "Error",
                description: "Error while getting available blocks",
            });
        } else {
            res._data = res._data.filter((service) => service.isConnected);
            availableActionsReactionsServices.value = res._data;
        }
    } catch (e: any) {
        toast.add({
            color: "red",
            icon: "i-heroicons-exclamation-circle",
            title: `Error ${e.response?.status}`,
            description: e.response?.statusText,
        });
    }
}

function addBlock(
    actionReaction: IActionReaction,
    service: IActionReactionService,
) {
    const newBlock: IBlockFullProps = {
        name: actionReaction.name,
        title: actionReaction.title,
        description: actionReaction.description,
        inputs: actionReaction.inputs,
        outputs: actionReaction.outputs,
        type: actionReaction.type,
        service: {
            name: service.name,
            image: service.image,
            title: service.title,
            description: service.description,
            isConnected: service.isConnected ?? false,
            actions: [],
            reactions: [],
        },
    };
    newBlock.inputs.forEach((input) => {
        input.value = "";
    });
    emit("flow-add-block", newBlock);
}

onMounted(() => {
    getAvailableBlocks();
});
</script>

<template>
    <div class="p-4">
        <div class="flex flex-row items-center justify-start gap-2">
            <UIcon
                name="i-heroicons-link"
                class="text-sm text-primary font-bold text-dark dark:text-light"
            />
            <h1
                class="text-sm text-primary font-bold text-dark dark:text-light"
            >
                Add action/reaction {{ props.type }}
            </h1>
        </div>
        <div class="flex flex-col overflow-y-auto max-h-96 gap-2 mt-4 p-2">
            <UInput
                v-model="search"
                icon="i-heroicons-magnifying-glass"
                placeholder="Search"
            />
            <div
                v-for="(service, index) in availableActionsReactionsServices"
                :key="index"
            >
                <div class="flex flex-col gap-2">
                    <AppFlowBlockPreview
                        v-if="props.type === 'action'"
                        v-for="(actionReaction, index) in service.actions"
                        :key="index"
                        @click="addBlock(actionReaction, service)"
                        :name="actionReaction.name"
                        :title="actionReaction.title"
                        :description="actionReaction.description"
                        :service="service"
                    />
                    <AppFlowBlockPreview
                        v-if="props.type === 'reaction'"
                        v-for="(actionReaction, index) in service.reactions"
                        :key="index"
                        @click="addBlock(actionReaction, service)"
                        :name="actionReaction.name"
                        :title="actionReaction.title"
                        :description="actionReaction.description"
                        :service="service"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
