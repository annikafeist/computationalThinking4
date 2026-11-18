// The backend treats objects as plain JSON; it only relies on every object having an id.
export type BoardObject = { id: string } & Record<string, unknown>
export type Board = { id: string, name: string, createdAt: string }

// Boards and objects live in the Supabase tables "boards" and "objects", reached through its REST API.
// This module is the only place that knows about the database.
process.loadEnvFile(new URL('../.env', import.meta.url))
const URL_BASE = `${process.env.SUPABASE_URL}/rest/v1`
const HEADERS = {
  'apikey': process.env.SUPABASE_SECRET_KEY!,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

// The frontend uses camelCase, the tables use snake_case; created_at of objects stays in the database.
function toRow({ fontSize, boardId, ...rest }: Record<string, unknown>) {
  return {
    ...rest,
    ...(fontSize === undefined ? {} : { font_size: fontSize }),
    ...(boardId === undefined ? {} : { board_id: boardId }),
  }
}

function toObject({ font_size, board_id, created_at, ...rest }: BoardObject): BoardObject {
  return { ...rest, fontSize: font_size, boardId: board_id }
}

function toBoard({ id, name, created_at }: Record<string, unknown>): Board {
  return { id, name, createdAt: created_at } as Board
}

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(URL_BASE + path, { ...init, headers: HEADERS })
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`)
  return (await response.json()) as BoardObject[]
}

const byId = (id: string) => `?id=eq.${encodeURIComponent(id)}`

export async function listBoards() {
  return (await request('/boards?select=*&order=created_at.desc')).map(toBoard)
}

export async function getBoard(id: string) {
  const [row] = await request(`/boards${byId(id)}`)
  return row && toBoard(row)
}

export async function insertBoard(board: { id: string, name: string }) {
  const [row] = await request('/boards', { method: 'POST', body: JSON.stringify(board) })
  return toBoard(row)
}

export async function updateBoard(id: string, name: string) {
  const [row] = await request(`/boards${byId(id)}`, { method: 'PATCH', body: JSON.stringify({ name }) })
  return row && toBoard(row)
}

// The database removes the objects of the board along with it.
export async function deleteBoard(id: string) {
  const rows = await request(`/boards${byId(id)}`, { method: 'DELETE' })
  return rows.length > 0
}

export async function listObjects(boardId: string) {
  return (await request(`/objects?board_id=eq.${encodeURIComponent(boardId)}&order=created_at`)).map(toObject)
}

export async function getObject(id: string) {
  const [row] = await request(`/objects${byId(id)}`)
  return row && toObject(row)
}

export async function insertObject(boardId: string, object: BoardObject) {
  const [row] = await request('/objects', { method: 'POST', body: JSON.stringify(toRow({ ...object, boardId })) })
  return toObject(row)
}

// Objects stay on the board they were created on, so a boardId in the changes is ignored.
export async function updateObject(id: string, { boardId, ...changes }: Record<string, unknown>) {
  const [row] = await request(`/objects${byId(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(toRow({ ...changes, id })),
  })
  return row && toObject(row)
}

export async function deleteObject(id: string) {
  const rows = await request(`/objects${byId(id)}`, { method: 'DELETE' })
  return rows.length > 0
}
