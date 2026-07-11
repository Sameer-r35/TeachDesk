import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getStudentProfile } from "@/app/actions/student"
import { PageHeader } from "@/components/ui/page-header"

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params
  const student = await getStudentProfile(id)
  if (!student) notFound()

  const presentCount = student.attendance.filter((a) => a.status === "PRESENT").length
  const totalMarked = student.attendance.length
  const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : null

  return (
    <div>
      <PageHeader title={student.name} subtitle={student.batch.name} />

      <div className="p-8 max-w-2xl space-y-8">
        <Link href="/dashboard/students" className="text-sm text-primary font-medium hover:underline">
          ← Back to students
        </Link>

        <div className="flex gap-6 text-sm text-ink-muted">
          {student.phone && (
            <span>Student: <span className="font-mono text-ink">{student.phone}</span></span>
          )}
          {student.parentPhone && (
            <span>Parent: <span className="font-mono text-ink">{student.parentPhone}</span></span>
          )}
        </div>

        {attendanceRate !== null && (
          <div className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-display text-2xl font-semibold text-ink">{attendanceRate}%</p>
              <p className="text-sm text-ink-muted">attendance rate</p>
            </div>
            <p className="text-sm text-ink-muted font-mono">
              {presentCount}/{totalMarked} present
            </p>
          </div>
        )}

        <section>
          <h2 className="font-display text-lg font-semibold text-ink ledger-heading mb-4">
            Payment history
          </h2>
          {student.payments.length === 0 ? (
            <p className="text-sm text-ink-muted">No payment records yet.</p>
          ) : (
            <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
              {student.payments.map((p) => (
                <div key={p.id} className="px-5 py-3 flex justify-between items-center">
                  <span className="text-ink font-medium font-mono">{p.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-ink-muted">৳{p.amount}</span>
                    <span className={`stamp ${p.status === "PAID" ? "text-success" : "text-danger"}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink ledger-heading mb-4">
            Attendance history
          </h2>
          {student.attendance.length === 0 ? (
            <p className="text-sm text-ink-muted">No attendance records yet.</p>
          ) : (
            <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
              {student.attendance.map((a) => (
                <div key={a.id} className="px-5 py-3 flex justify-between items-center">
                  <span className="text-ink font-mono text-sm">
                    {new Date(a.date).toLocaleDateString()}
                  </span>
                  <span className={`stamp ${a.status === "PRESENT" ? "text-success" : "text-danger"}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}