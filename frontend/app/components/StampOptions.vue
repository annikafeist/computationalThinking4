<script setup lang="ts">
const { stamp } = useTools()
</script>

<template>
  <div class="flex items-center gap-1 rounded-xl bg-white p-2 shadow-lg">
    <button
      v-for="emoji in STAMPS"
      :key="emoji"
      class="flex size-9 items-center justify-center rounded-lg text-xl hover:bg-slate-100"
      :class="stamp === emoji && 'bg-slate-200 hover:bg-slate-200'"
      @click="stamp = emoji"
    >
      {{ emoji }}
    </button>
  </div>
</template>
