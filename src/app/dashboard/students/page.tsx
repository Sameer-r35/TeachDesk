import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getStudents } from "@/app/actions/student"
import { getBatches } from "@/app/actions/batch"
import { PageHeader } from "@/components/ui/page-header"
import { StudentForm } from "./student-form"

export default async function StudentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const [students, batches] = await Promise.all([getStudents(), getBatches()])

  return (
    <div>
      <PageHeader title="Students" subtitle="Every student across all your batches" />

      <div className="p-8 max-w-2xl space-y-8">
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
    </div>
  )
}