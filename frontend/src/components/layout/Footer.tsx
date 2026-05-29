"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span className="font-semibold">Al-Qur&apos;an Learning Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Al-Qur&apos;an. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
