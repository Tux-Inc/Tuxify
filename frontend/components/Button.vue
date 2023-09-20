<script setup lang="ts">
import {IButtonProps} from "../types/IButtonProps";
const props = withDefaults(defineProps<IButtonProps>(), {
    text: 'Button',
    type: 'primary',
    size: 'medium',
    state: 'idle',
    icon: 'bx bx-info-circle',
    iconPosition: 'left',
    onClick: () => console.log('Default click handler'),
});

const buttonTypeStyleMap = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
    tertiary: 'bg-gray-300 hover:bg-gray-400 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-700 text-white',
    success: 'bg-green-500 hover:bg-green-700 text-white',
    info: 'bg-blue-500 hover:bg-blue-700 text-white',
}

const buttonSizeStyleMap = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-md',
    large: 'px-6 py-3 text-lg',
}

const iconStateStyleMap = {
    idle: '',
    loading: 'bx bx-loader-alt animate-spin',
    disabled: '',
}

const buttonStateStyleMap = {
    idle: '',
    loading: 'cursor-not-allowed opacity-50',
    disabled: 'cursor-not-allowed opacity-50',
}

</script>

<template>
  <button
          @click.prevent="props.onClick"
          class="flex items-center justify-center gap-2 rounded-lg cursor-pointer transition duration-50 ease-in-out"
          :class="buttonTypeStyleMap[props.type] + ' ' + buttonSizeStyleMap[props.size] + ' ' + buttonStateStyleMap[props.state]"
          :disabled="props.state !== 'idle'"
          :text="props.text"
          type="button"
  >
      <div v-if="props.iconPosition === 'left'">
          <i v-if="props.state !== 'loading'" :class="props.icon"></i>
          <i v-else :class="iconStateStyleMap[props.state]"></i>
      </div>
      <span>{{ props.text }}</span>
      <div v-if="props.iconPosition === 'right'">
          <i v-if="props.state !== 'loading'" :class="props.icon"></i>
          <i v-else :class="iconStateStyleMap[props.state]"></i>
      </div>
  </button>
</template>