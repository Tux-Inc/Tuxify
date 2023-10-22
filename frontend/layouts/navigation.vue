<!--
File Name: index.client.vue
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
import BurgerMenu from "~/components/App/AppBurgerMenu.vue";

const isOpen = ref(false);

const setOpened = () => (isOpen.value = !isOpen.value);

const { isMobile } = useDevice();
</script>

<template>
    <div class="antialiased relative min-h-screen bg-gray-50 dark:bg-base-dark">
        <Head>
            <Title>Tuxify Main Page</Title>
            <Meta name="description" content="Put your description here." />
        </Head>
        <NuxtImg
            alt="hero"
            src="/hero.webp"
            class="dark:hidden sm:w-screen md:w-[calc(100vh-var(--header-weight))] md:mx-auto inset-0 h-[20rem] left-0 overflow-hidden absolute object-fit"
        />
        <NuxtImg
            alt="hero"
            src="/hero-dark.webp"
            class="hidden dark:block sm:w-screen md:w-[calc(100vh-var(--header-weight))] md:mx-auto inset-0 h-[20rem] left-0 overflow-hidden absolute object-fit"
        />
        <div v-if="!isMobile">
            <Navbar :isOpen="isOpen" @setOpened="setOpened" />
        </div>
        <div v-else>
            <BurgerMenu :isOpen="isOpen" @setOpened="setOpened" />
        </div>
        <div
            class="min-h-[calc(100vh-var(--header-height))] mx-auto px-4 md:px-6 lg:px-8 max-w-7xl"
        >
            <slot />
        </div>
        <Footer />
    </div>
</template>
