<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'

const props = defineProps<{ text: TextBox }>()
const { isSelected, isEditing, startMove, startEdit } = useBoardItem(props.text)
const editor = useItemEditor(props.text, isEditing)
</script>

<template>
  <div
    class="absolute w-max min-w-10 px-1 leading-snug text-slate-800"
    :class="[isSelected && 'outline-2 outline-sky-500', isEditing ? 'cursor-text' : 'cursor-move select-none']"
    :style="{ left: `${text.x}px`, top: `${text.y}px`, fontSize: `${text.fontSize}px` }"
    @pointerdown.stop="startMove"
    @dblclick="startEdit"
  >
    <EditorContent :editor="editor" />
    <TextScaleHandles v-if="isSelected" :text="text" />
    <NoteToolbar v-if="isSelected && editor" :editor="editor" />
  </div>
</template>
