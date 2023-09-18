<script setup lang="ts">
import {IButtonProps} from "../types/IButtonProps";
const props = defineProps<IButtonProps>();
</script>

<template>
  <div @click.prevent="props.onClick" class="flex items-center space-between bg-blue-500 text-white rounded-md p-2 cursor-pointer hover:bg-blue-600 gap-2">
      <div>
        <i :class="props.icon" class="text-2xl"></i>
      </div>
      <div>
          {{props.text}}
      </div>
  </div>
</template>