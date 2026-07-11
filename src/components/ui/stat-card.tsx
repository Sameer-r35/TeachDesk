export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string
  value: string | number
  sublabel?: string
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl font-semibold text-ink mt-1">{value}</p>
      {sublabel && <p className="text-xs text-ink-muted mt-1">{sublabel}</p>}
    </div>
  )
}