"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    const result = await signIn("credentials", { phone, password, redirect: false })
    setLoading(false)

    if (result?.error) {
      setError("Phone or password didn't match our records")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-semibold text-primary">TeachDesk</p>
          <p className="text-sm text-ink-muted mt-1">Run your coaching center, without the chaos</p>
        </div>

        <form
          action={handleSubmit}
          className="bg-surface border border-border rounded-xl shadow-sm p-8 space-y-4"
        >
          <h1 className="font-display text-xl font-semibold text-ink ledger-heading mb-4">
            Log in
          </h1>

          {error && (
            <p className="text-sm text-danger bg-[color-mix(in_srgb,var(--danger)_10%,white)] border border-[color-mix(in_srgb,var(--danger)_25%,white)] rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Phone number
            </label>
            <input
              name="phone"
              className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="01XXXXXXXXX"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="mt-1 w-full border border-border rounded-md p-2.5 text-ink placeholder:text-ink-muted/50 bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-md py-2.5 font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p className="text-center text-sm text-ink-muted">
            New here?{" "}
            <a href="/signup" className="text-primary font-medium hover:underline">
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}