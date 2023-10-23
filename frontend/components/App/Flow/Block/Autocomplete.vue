<script setup lang="ts">
import { IBlockInputAutocompleteProps } from "~/types/IBlockInputAutocompleteProps";

const props: IBlockInputAutocompleteProps = defineProps<IBlockInputAutocompleteProps>();

const emit = defineEmits<{
    (e: "flow-block-autocomplete", query: string): void;
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
                .flatMap(flow => flow.outputs.map(output => `{{ flow.step.${flow.uuid}.${output.label} }}`));
        }

        const [_, uuid, outputname] = match;

        if (uuid && !outputname) {
            return props.flowBlocks
                .filter((flow, index) => index < currentBlockIndex && flow.uuid?.startsWith(uuid) && flow.uuid !== props.currentBlock.uuid) // Exclude blocks after the current block and the current block itself
                .flatMap(flow => flow.outputs.map(output => `{{ flow.step.${uuid}.${output.label} }}`));
        }

        if (uuid && outputname) {
            return props.flowBlocks
                .filter((flow, index) => index < currentBlockIndex && flow.uuid === uuid)
                .flatMap(flow => flow.outputs)
                .filter(output => output.label.startsWith(outputname))
                .map(output => `{{ flow.step.${uuid}.${output.label} }}`);
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
    console.log(suggestion);
    userInput.value = suggestion;
    emit("flow-block-autocomplete", suggestion);
};
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
        <div v-show="suggestions.length && isFocused" class="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-lg p-4 w-full mt-2">
            <ul class="flex flex-col gap-2">
                <li v-for="suggestion in suggestions" @click.prevent="selectSuggestion(suggestion)" class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg text-sm">
                    {{ suggestion }}
                </li>
            </ul>
        </div>
    </div>
</template>