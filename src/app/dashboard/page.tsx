import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getDashboardData } from "@/app/actions/dashboard"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const data = await getDashboardData()
  if (!data) redirect("/login")

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-black mb-1">
        Welcome, {session.user.name}
      </h1>
      <p className="text-gray-500 mb-6">
        {data.batchCount} batches · {data.studentCount} active students
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/batches"
          className="border rounded p-4 hover:bg-gray-50"
        >
          <p className="font-semibold text-black">Manage Batches</p>
          <p className="text-sm text-gray-500">Create and view batches</p>
        </Link>
        <Link
          href="/dashboard/students"
          className="border rounded p-4 hover:bg-gray-50"
        >
          <p className="font-semibold text-black">Manage Students</p>
          <p className="text-sm text-gray-500">Add and view students</p>
        </Link>
        <Link
          href="/dashboard/attendance"
          className="border rounded p-4 hover:bg-gray-50"
        >
          <p className="font-semibold text-black">Take Attendance</p>
          <p className="text-sm text-gray-500">Mark today's attendance</p>
        </Link>
        <Link
          href="/dashboard/payments"
          className="border rounded p-4 hover:bg-gray-50"
        >
          <p className="font-semibold text-black">Payments</p>
          <p className="text-sm text-gray-500">Track dues and reminders</p>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-black mb-3">
          Overdue payments this month ({data.overduePayments.length})
        </h2>
        {data.overduePayments.length === 0 ? (
          <p className="text-gray-500 text-sm">Everyone's paid up 🎉</p>
        ) : (
          <div className="space-y-2">
            {data.overduePayments.slice(0, 5).map((p) => (
              <div key={p.id} className="border rounded p-3 flex justify-between">
                <span className="text-black">{p.student.name}</span>
                <span className="text-sm text-gray-500">{p.student.batch.name}</span>
              </div>
            ))}
            {data.overduePayments.length > 5 && (
              <Link href="/dashboard/payments" className="text-sm text-blue-600">
                View all {data.overduePayments.length} →
              </Link>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-black mb-3">Recent absences (last 7 days)</h2>
        {data.recentAbsences.length === 0 ? (
          <p className="text-gray-500 text-sm">No absences recorded recently.</p>
        ) : (
          <div className="space-y-2">
            {data.recentAbsences.map((a) => (
              <div key={a.id} className="border rounded p-3 flex justify-between">
                <span className="text-black">{a.student.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(a.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}