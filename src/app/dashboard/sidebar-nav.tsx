"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/batches", label: "Batches" },
  { href: "/dashboard/students", label: "Students" },
  { href: "/dashboard/attendance", label: "Attendance" },
  { href: "/dashboard/payments", label: "Payments" },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative block px-3 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? "bg-paper text-primary font-medium"
                : "text-ink hover:bg-paper hover:text-primary"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-1 h-5 bg-accent rounded-r" />
            )}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}