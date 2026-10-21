<script setup lang="ts">
const props = defineProps<{ note: Note }>()
const { camera } = useBoard()

const MIN = GRID * 4

const edges = {
  top: 'inset-x-0 top-0 h-2 -translate-y-1/2 cursor-ns-resize',
  bottom: 'inset-x-0 bottom-0 h-2 translate-y-1/2 cursor-ns-resize',
  left: 'inset-y-0 left-0 w-2 -translate-x-1/2 cursor-ew-resize',
  right: 'inset-y-0 right-0 w-2 translate-x-1/2 cursor-ew-resize'
}

function startResize(e: PointerEvent, edge: keyof typeof edges) {
  const start = { ...props.note }
  const right = start.x + start.width
  const bottom = start.y + start.height

  pointerDrag(e, (dx, dy) => {
    dx /= camera.value.zoom
    dy /= camera.value.zoom
    if (edge === 'right') props.note.width = Math.max(MIN, snap(start.width + dx))
    if (edge === 'bottom') props.note.height = Math.max(MIN, snap(start.height + dy))
    // Left/top edges move the position while the opposite edge stays fixed
    if (edge === 'left') {
      props.note.x = Math.min(right - MIN, snap(start.x + dx))
      props.note.width = right - props.note.x
    }
    if (edge === 'top') {
      props.note.y = Math.min(bottom - MIN, snap(start.y + dy))
      props.note.height = bottom - props.note.y
    }
  })
}
</script>

<template>
  <div
    v-for="(cls, edge) in edges"
    :key="edge"
    class="absolute"
    :class="cls"
    @pointerdown.stop="startResize($event, edge)"
  />
</template>
