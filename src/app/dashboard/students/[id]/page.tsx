import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getStudentProfile } from "@/app/actions/student"

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
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/dashboard/students" className="text-sm text-blue-600 mb-4 inline-block">
        ← Back to students
      </Link>

      <h1 className="text-2xl font-bold text-black">{student.name}</h1>
      <p className="text-gray-500 mb-1">{student.batch.name}</p>
      <p className="text-sm text-gray-400 mb-6">
        {student.phone ? `Student: ${student.phone}` : ""}
        {student.parentPhone ? ` · Parent: ${student.parentPhone}` : ""}
      </p>

      {attendanceRate !== null && (
        <div className="mb-6 bg-gray-50 border rounded p-4">
          <p className="text-black font-semibold">{attendanceRate}% attendance</p>
          <p className="text-sm text-gray-500">
            {presentCount} present out of {totalMarked} marked (last 30 records)
          </p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="font-semibold text-black mb-3">Payment history</h2>
        {student.payments.length === 0 ? (
          <p className="text-gray-500 text-sm">No payment records yet.</p>
        ) : (
          <div className="space-y-2">
            {student.payments.map((p) => (
              <div key={p.id} className="border rounded p-3 flex justify-between">
                <span className="text-black">{p.month}</span>
                <span
                  className={`text-sm font-medium ${
                    p.status === "PAID" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.status} · ৳{p.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-black mb-3">Attendance history</h2>
        {student.attendance.length === 0 ? (
          <p className="text-gray-500 text-sm">No attendance records yet.</p>
        ) : (
          <div className="space-y-2">
            {student.attendance.map((a) => (
              <div key={a.id} className="border rounded p-3 flex justify-between">
                <span className="text-black">
                  {new Date(a.date).toLocaleDateString()}
                </span>
                <span
                  className={`text-sm font-medium ${
                    a.status === "PRESENT" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}