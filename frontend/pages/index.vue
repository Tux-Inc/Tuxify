<template>
  <div>
    <Button type="info" text="Click me" icon="bx bx-user" :onClick="setLoading" :state="loading ? 'idle' : 'loading'"></Button>
  </div>
</template>

<script setup lang="ts">
let loading = ref(false)
function setLoading() {
  loading.value = !loading.value
}
</script>