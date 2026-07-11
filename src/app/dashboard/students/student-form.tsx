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
      className="bg-surface border border-border rounded-xl p-6 space-y-4"
    >
      <h2 className="font-display font-semibold text-ink ledger-heading">Add a student</h2>

      {error && (
        <p className="text-sm text-danger bg-[color-mix(in_srgb,var(--danger)_10%,white)] border border-[color-mix(in_srgb,var(--danger)_25%,white)] rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Student name</label>
        <input
          name="name"
          placeholder="Full name"
          className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Batch</label>
        <select
          name="batchId"
          className="mt-1 w-full border border-border rounded-md p-2.5 text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        >
          <option value="">Select batch</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
            Student phone <span className="normal-case text-ink-muted/70">(optional)</span>
          </label>
          <input
            name="phone"
            placeholder="01XXXXXXXXX"
            className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
            Parent phone <span className="normal-case text-ink-muted/70">(optional)</span>
          </label>
          <input
            name="parentPhone"
            placeholder="01XXXXXXXXX"
            className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white rounded-md px-4 py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add student"}
      </button>
    </form>
  )
}