"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full text-left px-3 py-2 rounded-md text-sm text-ink-muted hover:bg-paper hover:text-danger transition-colors"
    >
      Sign out
    </button>
  )
}