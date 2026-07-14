export type TransactionType = 'expense' | 'income'

export interface Transaction {
  id: string
  amount: number // minor units, always positive
  type: TransactionType
  category: string
  note: string | null
  date: string
  createdAt: string
  updatedAt: string
}

export interface NewTransaction {
  amount: number
  type: TransactionType
  category: string
  note?: string
  date?: string
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    throw new Error((await res.text().catch(() => '')) || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const listTransactions = () => req<Transaction[]>('/transactions')

export const createTransaction = (body: NewTransaction) =>
  req<Transaction>('/transactions', { method: 'POST', body: JSON.stringify(body) })

export const updateTransaction = (id: string, patch: Partial<NewTransaction>) =>
  req<Transaction>(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

export const deleteTransaction = (id: string) =>
  req<{ ok: true }>(`/transactions/${id}`, { method: 'DELETE' })
