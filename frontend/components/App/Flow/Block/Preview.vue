<script setup lang="ts">
import { IBlockPreviewProps } from "~/types/IBlockPreviewProps";
const block: IBlockPreviewProps = defineProps<IBlockPreviewProps>();

</script>
<template>
    <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-800 rounded-lg py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
        <div class="flex justify-between flex-wrap md:flex-nowrap">
            <div class="flex gap-1 items-center justify-start">
                <UTooltip :text="block.service.title">
                    <img :src="block.service.image" class="w-3 h-3 mx-auto text-primary"  alt="icon" />
                </UTooltip>
                <span class="text-md font-bold text-dark dark:text-light">{{ block.title }}</span>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <span class="text-sm text-dark dark:text-light">{{ block.description }}</span>
        </div>
    </div>
</template>