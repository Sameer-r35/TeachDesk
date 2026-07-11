"use client"

import { useState } from "react"
import { createBatch } from "@/app/actions/batch"

export function BatchForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const result = await createBatch(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    const form = document.getElementById("batch-form") as HTMLFormElement
    form?.reset()
  }

  return (
    <form
      id="batch-form"
      action={handleSubmit}
      className="bg-surface border border-border rounded-xl p-6 space-y-4"
    >
      <h2 className="font-display font-semibold text-ink ledger-heading">Add a batch</h2>

      {error && (
        <p className="text-sm text-danger bg-[color-mix(in_srgb,var(--danger)_10%,white)] border border-[color-mix(in_srgb,var(--danger)_25%,white)] rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Batch name</label>
        <input
          name="name"
          placeholder="e.g. HSC Physics - Evening"
          className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Subject</label>
        <input
          name="subject"
          placeholder="e.g. Physics"
          className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />
      </div>
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Schedule <span className="normal-case text-ink-muted/70">(optional)</span>
        </label>
        <input
          name="schedule"
          placeholder="e.g. Sun/Tue/Thu 6PM"
          className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white rounded-md px-4 py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add batch"}
      </button>
    </form>
  )
}