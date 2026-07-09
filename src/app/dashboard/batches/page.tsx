import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getBatches } from "@/app/actions/batch"
import { PageHeader } from "@/components/ui/page-header"
import { BatchForm } from "./batch-form"

export default async function BatchesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const batches = await getBatches()

  return (
    <div>
      <PageHeader title="Batches" subtitle="Group students by class, subject, and schedule" />

      <div className="p-8 max-w-2xl space-y-8">
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
    </div>
  )
}