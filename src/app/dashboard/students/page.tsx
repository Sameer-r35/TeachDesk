import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getStudents } from "@/app/actions/student"
import { getBatches } from "@/app/actions/batch"
import { StudentForm } from "./student-form"

export default async function StudentsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const [students, batches] = await Promise.all([getStudents(), getBatches()])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Students</h1>

      {batches.length === 0 ? (
        <p className="text-gray-500">
          You need to create a batch first before adding students.
        </p>
      ) : (
        <StudentForm batches={batches} />
      )}

      <div className="mt-8 space-y-3">
        {students.length === 0 && (
          <p className="text-gray-500">No students yet.</p>
        )}
        {students.map((student) => (
          <div key={student.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-black">{student.name}</p>
              <p className="text-sm text-gray-500">
                {student.batch.name} {student.phone ? `· ${student.phone}` : ""}
              </p>
            </div>
            <span className="text-xs text-gray-400">{student.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}