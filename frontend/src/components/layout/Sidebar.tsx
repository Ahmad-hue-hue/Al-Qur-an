"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faClipboardList,
  faAward,
} from "@fortawesome/free-solid-svg-icons"

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: faHome },
  { href: "/marhalas", label: "My Marhalas", icon: faClipboardList },
  { href: "/results", label: "Results", icon: faAward },
]

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: faHome },
  { href: "/admin/marhalas", label: "Marhalas", icon: faClipboardList },
  { href: "/admin/students", label: "Students", icon: faHome },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const links = user?.role === "admin" ? adminLinks : studentLinks

  return (
    <aside className="hidden w-56 border-r border-border bg-muted/30 md:block lg:w-64">
      <div className="flex h-full flex-col p-3">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm font-bold text-primary">Tajweed Program</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <FontAwesomeIcon icon={link.icon} className="size-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
