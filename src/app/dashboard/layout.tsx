import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "./sign-out-button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/batches", label: "Batches" },
    { href: "/dashboard/students", label: "Students" },
    { href: "/dashboard/attendance", label: "Attendance" },
    { href: "/dashboard/payments", label: "Payments" },
  ]

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="px-6 py-5 border-b border-border">
          <p className="font-display text-xl font-semibold text-primary">TeachDesk</p>
          <p className="text-xs text-ink-muted mt-0.5">{session.user.name}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm text-ink hover:bg-paper hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-border">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}