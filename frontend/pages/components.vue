<!--
File Name: components.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopez, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: This file is the oauth page

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
definePageMeta({
    layout: "navigation",
});
</script>

<template>
    <div>
        <div class="flex items-center justify-start gap-4 mb-16">
            <h1 class="text-3xl font-bold text-dark dark:text-light">
                Design System - Components
            </h1>
        </div>
        <div class="flex flex-col">
            <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">
                Buttons
            </h2>
            <div class="flex flex-col gap-2">
                <UButton>Button</UButton>
                <UButton loading>Button</UButton>
                <UButton
                    icon="i-heroicons-pencil-square"
                    size="sm"
                    color="primary"
                    variant="solid"
                    label="Button"
                    :trailing="false"
                />
                <UButton color="white" variant="solid">Button</UButton>
                <UButton color="gray" variant="solid">Button</UButton>
                <UButtonGroup size="sm" orientation="horizontal">
                    <UButton label="Action" color="white" />
                    <UButton
                        icon="i-heroicons-chevron-down-20-solid"
                        color="gray"
                    />
                </UButtonGroup>
                <UButton label="Button" color="gray">
                    <template #leading>
                        <UAvatar
                            src="https://avatars.githubusercontent.com/u/739984?v=4"
                            size="3xs"
                        />
                    </template>
                </UButton>
                <UButton label="Button" color="gray">
                    <template #trailing>
                        <UIcon name="i-heroicons-arrow-right-20-solid" />
                    </template>
                </UButton>
            </div>
        </div>
        <div class="flex flex-col mt-24">
            <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">
                Links
            </h2>
            <div class="flex flex-col gap-2">
                <UButton to="https://tuxify.fr" target="_blank" variant="ghost">
                    Link
                </UButton>
            </div>
        </div>
        <div class="flex flex-col mt-24">
            <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">
                Navbar
            </h2>
            <div class="flex flex-col gap-2">
                <Navbar></Navbar>
            </div>
        </div>
        <div class="flex flex-col mt-24">
            <h2 class="text-2xl font-bold mb-8 text-dark dark:text-light">
                Sidebar
            </h2>
            <div class="flex flex-col gap-2"></div>
        </div>
    </div>
</template>
