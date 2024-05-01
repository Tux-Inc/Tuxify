<!--
File Name: Tooltip.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the tooltip component

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
import { ITooltipProps } from "../types/ITooltipProps";
const props = withDefaults(defineProps<ITooltipProps>(), {
    text: "",
    isVisible: false,
    position: "bottom",
    customClass: "",
});

const tooltipPositionStyleMap = {
    bottom: "tooltip-bottom mt-1",
    top: "tooltip-top mb-1",
    left: "tooltip-left mr-1",
    right: "tooltip-right ml-1",
};
</script>

<style scoped>
.tooltip-bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
}

.tooltip-top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
}

.tooltip-left {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
}

.tooltip-right {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
}
</style>

<template>
    <Transition name="fade">
        <div
            v-if="text != ''"
            v-show="isVisible"
            class="hidden md:block absolute z-10 inline-block px-3 py-2 text-sm font-medium text-light transition-opacity duration-300 bg-dark rounded-lg shadow-sm dark:bg-light dark:text-dark"
            :class="tooltipPositionStyleMap[position] + ' ' + customClass"
        >
            {{ props.text }}
        </div>
    </Transition>
</template>
