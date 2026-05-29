"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, LayoutDashboard, GraduationCap, Award, Settings } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marhalas", label: "My Marhalas", icon: GraduationCap },
  { href: "/results", label: "Results", icon: Award },
]

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/marhalas", label: "Marhalas", icon: BookOpen },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const links = user?.role === "admin" ? adminLinks : studentLinks

  return (
    <aside className="w-64 border-r border-border bg-muted/30">
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <BookOpen className="size-5 text-primary" />
          <span className="font-semibold">Al-Qur&apos;an</span>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
