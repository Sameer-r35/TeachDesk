import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SignOutButton } from "./sign-out-button"
import { SidebarNav } from "./sidebar-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="px-6 py-5 border-b border-border">
          <p className="font-display text-xl font-semibold text-primary">TeachDesk</p>
          <p className="text-xs text-ink-muted mt-0.5">{session.user.name}</p>
        </div>
        <SidebarNav />
        <div className="px-3 py-4 border-t border-border">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}