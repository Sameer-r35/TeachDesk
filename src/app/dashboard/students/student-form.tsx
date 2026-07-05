"use client"

import { useState } from "react"
import { createStudent } from "@/app/actions/student"

type Batch = {
  id: string
  name: string
}

export function StudentForm({ batches }: { batches: Batch[] }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const result = await createStudent(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    const form = document.getElementById("student-form") as HTMLFormElement
    form?.reset()
  }

  return (
    <form
      id="student-form"
      action={handleSubmit}
      className="bg-white border rounded p-4 space-y-3"
    >
      <h2 className="font-semibold text-black">Add a student</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="name"
        placeholder="Student name"
        className="w-full border rounded p-2 text-black placeholder-gray-400"
        required
      />

      <select
        name="batchId"
        className="w-full border rounded p-2 text-black"
        required
      >
        <option value="">Select batch</option>
        {batches.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.name}
          </option>
        ))}
      </select>

      <input
        name="phone"
        placeholder="Student phone (optional)"
        className="w-full border rounded p-2 text-black placeholder-gray-400"
      />
      <input
        name="parentPhone"
        placeholder="Parent phone (optional)"
        className="w-full border rounded p-2 text-black placeholder-gray-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
      >
        {loading ? "Adding..." : "Add student"}
      </button>
    </form>
  )
}