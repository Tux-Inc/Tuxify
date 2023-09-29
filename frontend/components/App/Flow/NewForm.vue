<script setup lang="ts">
</script>

<template>
    <div class="p-4">
        <div class="flex flex-row items-center justify-start gap-2">
            <UIcon name="i-heroicons-link" class="text-sm text-primary font-bold text-dark dark:text-light" />
            <h1 class="text-sm text-primary font-bold text-dark dark:text-light">New flow</h1>
        </div>
      <UForm class="flex flex-col gap-4 mt-4">
          <UFormGroup label="Name" description="The name of the flow">
              <UInput placeholder="My flow" />
          </UFormGroup>
          <UFormGroup label="Enabled" description="Enable flow by default">
              <UToggle />
          </UFormGroup>
          <div class="flex flex-row items-center justify-end gap-4">
              <UButton color="primary" variant="solid">Create flow</UButton>
          </div>
      </UForm>
    </div>
</template>