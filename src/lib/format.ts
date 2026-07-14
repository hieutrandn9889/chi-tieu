// Amounts are stored in minor units (cents / xu). Convert to a major-unit string.
export function formatAmount(minor: number): string {
  return (minor / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Signed, with currency mark — income is positive, expense is negative.
export function formatSigned(minor: number, type: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}$${formatAmount(minor)}`
}

export function formatMoney(minor: number): string {
  return `$${formatAmount(minor)}`
}

// Parse a user-entered major-unit string ("12.50") into minor units (1250).
export function toMinorUnits(input: string): number | null {
  const cleaned = input.replace(/[,\s$]/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null
  const value = Math.round(parseFloat(cleaned) * 100)
  if (!Number.isFinite(value) || value <= 0) return null
  return value
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
