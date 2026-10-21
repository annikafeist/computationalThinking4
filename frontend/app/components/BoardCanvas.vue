<script setup lang="ts">
const { notes, texts, strokes, stamps, camera, selectedId, editingId, screenToWorld, addNote, addText, addStamp } = useBoard()
const { tool, stamp } = useTools()
const { startDrawing } = useDrawing()

const cursors = { select: '', pen: 'cursor-crosshair', text: 'cursor-text', stamp: 'cursor-copy' }

let panStart: { x: number, y: number } | null = null

function onPointerDown(e: PointerEvent) {
  if (e.target !== e.currentTarget) return
  selectedId.value = null
  editingId.value = null
  const pos = screenToWorld(e.clientX, e.clientY)
  if (tool.value === 'pen') return startDrawing(e)
  if (tool.value === 'stamp') return addStamp(pos.x, pos.y, stamp.value)
  if (tool.value === 'text') {
    // Keeps the browser from blurring the new text box right after it got focus
    e.preventDefault()
    addText(pos.x, pos.y)
    tool.value = 'select'
    return
  }
  panStart = { x: e.clientX - camera.value.x, y: e.clientY - camera.value.y }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!panStart) return
  camera.value.x = e.clientX - panStart.x
  camera.value.y = e.clientY - panStart.y
}

function onWheel(e: WheelEvent) {
  const { x, y, zoom } = camera.value
  const newZoom = Math.min(3, Math.max(0.2, zoom * Math.exp(-e.deltaY * 0.001)))
  // Zoom towards the cursor: keep the world point under it fixed
  camera.value = {
    x: e.clientX - (e.clientX - x) * (newZoom / zoom),
    y: e.clientY - (e.clientY - y) * (newZoom / zoom),
    zoom: newZoom
  }
}

function onDrop(e: DragEvent) {
  if (e.dataTransfer?.getData('text/plain') !== 'note') return
  const pos = screenToWorld(e.clientX, e.clientY)
  addNote(pos.x - 80, pos.y - 80)
}

const gridStyle = computed(() => {
  const size = GRID * camera.value.zoom
  return {
    backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${camera.value.x - size / 2}px ${camera.value.y - size / 2}px`
  }
})
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden bg-slate-50 touch-none"
    :class="cursors[tool]"
    :style="gridStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="panStart = null"
    @wheel.prevent="onWheel"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <div
      class="absolute left-0 top-0 origin-top-left"
      :class="tool !== 'select' && 'pointer-events-none'"
      :style="{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})` }"
    >
      <StickyNote v-for="note in notes" :key="note.id" :note="note" />
      <TextBoxItem v-for="text in texts" :key="text.id" :text="text" />
      <StampItem v-for="item in stamps" :key="item.id" :stamp="item" />
      <svg class="pointer-events-none absolute left-0 top-0 overflow-visible" width="1" height="1">
        <StrokeItem v-for="stroke in strokes" :key="stroke.id" :stroke="stroke" />
      </svg>
    </div>
  </div>
</template>
