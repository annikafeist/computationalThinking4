import type { Board } from '~/types/board'

const NEW_BOARD_NAME = 'Neues Board'

// The list of all boards, newest first. Every change updates the list right away and then tells the backend.
export function useBoards() {
  const api = $fetch.create({ baseURL: useRuntimeConfig().public.apiBase })
  const boards = useState<Board[]>('boards', () => [])
  // The board that was just created; its name opens straight into editing.
  const newBoardId = useState<string | null>('newBoardId', () => null)

  async function load() {
    boards.value = await api<Board[]>('/boards')
  }

  // Waits for the backend before opening the board, so its objects can be loaded.
  async function createBoard() {
    const board = await api<Board>('/boards', { method: 'POST', body: { id: crypto.randomUUID(), name: NEW_BOARD_NAME } })
    boards.value = [board, ...boards.value]
    newBoardId.value = board.id
    await navigateTo(`/boards/${board.id}`)
  }

  function renameBoard(id: string, name: string) {
    boards.value = boards.value.map(board => (board.id === id ? { ...board, name } : board))
    api(`/boards/${id}`, { method: 'PATCH', body: { name } })
  }

  function deleteBoard(id: string) {
    boards.value = boards.value.filter(board => board.id !== id)
    api(`/boards/${id}`, { method: 'DELETE' })
  }

  return { boards: readonly(boards), newBoardId, load, createBoard, renameBoard, deleteBoard }
}
