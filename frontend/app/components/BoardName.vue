<script setup lang="ts">
const props = defineProps<{ name: string; autoEdit?: boolean }>()
const emit = defineEmits<{ rename: [name: string] }>()

const editing = ref(false)
const input = useTemplateRef<HTMLInputElement>('input')

async function startEditing() {
  editing.value = true
  await nextTick()
  input.value?.focus()
  input.value?.select()
}

// Like renaming a file in Finder: Enter or clicking elsewhere saves, Escape keeps the old name.
// An empty name is never saved.
function finish(save: boolean) {
  if (!editing.value) return
  const name = input.value!.value.trim()
  editing.value = false
  if (save && name && name !== props.name) emit('rename', name)
}

watch(() => props.autoEdit, autoEdit => autoEdit && startEditing(), { immediate: true })
</script>

<template>
  <input
    v-if="editing"
    ref="input"
    class="min-w-0 rounded-sm bg-white px-1 outline-2 outline-blue-500"
    :value="name"
    @keydown.enter="finish(true)"
    @keydown.escape="finish(false)"
    @blur="finish(true)"
  >
  <span v-else class="truncate px-1 select-none" @dblclick="startEditing">{{ name }}</span>
</template>
