<script setup lang="ts">
import {ITooltipProps} from "../types/ITooltipProps";
const props = withDefaults(defineProps<ITooltipProps>(), {
    text: '',
    isVisible: false,
    position: 'bottom',
    customClass: '',
});

const tooltipPositionStyleMap = {
    bottom: 'tooltip-bottom mt-1',
    top: 'tooltip-top mb-1',
    left: 'tooltip-left mr-1',
    right: 'tooltip-right ml-1',
}
</script>

<style scoped>
.tooltip-bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
}

.tooltip-top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
}

.tooltip-left {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
}

.tooltip-right {
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
}
</style>

<template>
  <Transition name="fade">
      <div
              v-if="text != ''"
              v-show="isVisible"
              class="hidden md:block absolute z-10 inline-block px-3 py-2 text-sm font-medium text-light transition-opacity duration-300 bg-dark rounded-lg shadow-sm dark:bg-light dark:text-dark"
              :class="tooltipPositionStyleMap[position] + ' ' + customClass"
      >
          {{ props.text }}
      </div>
  </Transition>
</template>
