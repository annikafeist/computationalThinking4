<script setup lang="ts">
const props = defineProps<{ text: TextBox }>()
const { camera } = useBoard()

const CORNER = 'size-2.5 border border-sky-500 bg-white'

const handles = {
  'top': 'inset-x-0 top-0 h-2 -translate-y-1/2 cursor-ns-resize',
  'bottom': 'inset-x-0 bottom-0 h-2 translate-y-1/2 cursor-ns-resize',
  'left': 'inset-y-0 left-0 w-2 -translate-x-1/2 cursor-ew-resize',
  'right': 'inset-y-0 right-0 w-2 translate-x-1/2 cursor-ew-resize',
  'top-left': `${CORNER} left-0 top-0 -translate-1/2 cursor-nwse-resize`,
  'top-right': `${CORNER} right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize`,
  'bottom-left': `${CORNER} left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize`,
  'bottom-right': `${CORNER} right-0 bottom-0 translate-1/2 cursor-nwse-resize`
}

// Scales the font size; left/top handles keep the opposite side fixed
function startScale(e: PointerEvent, handle: string) {
  const box = (e.currentTarget as HTMLElement).parentElement!
  const width = box.offsetWidth
  const height = box.offsetHeight
  const start = { ...props.text }
  const hasX = /left|right/.test(handle)
  const hasY = /top|bottom/.test(handle)

  pointerDrag(e, (dx, dy) => {
    dx /= camera.value.zoom
    dy /= camera.value.zoom
    const fx = (width + (handle.includes('left') ? -dx : dx)) / width
    const fy = (height + (handle.includes('top') ? -dy : dy)) / height
    const factor = hasX && hasY ? Math.max(fx, fy) : hasX ? fx : fy
    props.text.fontSize = Math.max(8, start.fontSize * factor)
    const scale = props.text.fontSize / start.fontSize
    if (handle.includes('left')) props.text.x = start.x + width * (1 - scale)
    if (handle.includes('top')) props.text.y = start.y + height * (1 - scale)
  })
}
</script>

<template>
  <div
    v-for="(cls, handle) in handles"
    :key="handle"
    class="absolute"
    :class="cls"
    @pointerdown.stop="startScale($event, handle)"
  />
</template>
