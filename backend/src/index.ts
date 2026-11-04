import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { deleteObject, insertObject, listObjects, updateObject } from './storage.js'
import { isValidChanges, isValidObject } from './validate.js'

const app = new Hono()

// The frontend runs on another port, so the browser needs permission to call this backend.
app.use('*', cors({ origin: 'http://localhost:3000' }))

// Broken JSON counts as an invalid body, just like a body with wrong fields.
async function readBody(request: { json: () => Promise<unknown> }) {
  try {
    return await request.json()
  } catch {
    return undefined
  }
}

app.get('/objects', async c => c.json(await listObjects(), 200))

app.post('/objects', async c => {
  const body = await readBody(c.req)
  if (!isValidObject(body)) return c.json({ error: 'invalid object' }, 400)
  if (!(await insertObject(body))) return c.json({ error: 'id already exists' }, 409)
  return c.json(body, 201)
})

app.patch('/objects/:id', async c => {
  const body = await readBody(c.req)
  if (!isValidChanges(body)) return c.json({ error: 'invalid changes' }, 400)
  const updated = await updateObject(c.req.param('id'), body)
  if (!updated) return c.json({ error: 'object not found' }, 404)
  return c.json(updated, 200)
})

app.delete('/objects/:id', async c => {
  if (!(await deleteObject(c.req.param('id')))) return c.json({ error: 'object not found' }, 404)
  return c.body(null, 204)
})

serve({ fetch: app.fetch, port: 3001 }, info => {
  console.log(`Backend läuft auf http://localhost:${info.port}`)
})
