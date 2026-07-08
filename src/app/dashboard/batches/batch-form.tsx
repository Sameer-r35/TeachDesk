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

    // reset form
    const form = document.getElementById("batch-form") as HTMLFormElement
    form?.reset()
  }

  return (
    <form
      id="batch-form"
      action={handleSubmit}
      className="bg-white border rounded p-4 space-y-3"
    >
      <h2 className="font-semibold text-black">Add a batch</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        name="name"
        placeholder="Batch name (e.g. HSC Physics - Evening)"
        className="w-full border rounded p-2 text-black placeholder-gray-400"
        required
      />
      <input
        name="subject"
        placeholder="Subject"
        className="w-full border rounded p-2 text-black placeholder-gray-400"
        required
      />
      <input
        name="schedule"
        placeholder="Schedule (e.g. Sun/Tue/Thu 6PM) - optional"
        className="w-full border rounded p-2 text-black placeholder-gray-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
      >
        {loading ? "Adding..." : "Add batch"}
      </button>
    </form>
  )
}