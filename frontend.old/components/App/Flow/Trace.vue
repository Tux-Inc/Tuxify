<!--
File Name: Trace.vue
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Component for trace

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
const items = [
    {
        label: "Last execution stack backtrace",
        icon: "i-heroicons-code-bracket-square",
        defaultOpen: false,
        slot: "stack-backtrace",
        color: "primary",
    },
];

const sampleTrace = `
Traceback (most recent call last):\n
  File "main.py", line 1, in <module>\n
    print("Hello, World!")\n
    Traceback (most recent call last):\n
`;
</script>
<template>
    <UAccordion :items="items">
        <template #stack-backtrace>
            <div
                class="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto"
            >
                <span class="text-sm font-bold text-dark dark:text-light"
                    >Live trace</span
                >
                <code class="text-xs text-gray-500 dark:text-gray-400">
                    {{ sampleTrace }}
                </code>
            </div>
        </template>
    </UAccordion>
</template>
