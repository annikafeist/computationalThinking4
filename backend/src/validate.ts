// The backend's own slim view of a board object: the shared base fields plus whatever the variant adds.
export interface BoardObject {
  id: string
  type: 'sticky-note' | 'text' | 'circle'
  x: number
  y: number
  width: number
  height: number
  [key: string]: unknown
}

const TYPES = ['sticky-note', 'text', 'circle']
const NUMBER_FIELDS = ['x', 'y', 'width', 'height', 'fontSize']

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasValidNumbers(body: Record<string, unknown>) {
  return NUMBER_FIELDS.every(field => !(field in body) || typeof body[field] === 'number')
}

export function isValidObject(body: unknown): body is BoardObject {
  return isPlainObject(body)
    && typeof body.id === 'string'
    && TYPES.includes(body.type as string)
    && ['x', 'y', 'width', 'height'].every(field => typeof body[field] === 'number')
    && hasValidNumbers(body)
}

// Changes may touch any attribute except the identity of the object.
export function isValidChanges(body: unknown): body is Partial<BoardObject> {
  return isPlainObject(body) && !('id' in body) && !('type' in body) && hasValidNumbers(body)
}
