import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowUpRight,
  LogOut,
  Plus,
  Trash2,
  Wallet,
  Loader2,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ThemeToggle'
import { authClient } from '@/lib/auth-client'
import { useAuth } from '@/lib/auth-context'
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  type Transaction,
  type TransactionType,
} from '@/lib/api'
import { formatDate, formatMoney, formatSigned, toMinorUnits } from '@/lib/format'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Groceries',
  'Rent',
  'Transport',
  'Dining',
  'Utilities',
  'Health',
  'Entertainment',
  'Other',
]

function todayInput(): string {
  return new Date().toISOString().slice(0, 10)
}

export function Dashboard() {
  const navigate = useNavigate()
  const { session, refresh } = useAuth()
  const userName = session?.user.name || 'there'

  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // form state
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayInput())
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let on = true
    listTransactions()
      .then((rows) => on && setItems(rows))
      .catch((err: unknown) => on && setLoadError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => on && setLoading(false))
    return () => {
      on = false
    }
  }, [])

  const { income, expense, balance } = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of items) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }
    return { income, expense, balance: income - expense }
  }, [items])

  async function onAdd(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const minor = toMinorUnits(amount)
    if (minor === null) {
      setFormError('Enter an amount greater than 0 (up to 2 decimals).')
      return
    }
    const cat = category.trim()
    if (!cat) {
      setFormError('Category is required.')
      return
    }
    setSaving(true)
    try {
      const created = await createTransaction({
        amount: minor,
        type,
        category: cat,
        note: note.trim() || undefined,
        date,
      })
      setItems((prev) => [created, ...prev])
      setAmount('')
      setCategory('')
      setNote('')
      setDate(todayInput())
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Could not save transaction.')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteTransaction(id)
      setItems((prev) => prev.filter((t) => t.id !== id))
    } catch {
      /* keep the row on failure */
    } finally {
      setDeletingId(null)
    }
  }

  async function onSignOut() {
    await authClient.signOut()
    await refresh()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-heading text-lg font-bold">
            <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              <Wallet className="size-4" />
            </span>
            ChiTieu
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        <div className="mb-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Hi, {userName}
          </h1>
          <p className="text-sm text-muted-foreground">Here&apos;s where your money stands.</p>
        </div>

        {/* Summary */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-gradient-to-br from-primary to-secondary p-5 text-primary-foreground shadow-elevated sm:col-span-1">
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Wallet className="size-4" /> Balance
            </div>
            <div
              className={cn(
                'tabular mt-2 font-heading text-3xl font-bold tracking-tight',
                balance < 0 && 'text-destructive-foreground',
              )}
            >
              {balance < 0 ? '-' : ''}
              {formatMoney(Math.abs(balance))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpRight className="size-4 text-accent" /> Total income
            </div>
            <div className="tabular mt-2 font-heading text-3xl font-bold tracking-tight text-accent">
              {formatMoney(income)}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownRight className="size-4 text-destructive" /> Total expense
            </div>
            <div className="tabular mt-2 font-heading text-3xl font-bold tracking-tight text-destructive">
              {formatMoney(expense)}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Add form */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-card lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-heading text-lg font-semibold">Add transaction</h2>
            <form onSubmit={onAdd} className="mt-4 space-y-4" noValidate>
              {/* type toggle */}
              <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-1">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  aria-pressed={type === 'expense'}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors duration-200',
                    type === 'expense'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <ArrowDownRight className="size-4" /> Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  aria-pressed={type === 'income'}
                  className={cn(
                    'flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors duration-200',
                    type === 'income'
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <ArrowUpRight className="size-4" /> Income
                </button>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <Input
                  id="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="tabular"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  list="category-options"
                  placeholder="e.g. Groceries"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <datalist id="category-options">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="note" className="text-sm font-medium">
                  Note <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="note"
                  placeholder="What was it for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  className="tabular"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {formError && (
                <p role="alert" className="rounded-md bg-destructive/12 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <Plus />}
                Add transaction
              </Button>
            </form>
          </section>

          {/* List */}
          <section className="rounded-lg border border-border bg-card p-2 shadow-card sm:p-4">
            <div className="flex items-center justify-between px-3 pb-2 pt-2">
              <h2 className="font-heading text-lg font-semibold">Transactions</h2>
              <span className="tabular text-sm text-muted-foreground">{items.length}</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" /> Loading…
              </div>
            ) : loadError ? (
              <p role="alert" className="m-3 rounded-md bg-destructive/12 px-3 py-2 text-sm text-destructive">
                {loadError}
              </p>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Inbox className="size-6" />
                </span>
                <div>
                  <p className="font-medium">No transactions yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add your first income or expense using the form.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((t) => (
                  <li
                    key={t.id}
                    className="group flex items-center justify-between gap-3 px-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          'flex size-9 shrink-0 items-center justify-center rounded-full',
                          t.type === 'income'
                            ? 'bg-accent/15 text-accent'
                            : 'bg-destructive/15 text-destructive',
                        )}
                      >
                        {t.type === 'income' ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownRight className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{t.category}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {t.note ? `${t.note} · ` : ''}
                          {formatDate(t.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'tabular font-semibold',
                          t.type === 'income' ? 'text-accent' : 'text-destructive',
                        )}
                      >
                        {formatSigned(t.amount, t.type)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        aria-label={`Delete ${t.category} transaction`}
                        disabled={deletingId === t.id}
                        onClick={() => onDelete(t.id)}
                      >
                        {deletingId === t.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
