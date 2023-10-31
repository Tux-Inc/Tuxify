<!--
File Name: AutocompleteInput.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This component is an autocomplete input for the flow block inputs and outputs

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
import { IBlockInputAutocompleteProps } from "~/types/IBlockInputAutocompleteProps";

const props: IBlockInputAutocompleteProps = defineProps<IBlockInputAutocompleteProps>();

const emit = defineEmits<{
    (e: "flow-block-autocomplete", value: string): void;
}>()

const userInput = ref(props.input.value);
const isFocused = ref(false);
const hideTimeout = ref<NodeJS.Timeout | null>(null);

const suggestions = computed(() => {
    if (userInput.value.includes('{{')) {
        const pattern = /{{\s*flow.step.(\w+)?\.?(\w+)?\s*}}?/g;
        const match = pattern.exec(userInput.value);

        const currentBlockIndex = props.flowBlocks.findIndex(flow => flow.uuid === props.currentBlock.uuid);

        if (!match) {
            return props.flowBlocks
                .filter((flow, index) => index < currentBlockIndex && flow.uuid !== props.currentBlock.uuid) // Exclude blocks after the current block and the current block itself
                .flatMap(flow => flow.outputs.map(output => `{{ flow.step.${flow.uuid}.${output.name} }}`));
        }

        const [_, uuid, outputname] = match;

        if (uuid && !outputname) {
            return props.flowBlocks
                .filter((flow, index) => index < currentBlockIndex && flow.uuid?.startsWith(uuid) && flow.uuid !== props.currentBlock.uuid) // Exclude blocks after the current block and the current block itself
                .flatMap(flow => flow.outputs.map(output => `{{ flow.step.${uuid}.${output.name} }}`));
        }

        if (uuid && outputname) {
            return props.flowBlocks
                .filter((flow, index) => index < currentBlockIndex && flow.uuid === uuid)
                .flatMap(flow => flow.outputs)
                .filter(output => output.name.startsWith(outputname))
                .map(output => `{{ flow.step.${uuid}.${output.name} }}`);
        }
    }

    return [];
});



const handleFocus = () => {
    isFocused.value = true;
    if (hideTimeout.value) {
        clearTimeout(hideTimeout.value);
    }
};

const handleBlur = () => {
    hideTimeout.value = setTimeout(() => {
        isFocused.value = false;
    }, 150);
};

const selectSuggestion = (suggestion: string) => {
    userInput.value = suggestion;
    emit("flow-block-autocomplete", suggestion);
};

watch(
    () => userInput.value,
    (newVal) => {
        emit("flow-block-autocomplete", newVal);
    },
);

</script>

<template>
    <div class="w-full relative">
        <UInput
            v-model="userInput"
            :required="input.required"
            :placeholder="input.placeholder"
            @focus="handleFocus"
            @blur="handleBlur"
        />
        <Transition name="fade">
            <div v-show="suggestions.length && isFocused" class="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-lg p-4 w-full mt-2">
                <ul class="flex flex-col gap-2">
                    <li v-for="suggestion in suggestions" @click.prevent="selectSuggestion(suggestion)" class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg text-sm">
                        {{ suggestion }}
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>