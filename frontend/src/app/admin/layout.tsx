"use client"

import { useAuth } from "@/hooks/useAuth"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-56px)] sm:min-h-[calc(100dvh-64px)]">
        <div className="hidden w-56 animate-pulse bg-muted md:block lg:w-64" />
        <div className="flex-1 p-4 sm:p-8">
          <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted sm:mb-8 sm:h-8" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-muted sm:h-20" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Access denied. Admin only.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100dvh-56px)] sm:min-h-[calc(100dvh-64px)]">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4 sm:p-8">
        <div className="mb-4 flex items-center gap-3 md:hidden">
          <MobileNav />
          <span className="text-sm font-medium text-muted-foreground">Admin Panel</span>
        </div>
        {children}
      </div>
    </div>
  )
}
