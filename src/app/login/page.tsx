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

    const result = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Invalid phone or password")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-black">Log in</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          name="phone"
          placeholder="Phone number"
          className="w-full border rounded p-2 text-black placeholder-gray-400 bg-white"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border rounded p-2 text-black placeholder-gray-400 bg-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded p-2 hover:bg-gray-800"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  )
}