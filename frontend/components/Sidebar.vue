<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-start justify-between min-h-[calc(100vh-52px)] p-2 bg-light dark:bg-tint-dark">
    <div class="flex flex-col items-start justify-center gap-4">
        <ButtonLink text="Home" icon="bx bx-home" :onClick="() => console.log('Home link clicked')"></ButtonLink>
        <ButtonLink text="Components" icon="bx bx-cog" :onClick="() => console.log('Components link clicked')"></ButtonLink>
        <ButtonLink text="About" icon="bx bx-info-circle" :onClick="() => console.log('About link clicked')"></ButtonLink>
    </div>
    <div class="flex flex-col items-start justify-center gap-4">
        <ButtonLink text="Sign in" icon="bx bx-log-in" :onClick="() => console.log('Sign in link clicked')"></ButtonLink>
        <ButtonLink text="Sign up" icon="bx bx-user-plus" :onClick="() => console.log('Sign up link clicked')"></ButtonLink>
    </div>
  </div>
</template>