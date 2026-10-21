<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'

const props = defineProps<{ note: Note }>()
const { isSelected, isEditing, startMove, startEdit } = useBoardItem(props.note)
const editor = useItemEditor(props.note, isEditing)
</script>

<template>
  <div
    class="absolute shadow-md"
    :class="[isSelected && 'ring-2 ring-sky-500', isEditing ? 'cursor-text' : 'cursor-move select-none']"
    :style="{
      left: `${note.x}px`, top: `${note.y}px`, width: `${note.width}px`, height: `${note.height}px`,
      backgroundColor: note.color
    }"
    @pointerdown.stop="startMove"
    @dblclick="startEdit"
  >
    <EditorContent :editor="editor" class="size-full overflow-hidden p-3 text-sm text-slate-800" />
    <NoteResizeHandles :note="note" />
    <NoteToolbar v-if="isSelected && editor" :note="note" :editor="editor" />
  </div>
</template>
