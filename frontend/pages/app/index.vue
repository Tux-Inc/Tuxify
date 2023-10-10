<script setup lang="ts">
definePageMeta({
    layout: "app-navigation",
});
let loading = ref(false);

function setLoading() {
    loading.value = !loading.value;
}
</script>

<template>
    <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-4xl font-bold text-dark dark:text-light">Home</h1>
        <UButton @click="setLoading" :loading="loading" color="primary" variant="solid">Toggle loading</UButton>
    </div>
</template>
