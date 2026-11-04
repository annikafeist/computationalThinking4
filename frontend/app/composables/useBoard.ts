import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

const API = 'http://localhost:3001/objects'
const PATCH_DELAY = 300

type Changes = Partial<Rect> & StyleChanges & { text?: string }

// Changes waiting to be sent, per object. Every new change restarts the timer,
// so a drag sends a single PATCH once the pointer has rested for PATCH_DELAY.
const pending = new Map<string, { changes: Changes, timer: ReturnType<typeof setTimeout> }>()

function queuePatch(id: string, changes: Changes) {
  const entry = pending.get(id)
  if (entry) clearTimeout(entry.timer)
  const merged = { ...entry?.changes, ...changes }
  const timer = setTimeout(() => {
    pending.delete(id)
    $fetch(`${API}/${id}`, { method: 'PATCH', body: merged })
  }, PATCH_DELAY)
  pending.set(id, { changes: merged, timer })
}

function cancelPatch(id: string) {
  clearTimeout(pending.get(id)?.timer)
  pending.delete(id)
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below,
// which first changes the local state and then tells the backend.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])

  // Loaded once in the browser, however many places call useBoard().
  if (import.meta.client) {
    callOnce('board', async () => {
      objects.value = await $fetch<BoardObject[]>(API)
    })
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    const object = { ...defaults, ...template, id, x, y } as BoardObject
    objects.value = [...objects.value, object]
    $fetch(API, { method: 'POST', body: object })
    return id
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const id = crypto.randomUUID()
    const copy = { ...source, id }
    objects.value = [...objects.value, copy]
    $fetch(API, { method: 'POST', body: copy })
    return id
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    cancelPatch(id)
    $fetch(`${API}/${id}`, { method: 'DELETE' })
  }

  function updateObject(id: string, changes: Changes) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
    queuePatch(id, changes)
  }

  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}
