<script setup lang="ts">
import { ArrowLeft as ArrowLeftIcon, ChevronDown as ChevronDownIcon, Plus as PlusIcon } from '@lucide/vue'

const props = defineProps<{ boardId: string }>()
const { boards, newBoardId, load, createBoard, renameBoard } = useBoards()
onMounted(load)

// A board that was just created opens with its name ready to type.
const autoEdit = newBoardId.value === props.boardId
newBoardId.value = null

const current = computed(() => boards.value.find(board => board.id === props.boardId))
const open = ref(false)

const ITEM_CLASS = 'flex w-full items-center gap-2 truncate rounded-lg px-3 py-2 text-left text-sm hover:bg-muted'
</script>

<template>
  <div class="fixed top-4 left-4">
    <div class="flex h-10 items-center gap-1 rounded-xl border bg-white pl-2 pr-1 shadow-md">
      <BoardName
        v-if="current"
        class="max-w-60 font-medium"
        :name="current.name"
        :auto-edit="autoEdit"
        @rename="name => renameBoard(boardId, name)"
      />
      <button class="flex size-8 items-center justify-center rounded-lg hover:bg-muted" aria-label="Show all boards" @click="open = !open">
        <ChevronDownIcon class="size-4" />
      </button>
    </div>

    <template v-if="open">
      <!-- Clicking anywhere outside the list closes it. -->
      <div class="fixed inset-0" @click="open = false" />
      <nav class="relative mt-2 max-h-[70vh] w-64 overflow-y-auto rounded-xl border bg-white p-1 shadow-xl" @click="open = false">
        <NuxtLink to="/" :class="ITEM_CLASS"><ArrowLeftIcon class="size-4" /> Alle Boards</NuxtLink>
        <div class="my-1 h-px bg-border" />
        <NuxtLink
          v-for="board in boards"
          :key="board.id"
          :to="`/boards/${board.id}`"
          :class="[ITEM_CLASS, board.id === boardId && 'bg-muted font-medium']"
        >
          {{ board.name }}
        </NuxtLink>
        <div class="my-1 h-px bg-border" />
        <button :class="ITEM_CLASS" @click="createBoard"><PlusIcon class="size-4" /> Neues Board</button>
      </nav>
    </template>
  </div>
</template>
