<!--
File Name: MobileNavigationButton.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the component for the mobile navigation button.

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
import { IButtonLinkProps } from "~/types/IButtonLinkProps";

const props = withDefaults(defineProps<IButtonLinkProps>(), {
    text: "",
    iconPosition: "left",
    size: "medium",
    onClick: () => {
        console.log("Default link click handler");
    },
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
