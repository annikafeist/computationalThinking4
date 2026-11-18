<script setup lang="ts">
import { Plus as PlusIcon, Trash2 as TrashIcon } from '@lucide/vue'
import type { Board } from '~/types/board'

// The start page: every board as a tile. The tile opens the board, the name below it can be renamed.
const { boards, load, createBoard, renameBoard, deleteBoard } = useBoards()
await load()

function confirmDelete(board: Board) {
  if (confirm(`„${board.name}“ wirklich löschen? Alle Objekte darauf gehen verloren.`)) deleteBoard(board.id)
}
</script>

<template>
  <main class="min-h-screen bg-muted/40 px-6 py-10">
    <div class="mx-auto max-w-5xl">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Boards</h1>
        <Button @click="createBoard"><PlusIcon /> Neues Board</Button>
      </div>

      <p v-if="!boards.length" class="text-muted-foreground">Noch keine Boards. Leg mit „Neues Board“ das erste an.</p>

      <ul class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-6">
        <li v-for="board in boards" :key="board.id" class="group relative">
          <NuxtLink
            :to="`/boards/${board.id}`"
            class="block aspect-4/3 rounded-xl border bg-white bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] bg-size-[16px_16px] shadow-sm transition-shadow hover:shadow-md"
            :aria-label="`Open ${board.name}`"
          />
          <button
            class="absolute top-2 right-2 hidden size-8 items-center justify-center rounded-lg border bg-white text-muted-foreground shadow-sm group-hover:flex hover:text-destructive"
            :aria-label="`Delete ${board.name}`"
            @click="confirmDelete(board)"
          >
            <TrashIcon class="size-4" />
          </button>
          <BoardName class="mt-2 block w-full text-sm font-medium" :name="board.name" @rename="name => renameBoard(board.id, name)" />
        </li>
      </ul>
    </div>
  </main>
</template>
