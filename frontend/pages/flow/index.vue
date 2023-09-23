<template>
    <div>
      <div class="flex items-center justify-between gap-4">
        <h1 class="text-4xl font-bold text-dark dark:text-light">Flows</h1>
        <Button type="primary" text="New flow" icon="bx bx-plus" :onClick="setLoading" :state="loading ? 'idle' : 'loading'"></Button>
      </div>
      <div class="w-full mt-4">
        <Graph />
      </div>
    </div>
</template>

<script setup lang="ts">
let loading = ref(false)
function setLoading() {
  loading.value = !loading.value
}
</script>