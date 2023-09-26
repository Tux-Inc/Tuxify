<script setup lang="ts">
definePageMeta({
    layout: 'app-navigation',
})
let isLoading = ref(false)
function signOut() {
    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
    }, 1000)
}
</script>
<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-4xl font-bold text-dark dark:text-light">Settings</h1>
        </div>
        <div class="flex flex-col gap-4 mt-14">
            <span class="text-dark dark:text-light font-bold text-2xl">My account</span>
            <div class="flex items-center gap-2">
                <img src="/avatar/3.png" class="rounded-full h-20"/>
                <div class="flex flex-col">
                    <span class="text-dark dark:text-light font-bold text-xl">John Doe</span>
                    <span class="text-dark dark:text-light">Basic user</span>
                </div>
            </div>
            <div>
                <UButton icon="i-heroicons-arrow-left-on-rectangle" color="red" variant="solid" @click="signOut" :loading="isLoading">Sign out</UButton>
            </div>
        </div>
    </div>
</template>
