<template>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-4xl font-bold text-dark dark:text-light">Home</h1>
      <Button type="primary" text="New flow" icon="bx bx-plus" :onClick="setLoading" :state="loading ? 'idle' : 'loading'"></Button>
    </div>
</template>

<script setup lang="ts">
let loading = ref(false)
function setLoading() {
  loading.value = !loading.value
}
</script>