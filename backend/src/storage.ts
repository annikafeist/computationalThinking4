import { mkdir, readFile, writeFile } from 'node:fs/promises'
import type { BoardObject } from './validate.js'

// The only place that knows where and how the board is stored.
const DATA_DIR = new URL('../data/', import.meta.url)
const FILE = new URL('board.json', DATA_DIR)

async function load(): Promise<BoardObject[]> {
  try {
    return JSON.parse(await readFile(FILE, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function save(objects: BoardObject[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(FILE, JSON.stringify(objects, null, 2))
}

export function listObjects() {
  return load()
}

// Returns false if an object with this id already exists.
export async function insertObject(object: BoardObject) {
  const objects = await load()
  if (objects.some(existing => existing.id === object.id)) return false
  await save([...objects, object])
  return true
}

// Returns null if no object has this id.
export async function updateObject(id: string, changes: Partial<BoardObject>) {
  const objects = await load()
  const existing = objects.find(object => object.id === id)
  if (!existing) return null
  const updated = { ...existing, ...changes } as BoardObject
  await save(objects.map(object => (object.id === id ? updated : object)))
  return updated
}

// Returns false if no object has this id.
export async function deleteObject(id: string) {
  const objects = await load()
  const remaining = objects.filter(object => object.id !== id)
  if (remaining.length === objects.length) return false
  await save(remaining)
  return true
}
