import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ClipboardList,
  LineChart,
  ListChecks,
  PiggyBank,
  ShieldCheck,
  Tags,
  Wallet,
  Zap,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MockupPreview } from '@/components/MockupPreview'
import { useAuth } from '@/lib/auth-context'

const features = [
  {
    icon: Wallet,
    title: 'Live balance',
    body: 'Income minus expense, updated the moment you log a transaction. No spreadsheets.',
  },
  {
    icon: Tags,
    title: 'Categories & notes',
    body: 'Tag every entry and jot a note so you always know where the money went.',
  },
  {
    icon: LineChart,
    title: 'Income vs. expense',
    body: 'Totals split at a glance — green for money in, red for money out.',
  },
  {
    icon: Zap,
    title: 'Fast entry',
    body: 'Add a transaction in a couple of taps with a clean, keyboard-friendly form.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    body: 'Email + password auth. Every transaction is scoped to your account only.',
  },
  {
    icon: PiggyBank,
    title: 'Stay in control',
    body: 'A trustworthy, distraction-free view of your spending so you can plan ahead.',
  },
]

const steps = [
  {
    icon: ClipboardList,
    title: 'Log it',
    body: 'Record income or an expense with an amount, category, and optional note.',
  },
  {
    icon: ListChecks,
    title: 'Track it',
    body: 'Your transactions stack up newest-first, colour-coded by type.',
  },
  {
    icon: LineChart,
    title: 'See your balance',
    body: 'Watch income, expense, and net balance update in real time.',
  },
]

export function Landing() {
  const { session } = useAuth()
  const primaryHref = session ? '/app' : '/signup'
  const primaryLabel = session ? 'Go to dashboard' : 'Get started free'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold">
            <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              <Wallet className="size-4" />
            </span>
            ChiTieu
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <Link to="/app" className={buttonVariants({ className: 'hidden sm:inline-flex' })}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={buttonVariants({ variant: 'ghost', className: 'hidden sm:inline-flex' })}
                >
                  Log in
                </Link>
                <Link to="/signup" className={buttonVariants()}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                'radial-gradient(60% 50% at 15% 0%, rgb(30 64 175 / 0.25), transparent 60%), radial-gradient(50% 45% at 95% 10%, rgb(5 150 105 / 0.18), transparent 60%)',
            }}
            aria-hidden="true"
          />
          <div className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-accent" />
                Personal finance, simplified
              </span>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Know exactly where your money goes.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                ChiTieu is a clean expense and income tracker. Log spending, watch your balance,
                and stay in control — no clutter, no noise.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={primaryHref} className={buttonVariants({ size: 'lg' })}>
                  {primaryLabel}
                  <ArrowRight />
                </Link>
                <a href="#how" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                  See how it works
                </a>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-accent" />
                Free to start · Your data stays private
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <MockupPreview className="animate-fade-up" />
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section id="features" className="border-t border-border py-16 md:py-24">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need, nothing you don't
              </h2>
              <p className="mt-4 text-muted-foreground">
                A focused set of tools to record, categorise, and understand your cash flow.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-lg border border-border bg-card p-6 shadow-card transition-transform duration-200 hover:-translate-y-1"
                >
                  <span className="flex size-11 items-center justify-center rounded-md bg-primary/12 text-secondary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border bg-muted/40 py-16 md:py-24">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Up and running in three steps
              </h2>
              <p className="mt-4 text-muted-foreground">
                No setup, no learning curve. Start tracking in under a minute.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="relative rounded-lg border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="tabular flex size-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <s.icon className="size-5 text-secondary" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border py-16 md:py-24">
          <div className="container-page">
            <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary to-secondary p-10 text-center text-primary-foreground shadow-elevated md:p-16">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Take control of your spending today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
                Create a free account and log your first transaction in seconds.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to={primaryHref} className={buttonVariants({ size: 'lg', variant: 'accent' })}>
                  {primaryLabel}
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-heading font-semibold text-foreground">
            <span className="flex size-6 items-center justify-center rounded bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              <Wallet className="size-3.5" />
            </span>
            ChiTieu
          </div>
          <p>&copy; {new Date().getFullYear()} ChiTieu. A personal expense tracker.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="transition-colors hover:text-foreground">
              Log in
            </Link>
            <Link to="/signup" className="transition-colors hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
