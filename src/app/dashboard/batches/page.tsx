import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getBatches, createBatch } from "@/app/actions/batch"
import { BatchForm } from "./batch-form"

export default async function BatchesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const batches = await getBatches()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Batches</h1>

      <BatchForm />

      <div className="mt-8 space-y-3">
        {batches.length === 0 && (
          <p className="text-gray-500">No batches yet. Add one above.</p>
        )}
        {batches.map((batch) => (
          <div key={batch.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-black">{batch.name}</p>
              <p className="text-sm text-gray-500">
                {batch.subject} {batch.schedule ? `· ${batch.schedule}` : ""}
              </p>
            </div>
            <span className="text-sm text-gray-400">{batch.students.length} students</span>
          </div>
        ))}
      </div>
    </div>
  )
}