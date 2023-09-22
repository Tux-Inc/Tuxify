<script setup lang="ts">
import {IButtonLinkProps} from "../types/IButtonLinkProps";
const props = withDefaults(defineProps<IButtonLinkProps>(), {
    text: '',
    iconPosition: 'left',
    size: 'medium',
    tooltip: '',
    onClick: () => console.log('Default link click handler'),
});

const buttonSizeStyleMap = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-md',
    large: 'px-6 py-3 text-lg',
}
let isHovering = ref(false);
</script>

<template>
    <button
        @click.prevent="props.onClick"
        class="relative flex items-center justify-start gap-2 text-md rounded-lg cursor-pointer transition duration-50 ease-in-out text-dark dark:text-light hover:bg-primary-500 hover:bg-opacity-10 dark:hover:bg-primary-500 dark:hover:bg-opacity-10"
        :class="buttonSizeStyleMap[props.size] + ' ' + props.customClass"
        @pointerenter="isHovering = true"
        @pointerleave="isHovering = false"
    >
        <div v-if="props.iconPosition === 'left'">
            <i :class="props.icon"></i>
        </div>
        {{ props.text }}
        <div v-if="props.iconPosition === 'right'">
            <i :class="props.icon"></i>
        </div>
        <Tooltip :text="props.tooltip" :isVisible="isHovering" />
    </button>
</template>