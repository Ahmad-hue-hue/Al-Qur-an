"use client"

import { useAdminMarhalas, useAdminStudents } from "@/lib/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers, faGraduationCap, faBookOpen } from "@fortawesome/free-solid-svg-icons"

export default function AdminDashboardPage() {
  const { data: marhalas = [], isLoading: marhalasLoading } = useAdminMarhalas()
  const { data: students = [], isLoading: studentsLoading } = useAdminStudents()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
        Admin Dashboard
      </h1>

      <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
        {[
          {
            label: "Marhalas",
            value: marhalas.length,
            icon: faGraduationCap,
            loading: marhalasLoading,
          },
          {
            label: "Students",
            value: students.length,
            icon: faUsers,
            loading: studentsLoading,
          },
          {
            label: "Courses",
            value: marhalas.reduce((sum: number, m: any) => sum + (m.courses_count || 0), 0),
            icon: faBookOpen,
            loading: marhalasLoading,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground sm:text-sm">{stat.label}</span>
              <FontAwesomeIcon icon={stat.icon} className="size-3 text-muted-foreground sm:size-4" />
            </div>
            {stat.loading ? (
              <Skeleton className="h-6 w-12 sm:h-8" />
            ) : (
              <div className="text-xl font-bold sm:text-2xl">{stat.value}</div>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold text-foreground sm:mb-4 sm:text-xl">
        Recent Students
      </h2>
      {studentsLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 sm:h-16" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          No students registered yet
        </div>
      ) : (
        <div className="space-y-2">
          {students.slice(0, 10).map((student: any) => (
            <div key={student.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary sm:size-10">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{student.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {student.registration_number || "-"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
