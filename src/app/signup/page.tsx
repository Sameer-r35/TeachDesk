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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Create your coaching center account</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          name="businessName"
          placeholder="Coaching center name"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="name"
          placeholder="Your name"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="phone"
          placeholder="Phone number"
          className="w-full border rounded p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border rounded p-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded p-2 hover:bg-gray-800"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </div>
  )
}