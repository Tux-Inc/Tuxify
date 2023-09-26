<script setup lang="ts">
</script>

<template>
  <div class="fixed w-[--sidebar-width] top-[--header-height] z-50 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-var(--header-height))] bg-base-light/75 dark:bg-base-dark/75 dark:bg-opacity-60 backdrop-blur">
    <UContainer class="flex flex-col items-start justify-between h-full py-2">
      <div class="flex flex-col items-start justify-start gap-2 w-full">
          <UButton to="/app/flows/new" size="lg" icon="i-heroicons-plus" color="primary" variant="solid">New Flow</UButton>
          <UButton to="/app/flows" size="lg" icon="i-heroicons-link" color="gray" variant="ghost">Flows</UButton>
          <UButton to="/components" size="lg" icon="i-heroicons-cube" color="gray" variant="ghost">Components</UButton>
      </div>
      <div class="flex flex-col items-start justify-center gap-4 w-full">
          <UButton to="/app/settings" size="lg" icon="i-heroicons-cog-8-tooth" color="gray" variant="ghost">Settings</UButton>
      </div>
    </UContainer>
  </div>
</template>