export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-8 pt-8 pb-6 border-b border-border bg-surface">
      <h1 className="font-display text-2xl font-semibold text-ink ledger-heading">{title}</h1>
      {subtitle && <p className="text-sm text-ink-muted mt-2">{subtitle}</p>}
    </div>
  )
}