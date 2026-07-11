"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@/app/actions/signup"

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    const result = await signup(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-semibold text-primary">TeachDesk</p>
          <p className="text-sm text-ink-muted mt-1">Set up your coaching center in a minute</p>
        </div>

        <form
          action={handleSubmit}
          className="bg-surface border border-border rounded-xl shadow-sm p-8 space-y-4"
        >
          <h1 className="font-display text-xl font-semibold text-ink ledger-heading mb-4">
            Create account
          </h1>

          {error && (
            <p className="text-sm text-danger bg-[color-mix(in_srgb,var(--danger)_10%,white)] border border-[color-mix(in_srgb,var(--danger)_25%,white)] rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {[
            { name: "businessName", label: "Coaching center name", placeholder: "e.g. Insight Academy" },
            { name: "name", label: "Your name", placeholder: "Your full name" },
            { name: "phone", label: "Phone number", placeholder: "01XXXXXXXXX" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
                {field.label}
              </label>
              <input
                name={field.name}
                placeholder={field.placeholder}
                className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                required
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-md py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}