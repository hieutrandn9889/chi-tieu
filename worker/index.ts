import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { createAuth } from './auth'
import { createDb } from './db'
import type { AppEnv, TransactionRow, TransactionType } from './types'

const toTransaction = (r: TransactionRow) => ({
  id: r.id,
  amount: r.amount,
  type: r.type as TransactionType,
  category: r.category,
  note: r.note,
  date: r.date,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
})

const isType = (v: unknown): v is TransactionType => v === 'expense' || v === 'income'

const todayISO = () => new Date().toISOString().slice(0, 10)

const isValidDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))

const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const session = await createAuth(c.env).api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  c.set('user', {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  })
  await next()
})

const api = new Hono<AppEnv>()

api.get('/health', (c) => c.json({ ok: true }))

// Better Auth handles all of /api/auth/*
api.on(['GET', 'POST'], '/auth/*', (c) => createAuth(c.env).handler(c.req.raw))

// Everything below requires a session
api.use('/transactions', requireAuth)
api.use('/transactions/*', requireAuth)

api.get('/transactions', async (c) => {
  const rows = await createDb(c.env)
    .selectFrom('transaction')
    .selectAll()
    .where('userId', '=', c.get('user').id)
    .orderBy('date', 'desc')
    .orderBy('createdAt', 'desc')
    .execute()
  return c.json(rows.map(toTransaction))
})

api.post('/transactions', async (c) => {
  const b = await c.req
    .json<{ amount?: unknown; type?: unknown; category?: unknown; note?: unknown; date?: unknown }>()
    .catch(() => ({}) as Record<string, unknown>)

  const amount = typeof b.amount === 'number' ? Math.trunc(b.amount) : Number.NaN
  if (!Number.isFinite(amount) || amount <= 0) {
    return c.json({ error: 'amount must be a positive integer (minor units)' }, 400)
  }
  if (!isType(b.type)) {
    return c.json({ error: "type must be 'expense' or 'income'" }, 400)
  }
  const category = typeof b.category === 'string' ? b.category.trim() : ''
  if (!category) {
    return c.json({ error: 'category is required' }, 400)
  }
  const note = typeof b.note === 'string' && b.note.trim() ? b.note.trim() : null
  let date = typeof b.date === 'string' && b.date.trim() ? b.date.trim() : todayISO()
  if (!isValidDate(date)) {
    return c.json({ error: 'date must be an ISO date (YYYY-MM-DD)' }, 400)
  }

  const now = new Date().toISOString()
  const row: TransactionRow = {
    id: crypto.randomUUID(),
    userId: c.get('user').id,
    amount,
    type: b.type,
    category,
    note,
    date,
    createdAt: now,
    updatedAt: now,
  }
  await createDb(c.env).insertInto('transaction').values(row).execute()
  return c.json(toTransaction(row), 201)
})

api.patch('/transactions/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.get('user').id
  const db = createDb(c.env)

  const existing = await db
    .selectFrom('transaction')
    .selectAll()
    .where('id', '=', id)
    .where('userId', '=', userId)
    .executeTakeFirst()
  if (!existing) return c.json({ error: 'Not found' }, 404)

  const b = await c.req
    .json<{ amount?: unknown; type?: unknown; category?: unknown; note?: unknown; date?: unknown }>()
    .catch(() => ({}) as Record<string, unknown>)

  const patch: Partial<TransactionRow> = {}

  if (b.amount !== undefined) {
    const amount = typeof b.amount === 'number' ? Math.trunc(b.amount) : Number.NaN
    if (!Number.isFinite(amount) || amount <= 0) {
      return c.json({ error: 'amount must be a positive integer (minor units)' }, 400)
    }
    patch.amount = amount
  }
  if (b.type !== undefined) {
    if (!isType(b.type)) return c.json({ error: "type must be 'expense' or 'income'" }, 400)
    patch.type = b.type
  }
  if (b.category !== undefined) {
    const category = typeof b.category === 'string' ? b.category.trim() : ''
    if (!category) return c.json({ error: 'category is required' }, 400)
    patch.category = category
  }
  if (b.note !== undefined) {
    patch.note = typeof b.note === 'string' && b.note.trim() ? b.note.trim() : null
  }
  if (b.date !== undefined) {
    const date = typeof b.date === 'string' ? b.date.trim() : ''
    if (!isValidDate(date)) return c.json({ error: 'date must be an ISO date (YYYY-MM-DD)' }, 400)
    patch.date = date
  }

  patch.updatedAt = new Date().toISOString()

  await db
    .updateTable('transaction')
    .set(patch)
    .where('id', '=', id)
    .where('userId', '=', userId)
    .execute()

  const updated = await db
    .selectFrom('transaction')
    .selectAll()
    .where('id', '=', id)
    .where('userId', '=', userId)
    .executeTakeFirstOrThrow()
  return c.json(toTransaction(updated))
})

api.delete('/transactions/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.get('user').id
  const res = await createDb(c.env)
    .deleteFrom('transaction')
    .where('id', '=', id)
    .where('userId', '=', userId)
    .executeTakeFirst()
  if (!res.numDeletedRows || res.numDeletedRows === 0n) {
    return c.json({ error: 'Not found' }, 404)
  }
  return c.json({ ok: true })
})

const app = new Hono<AppEnv>()
app.route('/api', api)
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
