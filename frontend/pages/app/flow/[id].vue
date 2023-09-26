<script setup lang="ts">
definePageMeta({
    layout: 'app-navigation'
})
let loading = ref(false)
function setLoading() {
    loading.value = !loading.value
}
</script>

<template>
    <div>
        <div class="flex items-center justify-between gap-4">
            <h1 class="text-4xl font-bold text-dark dark:text-light">Flow [NAME]</h1>
            <UButton @click="setLoading" :loading="loading" color="primary" variant="solid">Toggle loading</UButton>
        </div>
        <div class="w-full mt-4">
            <Graph />
        </div>
    </div>
</template>

