"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut, User } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="size-6 text-primary" />
          <span className="text-xl font-bold">Al-Qur&apos;an</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="mr-2 size-4" />
                  {user.name}
                </Button>
              </Link>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
