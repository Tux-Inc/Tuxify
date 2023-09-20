<script setup lang="ts">
import {IButtonLinkProps} from "../types/IButtonLinkProps";
const props = withDefaults(defineProps<IButtonLinkProps>(), {
    text: 'Link',
    iconPosition: 'left',
    onClick: () => console.log('Default link click handler'),
});
</script>

<template>
    <button
        @click.prevent="props.onClick"
        class="flex items-center justify-center gap-2 px-4 py-2 text-md rounded-lg cursor-pointer transition duration-50 ease-in-out text-dark dark:text-light hover:bg-primary-500 hover:bg-opacity-10 dark:hover:bg-primary-500 dark:hover:bg-opacity-10"
    >
        <div v-if="props.iconPosition === 'left'">
            <i :class="props.icon"></i>
        </div>
        <span>{{ props.text }}</span>
        <div v-if="props.iconPosition === 'right'">
            <i :class="props.icon"></i>
        </div>
    </button>
</template>