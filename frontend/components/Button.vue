<script setup lang="ts">
import {IButtonProps} from "../types/IButtonProps";
const props = withDefaults(defineProps<IButtonProps>(), {
    text: 'Button',
    type: 'primary',
    outlined: false,
    size: 'medium',
    state: 'idle',
    iconPosition: 'left',
    tooltip: '',
    onClick: () => console.log('Default click handler'),
});

let isHovering = ref(false);

const buttonFilledTypeStyleMap = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    danger: 'bg-red-500 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-700 text-white',
    success: 'bg-green-500 hover:bg-green-700 text-white',
    info: 'bg-blue-500 hover:bg-blue-700 text-white',
}

const buttonOutlinedTypeStyleMap = {
    primary: 'border border-primary-500 hover:bg-primary-100 text-primary-500 dark:hover:bg-primary-500 dark:hover:text-light',
    secondary: 'border border-secondary-500 hover:bg-secondary-100 text-secondary-500 dark:hover:bg-secondary-500 dark:hover:text-light',
    danger: 'border border-red-500 hover:bg-red-100 text-red-500 dark:hover:bg-red-500 dark:hover:text-light',
    warning: 'border border-yellow-500 hover:bg-yellow-100 text-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-light',
    success: 'border border-green-500 hover:bg-green-100 text-green-500 dark:hover:bg-green-500 dark:hover:text-light',
    info: 'border border-blue-500 hover:bg-blue-100 text-blue-500 dark:hover:bg-blue-500 dark:hover:text-light',
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
          class="relative flex items-center justify-start gap-2 rounded-lg cursor-pointer transition duration-50 ease-in-out"
          :class="(props.outlined ? buttonOutlinedTypeStyleMap[props.type] : buttonFilledTypeStyleMap[props.type]) + ' ' + buttonSizeStyleMap[props.size] + ' ' + buttonStateStyleMap[props.state] + ' ' + props.customClass"
          :disabled="props.state !== 'idle'"
          :text="props.text"
          type="button"
          @pointerenter="isHovering = true"
          @pointerleave="isHovering = false"
  >
      <div v-if="props.iconPosition === 'left'">
          <i v-if="props.state !== 'loading'" :class="props.icon"></i>
          <i v-else :class="iconStateStyleMap[props.state]"></i>
      </div>
      {{ props.text }}
      <div v-if="props.iconPosition === 'right'">
          <i v-if="props.state !== 'loading'" :class="props.icon"></i>
          <i v-else :class="iconStateStyleMap[props.state]"></i>
      </div>
      <Tooltip :text="props.tooltip" :isVisible="isHovering" />
  </button>
</template>