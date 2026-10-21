// Calls onMove with the pointer offset (in screen px) since pointerdown, until release
export function pointerDrag(e: PointerEvent, onMove: (dx: number, dy: number) => void) {
  const target = e.currentTarget as HTMLElement
  const startX = e.clientX
  const startY = e.clientY
  target.setPointerCapture(e.pointerId)

  function move(ev: PointerEvent) {
    onMove(ev.clientX - startX, ev.clientY - startY)
  }

  function up() {
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerup', up)
  }

  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', up)
}
