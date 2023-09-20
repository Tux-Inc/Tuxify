<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-start justify-between min-h-[calc(100vh-85px)] px-2 py-4">
    <div class="flex flex-col items-start justify-center gap-4 w-full">
        <Button custom-class="w-full" type="primary" text="New flow" icon="bx bx-plus"></Button>
        <ButtonLink custom-class="w-full" text="Home" icon="bx bx-home" :onClick="() => navigateTo('/')"></ButtonLink>
        <ButtonLink custom-class="w-full" text="Flows" icon="bx bx-link" :onClick="() => navigateTo('/flow')"></ButtonLink>
        <ButtonLink custom-class="w-full" text="About" icon="bx bx-info-circle" :onClick="() => navigateTo('/about')"></ButtonLink>
    </div>
    <div class="flex flex-col items-start justify-center gap-4 w-full">
        <ButtonLink custom-class="w-full" text="Components" icon="bx bx-cog" :onClick="() => navigateTo('/components')"></ButtonLink>
        <ButtonLink custom-class="w-full" text="Settings" icon="bx bx-cog" :onClick="() => navigateTo('/settings')"></ButtonLink>
    </div>
  </div>
</template>