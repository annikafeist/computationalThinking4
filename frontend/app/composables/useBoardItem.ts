// Selection, editing and grid-snapped moving shared by all board items
export function useBoardItem(item: { id: string, x: number, y: number }) {
  const { camera, selectedId, editingId } = useBoard()

  const isSelected = computed(() => selectedId.value === item.id)
  const isEditing = computed(() => editingId.value === item.id)

  function startMove(e: PointerEvent) {
    if (!isSelected.value) editingId.value = null
    selectedId.value = item.id
    if (isEditing.value) return
    const start = { x: item.x, y: item.y }
    pointerDrag(e, (dx, dy) => {
      item.x = snap(start.x + dx / camera.value.zoom)
      item.y = snap(start.y + dy / camera.value.zoom)
    })
  }

  function startEdit() {
    editingId.value = item.id
  }

  return { isSelected, isEditing, startMove, startEdit }
}
