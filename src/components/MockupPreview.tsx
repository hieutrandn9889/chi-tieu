import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Row {
  category: string
  note: string
  date: string
  amount: string
  type: 'income' | 'expense'
}

const rows: Row[] = [
  { category: 'Salary', note: 'July paycheck', date: 'Jul 1', amount: '2,400.00', type: 'income' },
  { category: 'Groceries', note: 'Weekly shop', date: 'Jul 3', amount: '86.40', type: 'expense' },
  { category: 'Coffee', note: 'Corner cafe', date: 'Jul 4', amount: '4.75', type: 'expense' },
  { category: 'Freelance', note: 'Logo design', date: 'Jul 6', amount: '320.00', type: 'income' },
  { category: 'Transport', note: 'Metro pass', date: 'Jul 7', amount: '32.00', type: 'expense' },
]

// Static, self-contained preview of the in-app dashboard for the landing hero.
export function MockupPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-elevated',
        className,
      )}
      aria-hidden="true"
    >
      {/* Balance card */}
      <div className="rounded-md bg-gradient-to-br from-primary to-secondary p-5 text-primary-foreground shadow-card">
        <div className="flex items-center gap-2 text-sm/none opacity-90">
          <Wallet className="size-4" />
          <span>Current balance</span>
        </div>
        <div className="tabular mt-3 font-heading text-4xl font-bold tracking-tight">
          $2,596.85
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="size-4" />
            <span className="tabular font-medium">+$2,720.00</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-90">
            <ArrowDownRight className="size-4" />
            <span className="tabular font-medium">-$123.15</span>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="mt-4">
        <div className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Recent
        </div>
        <ul className="space-y-1">
          {rows.map((r) => (
            <li
              key={r.category + r.date}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full',
                    r.type === 'income'
                      ? 'bg-accent/15 text-accent'
                      : 'bg-destructive/15 text-destructive',
                  )}
                >
                  {r.type === 'income' ? (
                    <ArrowUpRight className="size-4" />
                  ) : (
                    <ArrowDownRight className="size-4" />
                  )}
                </span>
                <div>
                  <div className="font-medium text-card-foreground">{r.category}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.note} · {r.date}
                  </div>
                </div>
              </div>
              <span
                className={cn(
                  'tabular font-semibold',
                  r.type === 'income' ? 'text-accent' : 'text-destructive',
                )}
              >
                {r.type === 'income' ? '+' : '-'}${r.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
