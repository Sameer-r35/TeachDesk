import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getStudents } from "@/app/actions/student"
import { getBatches } from "@/app/actions/batch"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { StudentForm } from "./student-form"

export default async function StudentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const [students, batches] = await Promise.all([getStudents(), getBatches()])

  const activeCount = students.filter((s) => s.status === "ACTIVE").length
  const byBatch = batches
    .map((b) => ({
      name: b.name,
      count: students.filter((s) => s.batch.id === b.id).length,
    }))
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <div>
      <PageHeader title="Students" subtitle="Every student across all your batches" />

      <div className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 max-w-6xl">
        <div className="space-y-8 min-w-0">
          {batches.length === 0 ? (
            <p className="text-sm text-ink-muted">
              You need to create a batch first before adding students.
            </p>
          ) : (
            <StudentForm batches={batches} />
          )}

          <div className="space-y-3">
            {students.length === 0 && (
              <p className="text-sm text-ink-muted">No students yet.</p>
            )}
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/dashboard/students/${student.id}`}
                className="bg-surface border border-border rounded-xl p-4 flex justify-between items-center hover:border-primary hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-display font-semibold text-ink">{student.name}</p>
                  <p className="text-sm text-ink-muted mt-0.5">
                    {student.batch.name}
                    {student.phone ? ` · ${student.phone}` : ""}
                  </p>
                </div>
                <span
                  className={`stamp ${
                    student.status === "ACTIVE" ? "text-success" : "text-ink-muted"
                  }`}
                >
                  {student.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total" value={students.length} />
            <StatCard label="Active" value={activeCount} />
          </div>

          {byBatch.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="font-display font-semibold text-ink ledger-heading mb-3">
                By batch
              </h3>
              <div className="space-y-2.5">
                {byBatch.map((b) => (
                  <div key={b.name} className="flex justify-between items-center text-sm">
                    <span className="text-ink-muted truncate pr-2">{b.name}</span>
                    <span className="font-mono text-ink shrink-0">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}