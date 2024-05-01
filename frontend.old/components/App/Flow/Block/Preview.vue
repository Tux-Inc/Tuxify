<!--
File Name: Preview.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This component is the preview of the flow block

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
import { IBlockPreviewProps } from "~/types/IBlockPreviewProps";

const block: IBlockPreviewProps = defineProps<IBlockPreviewProps>();
</script>
<template>
    <div
        class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-lg py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
    >
        <div class="flex justify-between flex-wrap md:flex-nowrap">
            <div class="flex gap-1 items-center justify-start">
                <UTooltip :text="block.service.title">
                    <img
                        :src="block.service.image"
                        class="w-3 h-3 mx-auto text-primary"
                        alt="icon"
                    />
                </UTooltip>
                <span class="text-md font-bold text-dark dark:text-light">{{
                    block.title
                }}</span>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <span class="text-sm text-dark dark:text-light">{{
                block.description
            }}</span>
        </div>
    </div>
</template>
