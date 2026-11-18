import { Hono } from 'hono'
import { deleteBoard, getBoard, getObject, insertBoard, insertObject, listBoards, listObjects, updateBoard } from './storage.js'

// REST routes for the boards and the objects on each board.
export const boards = new Hono()

// A name counts as missing when it is not text or only whitespace.
function cleanName(name: unknown) {
  return typeof name === 'string' && name.trim() ? name.trim() : undefined
}

boards.get('/', async c => c.json(await listBoards()))

boards.post('/', async (c) => {
  const body = await c.req.json()
  const name = cleanName(body.name)
  if (typeof body.id !== 'string' || !name) return c.json({ error: 'Board needs an id and a name' }, 400)
  if (await getBoard(body.id)) return c.json({ error: 'A board with this id already exists' }, 409)
  return c.json(await insertBoard({ id: body.id, name }), 201)
})

boards.get('/:id', async (c) => {
  const board = await getBoard(c.req.param('id'))
  if (!board) return c.json({ error: 'Board not found' }, 404)
  return c.json(board)
})

boards.patch('/:id', async (c) => {
  const name = cleanName((await c.req.json()).name)
  if (!name) return c.json({ error: 'Board needs a name' }, 400)
  const updated = await updateBoard(c.req.param('id'), name)
  if (!updated) return c.json({ error: 'Board not found' }, 404)
  return c.json(updated)
})

boards.delete('/:id', async (c) => {
  const deleted = await deleteBoard(c.req.param('id'))
  if (!deleted) return c.json({ error: 'Board not found' }, 404)
  return c.body(null, 204)
})

boards.get('/:id/objects', async (c) => {
  const id = c.req.param('id')
  if (!(await getBoard(id))) return c.json({ error: 'Board not found' }, 404)
  return c.json(await listObjects(id))
})

boards.post('/:id/objects', async (c) => {
  const boardId = c.req.param('id')
  if (!(await getBoard(boardId))) return c.json({ error: 'Board not found' }, 404)
  const object = await c.req.json()
  if (typeof object.id !== 'string') return c.json({ error: 'Object needs an id' }, 400)
  if (await getObject(object.id)) return c.json({ error: 'An object with this id already exists' }, 409)
  return c.json(await insertObject(boardId, object), 201)
})
