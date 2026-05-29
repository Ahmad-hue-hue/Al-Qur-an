"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBookOpen,
  faBars,
  faTimes,
  faHome,
  faClipboardList,
  faAward,
  faSignOutAlt,
  faUser,
  faChevronRight,
  faCog,
} from "@fortawesome/free-solid-svg-icons"

export function MobileNav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: faHome },
    { href: "/marhalas", label: "My Marhalas", icon: faClipboardList },
    { href: "/results", label: "Results", icon: faAward },
  ]

  const adminLinks = [
    { href: "/admin", label: "Admin Dashboard", icon: faCog },
    { href: "/admin/marhalas", label: "Manage Marhalas", icon: faClipboardList },
    { href: "/admin/students", label: "Students", icon: faUser },
  ]

  const links = user?.role === "admin" ? adminLinks : studentLinks

  return (
    <div className="md:hidden" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted"
      >
        <FontAwesomeIcon icon={open ? faTimes : faBars} className="size-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBookOpen} className="size-5 text-primary" />
                  <span className="font-bold">Al-Qur&apos;an</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                >
                  <FontAwesomeIcon icon={faTimes} className="size-4" />
                </button>
              </div>

              {/* User Info */}
              {user && (
                <div className="border-b border-border px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {user.registration_number && (
                    <p className="mt-2 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                      Reg: {user.registration_number}
                    </p>
                  )}
                </div>
              )}

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="mb-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={link.icon} className="size-4" />
                      {link.label}
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="size-3" />
                  </Link>
                ))}
              </nav>

              {/* Logout */}
              {user && (
                <div className="border-t border-border p-3">
                  <button
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
