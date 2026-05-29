"use client"

import { useAdminStudents } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

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
      <h1 className="mb-8 text-3xl font-bold text-foreground">Students</h1>

      <div className="mb-6 flex items-center gap-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, email, or registration number..."
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {search ? "No students match your search" : "No students registered yet"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((student: any) => (
            <Card key={student.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {student.registration_number ? (
                    <Badge variant="secondary">{student.registration_number}</Badge>
                  ) : (
                    <Badge variant="outline">No reg #</Badge>
                  )}
                  <Link href={`/admin/students/${student.id}`}>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="ml-1 size-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
