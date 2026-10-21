<script setup lang="ts">
defineProps<{ active: boolean }>()
</script>

<template>
  <button
    class="flex size-12 items-center justify-center rounded-xl font-serif text-2xl text-slate-700 hover:bg-slate-100"
    :class="active && 'bg-slate-200 hover:bg-slate-200'"
  >
    <slot />
  </button>
</template>
