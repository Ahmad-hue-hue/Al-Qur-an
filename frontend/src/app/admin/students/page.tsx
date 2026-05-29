"use client"

import { useState } from "react"
import Link from "next/link"
import { useAdminStudents } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons"

export default function AdminStudentsPage() {
  const { data: students = [], isLoading } = useAdminStudents()
  const [search, setSearch] = useState("")

  const filtered = students.filter(
    (s: any) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.registration_number && s.registration_number.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
        Students
      </h1>

      <div className="mb-4 relative sm:mb-6">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search students..."
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 sm:h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          {search ? "No students match your search" : "No students registered yet"}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((student: any) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary sm:size-10">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{student.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {student.registration_number ? (
                  <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
                    {student.registration_number}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="hidden text-xs sm:inline-flex">
                    No reg #
                  </Badge>
                )}
                <Link href={`/admin/students/${student.id}`}>
                  <Button variant="ghost" size="sm">
                    <FontAwesomeIcon icon={faArrowRight} className="size-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
