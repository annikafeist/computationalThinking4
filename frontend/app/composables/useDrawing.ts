export function useDrawing() {
  const { strokes, camera, screenToWorld } = useBoard()
  const { brush, penColor } = useTools()

  function hits(stroke: Stroke, x: number, y: number) {
    const radius = 8 / camera.value.zoom + stroke.width / 2
    for (let i = 0; i < stroke.points.length; i += 2) {
      if (Math.hypot(stroke.points[i]! + stroke.x - x, stroke.points[i + 1]! + stroke.y - y) < radius) return true
    }
    return false
  }

  function erase(sx: number, sy: number) {
    const p = screenToWorld(sx, sy)
    strokes.value = strokes.value.filter(s => !hits(s, p.x, p.y))
  }

  function startDrawing(e: PointerEvent) {
    if (brush.value === 'eraser') {
      erase(e.clientX, e.clientY)
      pointerDrag(e, (dx, dy) => erase(e.clientX + dx, e.clientY + dy))
      return
    }
    const { width, opacity } = BRUSHES[brush.value]
    const start = screenToWorld(e.clientX, e.clientY)
    // Start point twice so a single click still draws a dot
    strokes.value.push({
      id: crypto.randomUUID(), x: 0, y: 0, points: [start.x, start.y, start.x, start.y],
      color: penColor.value, width, opacity
    })
    const stroke = strokes.value[strokes.value.length - 1]!
    pointerDrag(e, (dx, dy) => {
      stroke.points.push(start.x + dx / camera.value.zoom, start.y + dy / camera.value.zoom)
    })
  }

  return { startDrawing }
}
