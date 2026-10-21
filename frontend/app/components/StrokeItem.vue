<script setup lang="ts">
const props = defineProps<{ stroke: Stroke }>()
const { isSelected, startMove } = useBoardItem(props.stroke)
const { tool } = useTools()

const points = computed(() => props.stroke.points.join(' '))
</script>

<template>
  <g :transform="`translate(${stroke.x} ${stroke.y})`" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <polyline v-if="isSelected" :points="points" stroke="#0ea5e9" :stroke-width="stroke.width + 6" />
    <polyline
      :points="points"
      :stroke="stroke.color"
      :stroke-width="stroke.width"
      :stroke-opacity="stroke.opacity"
      class="cursor-move"
      :style="{ pointerEvents: tool === 'select' ? 'visibleStroke' : 'none' }"
      @pointerdown.stop="startMove"
    />
  </g>
</template>
