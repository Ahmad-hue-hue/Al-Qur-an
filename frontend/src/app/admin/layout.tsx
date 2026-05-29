"use client"

import { useAuth } from "@/hooks/useAuth"
import { Sidebar } from "@/components/layout/Sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)]">
        <div className="w-64 animate-pulse bg-muted" />
        <div className="flex-1 p-8">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  )
}
