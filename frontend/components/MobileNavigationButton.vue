<script setup lang="ts">
import {IButtonLinkProps} from "../types/IButtonLinkProps";
const props = withDefaults(defineProps<IButtonLinkProps>(), {
    text: '',
    iconPosition: 'left',
    size: 'medium',
    onClick: () => console.log('Default link click handler'),
});
</script>

<template>
    <button
            @click.prevent="props.onClick"
            class="flex flex-col items-center justify-start text-sm px-4 py-2 text-md rounded-lg cursor-pointer transition duration-50 ease-in-out text-dark dark:text-light"
            :class="props.customClass"
    >
        <i class="text-xl" :class="props.icon"></i>
        {{ props.text }}
    </button>
</template>