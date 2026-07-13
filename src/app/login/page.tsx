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
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 27px, currentColor 27px, currentColor 28px)",
            color: "#ffffff",
          }}
        />
        <p className="font-display text-2xl font-semibold text-white relative">TeachDesk</p>

        <div className="relative space-y-6">
          <p className="font-display text-3xl leading-snug text-white">
            Every student.
            <br />
            Every payment.
            <br />
            One register.
          </p>
          <p className="text-sm text-white/70 max-w-xs">
            Attendance, dues, and reminders — without opening five different files.
          </p>
        </div>

        <p className="text-xs text-white/50 relative">Built for coaching centers</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-paper px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden text-center">
            <p className="font-display text-3xl font-semibold text-primary">TeachDesk</p>
          </div>

          <form
            action={handleSubmit}
            className="bg-surface border border-border rounded-xl shadow-sm p-8 space-y-4"
          >
            <div className="mb-2">
              <h1 className="font-display text-2xl font-semibold text-ink ledger-heading">
                Log in
              </h1>
              <p className="text-sm text-ink-muted mt-2">Welcome back — pick up where you left off.</p>
            </div>

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
    </div>
  )
}