<script setup lang="ts">
const { newColor, selectedId, editingId } = useBoard()
const { tool } = useTools()

const tools: { id: Tool, icon: string, title: string }[] = [
  { id: 'pen', icon: '✏️', title: 'Zeichnen' },
  { id: 'text', icon: 'T', title: 'Textfeld (Klick zum Platzieren)' },
  { id: 'stamp', icon: '👍', title: 'Stempel' }
]

function selectTool(id: Tool) {
  tool.value = id
  selectedId.value = null
  editingId.value = null
}

function onDragStart(e: DragEvent) {
  e.dataTransfer?.setData('text/plain', 'note')
}
</script>

<template>
  <div class="fixed bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
    <PenOptions v-if="tool === 'pen'" />
    <StampOptions v-if="tool === 'stamp'" />
    <div class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-lg">
      <TaskBarButton :active="tool === 'select'" title="Auswählen" @click="selectTool('select')">↖</TaskBarButton>
      <div
        draggable="true"
        class="size-14 cursor-grab shadow-sm"
        :style="{ backgroundColor: newColor }"
        title="Post-it auf den Canvas ziehen"
        @dragstart="onDragStart"
      />
      <div class="grid grid-cols-3 gap-1.5">
        <button
          v-for="color in COLORS"
          :key="color"
          class="size-5 rounded-full border"
          :class="newColor === color ? 'border-slate-700' : 'border-slate-200'"
          :style="{ backgroundColor: color }"
          @click="newColor = color"
        />
      </div>
      <div class="h-10 w-px bg-slate-200" />
      <TaskBarButton
        v-for="t in tools"
        :key="t.id"
        :active="tool === t.id"
        :title="t.title"
        @click="selectTool(t.id)"
      >
        {{ t.icon }}
      </TaskBarButton>
    </div>
  </div>
</template>
