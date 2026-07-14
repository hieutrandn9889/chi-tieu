import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            'radial-gradient(50% 40% at 50% 0%, rgb(30 64 175 / 0.22), transparent 60%)',
        }}
        aria-hidden="true"
      />
      <header className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold">
          <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <Wallet className="size-4" />
          </span>
          ChiTieu
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm animate-fade-up rounded-lg border border-border bg-card p-7 shadow-elevated">
          <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </main>
    </div>
  )
}
