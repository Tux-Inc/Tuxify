<script setup lang="ts">
const items = [{
    label: "Last execution stack backtrace",
    icon: "i-heroicons-code-bracket-square",
    defaultOpen: false,
    slot: "stack-backtrace",
    color: "primary",
}]

const sampleTrace = `
Traceback (most recent call last):\n
  File "main.py", line 1, in <module>\n
    print("Hello, World!")\n
    Traceback (most recent call last):\n
`

</script>
<template>
    <UAccordion :items="items">
        <template #stack-backtrace>
            <div class="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                <span class="text-sm font-bold text-dark dark:text-light">Live trace</span>
                <code class="text-xs text-gray-500 dark:text-gray-400">
                    {{ sampleTrace }}
                </code>
            </div>
        </template>
    </UAccordion>
</template>