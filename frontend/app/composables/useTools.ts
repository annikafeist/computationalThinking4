export type Tool = 'select' | 'pen' | 'text' | 'stamp'

export const BRUSHES = {
  pen: { label: 'Stift', width: 3, opacity: 1 },
  marker: { label: 'Marker', width: 10, opacity: 1 },
  highlighter: { label: 'Textmarker', width: 24, opacity: 0.4 },
  eraser: { label: 'Radierer', width: 0, opacity: 0 }
}

export type Brush = keyof typeof BRUSHES

export const PEN_COLORS = ['#1e293b', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7']

export const STAMPS = ['👍', '❤️', '⭐', '✅', '❓', '🔥']

export function useTools() {
  const tool = useState<Tool>('tool', () => 'select')
  const brush = useState<Brush>('brush', () => 'pen')
  const penColor = useState('penColor', () => PEN_COLORS[0]!)
  const stamp = useState('stamp', () => STAMPS[0]!)

  return { tool, brush, penColor, stamp }
}
