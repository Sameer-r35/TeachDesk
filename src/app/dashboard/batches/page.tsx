import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getBatches } from "@/app/actions/batch"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { BatchForm } from "./batch-form"

export default async function BatchesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const batches = await getBatches()
  const totalStudents = batches.reduce((sum, b) => sum + b.students.length, 0)
  const largest = batches.reduce(
    (max, b) => (b.students.length > max.count ? { name: b.name, count: b.students.length } : max),
    { name: "—", count: 0 }
  )

  return (
    <div>
      <PageHeader title="Batches" subtitle="Group students by class, subject, and schedule" />

      <div className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 max-w-6xl">
        <div className="space-y-8 min-w-0">
          <BatchForm />

          <div className="space-y-3">
            {batches.length === 0 && (
              <p className="text-sm text-ink-muted">No batches yet. Add one above to get started.</p>
            )}
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-surface border border-border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-display font-semibold text-ink">{batch.name}</p>
                  <p className="text-sm text-ink-muted mt-0.5">
                    {batch.subject}
                    {batch.schedule ? ` · ${batch.schedule}` : ""}
                  </p>
                </div>
                <span className="font-mono text-sm text-ink-muted">
                  {batch.students.length} student{batch.students.length !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <StatCard label="Total batches" value={batches.length} />
          <StatCard label="Total students enrolled" value={totalStudents} />
          {largest.count > 0 && (
            <StatCard label="Largest batch" value={largest.count} sublabel={largest.name} />
          )}
        </aside>
      </div>
    </div>
  )
}