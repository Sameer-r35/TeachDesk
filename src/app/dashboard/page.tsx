import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getDashboardData } from "@/app/actions/dashboard"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const data = await getDashboardData()
  if (!data) redirect("/login")

  const quickLinks = [
    { href: "/dashboard/batches", label: "Batches", desc: "Create and view batches" },
    { href: "/dashboard/students", label: "Students", desc: "Add and view students" },
    { href: "/dashboard/attendance", label: "Attendance", desc: "Mark today's attendance" },
    { href: "/dashboard/payments", label: "Payments", desc: "Track dues and reminders" },
  ]

  return (
    <div>
      <PageHeader title={`Welcome, ${session.user.name}`} subtitle="Here's where things stand today" />

      <div className="p-8 max-w-6xl space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Batches" value={data.batchCount} />
          <StatCard label="Active students" value={data.studentCount} />
          <StatCard label="Overdue payments" value={data.overduePayments.length} />
          <StatCard label="Recent absences" value={data.recentAbsences.length} sublabel="last 7 days" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="bg-surface border border-border rounded-xl p-4 hover:border-primary hover:shadow-sm transition-all"
            >
              <p className="font-display font-semibold text-ink">{q.label}</p>
              <p className="text-xs text-ink-muted mt-1">{q.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="font-display text-lg font-semibold text-ink ledger-heading mb-4">
              Overdue payments this month
              <span className="ml-2 font-mono text-sm text-danger align-middle">
                ({data.overduePayments.length})
              </span>
            </h2>

            {data.overduePayments.length === 0 ? (
              <p className="text-sm text-ink-muted">Everyone's paid up.</p>
            ) : (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {data.overduePayments.map((p) => (
                    <div key={p.id} className="px-5 py-3 flex justify-between items-center">
                      <span className="text-ink font-medium">{p.student.name}</span>
                      <span className="text-sm text-ink-muted">{p.student.batch.name}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/dashboard/payments"
                  className="block px-5 py-3 text-sm text-primary font-medium hover:bg-paper border-t border-border"
                >
                  Go to payments →
                </Link>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink ledger-heading mb-4">
              Recent absences
            </h2>
            {data.recentAbsences.length === 0 ? (
              <p className="text-sm text-ink-muted">No absences in the last 7 days.</p>
            ) : (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {data.recentAbsences.map((a) => (
                    <div key={a.id} className="px-5 py-3 flex justify-between items-center">
                      <span className="text-ink font-medium">{a.student.name}</span>
                      <span className="text-sm text-ink-muted font-mono">
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}