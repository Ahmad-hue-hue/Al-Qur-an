"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faTimes,
  faHome,
  faClipboardList,
  faAward,
  faSignOutAlt,
  faUser,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

export function Navbar() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="Quran Learning & Tajweed Program"
            width={36}
            height={36}
            className="rounded-full sm:h-10 sm:w-10"
          />
          <span className="hidden text-sm font-bold text-primary sm:block lg:text-base">
            Qur&apos;an & Tajweed
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 sm:flex sm:gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FontAwesomeIcon icon={faHome} className="size-4" />
                Dashboard
              </Link>
              <Link
                href="/marhalas"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FontAwesomeIcon icon={faClipboardList} className="size-4" />
                Marhalas
              </Link>
              <Link
                href="/results"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FontAwesomeIcon icon={faAward} className="size-4" />
                Results
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  Admin
                </Link>
              )}
              <div className="ml-2 flex items-center gap-2 border-l border-border pl-4">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-sm font-medium lg:inline">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Logout"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted sm:hidden"
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="size-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-3 sm:hidden">
          {user ? (
            <div className="space-y-1">
              <div className="mb-3 flex items-center gap-3 border-b border-border pb-3">
                <Image
                  src="/logo.jpeg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FontAwesomeIcon icon={faHome} className="size-4" />
                Dashboard
              </Link>
              <Link
                href="/marhalas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FontAwesomeIcon icon={faClipboardList} className="size-4" />
                Marhalas
              </Link>
              <Link
                href="/results"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FontAwesomeIcon icon={faAward} className="size-4" />
                Results
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <FontAwesomeIcon icon={faUser} className="size-4" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="size-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-muted"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
