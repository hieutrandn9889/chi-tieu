import type { D1Database, Fetcher } from '@cloudflare/workers-types'

export interface Env {
  DB: D1Database
  ASSETS: Fetcher
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
}

export type TransactionType = 'expense' | 'income'

export interface TransactionRow {
  id: string
  userId: string
  amount: number
  type: string
  category: string
  note: string | null
  date: string
  createdAt: string
  updatedAt: string
}

export interface Database {
  transaction: TransactionRow
}

export type AppEnv = { Bindings: Env; Variables: { user: SessionUser } }
