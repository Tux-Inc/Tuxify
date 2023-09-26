<script setup lang="ts">
</script>

<template>
  <div class="sticky z-50 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-var(--header-height))]">
    <UContainer class="flex flex-col items-start justify-between h-full py-2">
      <div class="flex flex-col items-start justify-start gap-2 w-full">
          <UButton to="/app/flow" size="lg" icon="i-heroicons-link" color="gray" variant="ghost">Flows</UButton>
          <UButton to="/app/flow/new" size="lg" icon="i-heroicons-plus" color="gray" variant="ghost">New Flow</UButton>
          <UButton to="/components" size="lg" icon="i-heroicons-cube" color="gray" variant="ghost">Components</UButton>
      </div>
      <div class="flex flex-col items-start justify-center gap-4 w-full">
          <UButton to="/app/settings" size="lg" icon="i-heroicons-cog-8-tooth" color="gray" variant="ghost">Settings</UButton>
      </div>
    </UContainer>
  </div>
</template>