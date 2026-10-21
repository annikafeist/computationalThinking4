<script setup lang="ts">
const { brush, penColor } = useTools()
</script>

<template>
  <div class="flex items-center gap-1 rounded-xl bg-white p-2 text-xs text-slate-700 shadow-lg">
    <button
      v-for="(b, id) in BRUSHES"
      :key="id"
      class="rounded px-2 py-1 hover:bg-slate-100"
      :class="brush === id && 'bg-slate-200 hover:bg-slate-200'"
      @click="brush = id"
    >
      {{ b.label }}
    </button>
    <template v-if="brush !== 'eraser'">
      <div class="mx-1 h-5 w-px bg-slate-200" />
      <button
        v-for="color in PEN_COLORS"
        :key="color"
        class="size-5 rounded-full border-2"
        :class="penColor === color ? 'border-slate-400' : 'border-white'"
        :style="{ backgroundColor: color }"
        @click="penColor = color"
      />
    </template>
  </div>
</template>
