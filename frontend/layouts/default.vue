<template>
    <div class="min-h-screen custom-bg md:p-2">
        <div class="h-full md:rounded-lg md:p-2 bg-light dark:bg-dark shadow-lg backdrop-blur-lg backdrop-filter bg-opacity-30 dark:bg-opacity-30 md:border md:border-dark md:dark:border-light md:border-opacity-3 md:dark:border-opacity-30">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.custom-bg {
    background-image: url('/bg.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
</style>