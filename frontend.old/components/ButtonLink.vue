<!--
File Name: ButtonLink.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for button link

Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
-->

<script setup lang="ts">
import { IButtonLinkProps } from "../types/IButtonLinkProps";

const props = withDefaults(defineProps<IButtonLinkProps>(), {
    text: "",
    iconPosition: "left",
    size: "medium",
    tooltip: "",
    onClick: () => console.log("Default link click handler"),
});

const buttonSizeStyleMap = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-md",
    large: "px-6 py-3 text-lg",
};
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
