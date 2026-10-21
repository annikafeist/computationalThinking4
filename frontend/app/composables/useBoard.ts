export interface Note {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  content: string
}

export interface TextBox {
  id: string
  x: number
  y: number
  fontSize: number
  content: string
}

export interface Stroke {
  id: string
  x: number
  y: number
  points: number[]
  color: string
  width: number
  opacity: number
}

export interface Stamp {
  id: string
  x: number
  y: number
  emoji: string
}

export const GRID = 20

export const COLORS = ['#fef08a', '#fed7aa', '#fbcfe8', '#e9d5ff', '#bfdbfe', '#bbf7d0']

export function snap(value: number) {
  return Math.round(value / GRID) * GRID
}

export function useBoard() {
  const notes = useState<Note[]>('notes', () => [])
  const texts = useState<TextBox[]>('texts', () => [])
  const strokes = useState<Stroke[]>('strokes', () => [])
  const stamps = useState<Stamp[]>('stamps', () => [])
  const camera = useState('camera', () => ({ x: 0, y: 0, zoom: 1 }))
  const newColor = useState('newColor', () => COLORS[0]!)
  const selectedId = useState<string | null>('selectedId', () => null)
  const editingId = useState<string | null>('editingId', () => null)

  function screenToWorld(sx: number, sy: number) {
    return {
      x: (sx - camera.value.x) / camera.value.zoom,
      y: (sy - camera.value.y) / camera.value.zoom
    }
  }

  function addNote(x: number, y: number) {
    notes.value.push({
      id: crypto.randomUUID(), x: snap(x), y: snap(y), width: 160, height: 160, color: newColor.value, content: ''
    })
  }

  function addText(x: number, y: number) {
    const id = crypto.randomUUID()
    texts.value.push({ id, x: snap(x), y: snap(y), fontSize: 20, content: '' })
    selectedId.value = id
    editingId.value = id
  }

  function addStamp(x: number, y: number, emoji: string) {
    stamps.value.push({ id: crypto.randomUUID(), x: snap(x), y: snap(y), emoji })
  }

  return {
    notes, texts, strokes, stamps, camera, newColor, selectedId, editingId,
    screenToWorld, addNote, addText, addStamp
  }
}
