<script setup lang="ts">
const props = defineProps<{ stamp: Stamp }>()
const { isSelected, startMove } = useBoardItem(props.stamp)
</script>

<template>
  <div
    class="absolute flex size-10 -translate-1/2 cursor-move select-none items-center justify-center rounded-full text-3xl"
    :class="isSelected && 'ring-2 ring-sky-500'"
    :style="{ left: `${stamp.x}px`, top: `${stamp.y}px` }"
    @pointerdown.stop="startMove"
  >
    {{ stamp.emoji }}
  </div>
</template>
