"use client"

import { useAdminMarhalas, useAdminStudents } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, GraduationCap, BookOpen } from "lucide-react"

export default function AdminDashboardPage() {
  const { data: marhalas = [], isLoading: marhalasLoading } = useAdminMarhalas()
  const { data: students = [], isLoading: studentsLoading } = useAdminStudents()

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Marhalas</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {marhalasLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{marhalas.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{students.length}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {marhalasLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {marhalas.reduce((sum: number, m: any) => sum + (m.courses_count || 0), 0)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Students</h2>
      {studentsLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No students registered yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {students.slice(0, 10).map((student: any) => (
            <Card key={student.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {student.registration_number || "No reg number"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
