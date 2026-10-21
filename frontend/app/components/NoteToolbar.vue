<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ note?: Note, editor: Editor }>()

const fonts = [
  { label: 'Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Mono', value: 'ui-monospace, monospace' },
  { label: 'Hand', value: '"Comic Sans MS", "Chalkboard SE", cursive' }
]

const weights = [
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Bold', value: '700' }
]

// Formats the marked text, or the whole note if nothing is marked
function format(apply: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) {
  const { from, to, empty } = props.editor.state.selection
  if (!empty) return apply(props.editor.chain()).run()
  apply(props.editor.chain().selectAll()).setTextSelection({ from, to }).run()
}
</script>

<template>
  <div
    class="absolute bottom-full left-0 mb-2 flex items-center gap-1 whitespace-nowrap rounded-lg bg-white p-1 text-xs text-slate-700 shadow-lg"
    @pointerdown.stop
    @mousedown.prevent
  >
    <template v-if="note">
      <button
        v-for="color in COLORS"
        :key="color"
        class="size-5 rounded-full border"
        :class="note.color === color ? 'border-slate-700' : 'border-slate-200'"
        :style="{ backgroundColor: color }"
        @click="note.color = color"
      />
      <div class="mx-1 h-5 w-px bg-slate-200" />
    </template>
    <button
      v-for="font in fonts"
      :key="font.label"
      class="rounded px-1.5 py-0.5 hover:bg-slate-100"
      :style="{ fontFamily: font.value }"
      @click="format(c => c.setFontFamily(font.value))"
    >
      {{ font.label }}
    </button>
    <div class="mx-1 h-5 w-px bg-slate-200" />
    <button
      v-for="weight in weights"
      :key="weight.value"
      class="rounded px-1.5 py-0.5 hover:bg-slate-100"
      :style="{ fontWeight: weight.value }"
      @click="format(c => c.setMark('textStyle', { fontWeight: weight.value }))"
    >
      {{ weight.label }}
    </button>
    <button class="rounded px-1.5 py-0.5 italic hover:bg-slate-100" @click="format(c => c.toggleItalic())">
      Italic
    </button>
  </div>
</template>
