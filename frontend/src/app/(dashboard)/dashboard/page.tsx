"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useMyMarhalas } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, BookOpen, Award, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: enrollments = [], isLoading } = useMyMarhalas()

  const completedCount = enrollments.filter((e: any) => e.status === "completed").length
  const activeCount = enrollments.filter((e: any) => e.status === "active").length

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name}
        </h1>
        {user?.registration_number && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-sm">
              Registration: {user.registration_number}
            </Badge>
          </div>
        )}
        <p className="mt-2 text-muted-foreground">
          Continue your learning journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Marhalas</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Marhalas */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">My Marhalas</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="mb-4 text-muted-foreground">You haven&apos;t enrolled in any marhalas yet</p>
              <Link href="/marhalas">
                <Button>Browse Marhalas</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment: any) => (
              <Card key={enrollment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{enrollment.marhala.title}</CardTitle>
                      <CardDescription>
                        Marhala {enrollment.marhala.order}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        enrollment.status === "completed"
                          ? "default"
                          : enrollment.status === "active"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {enrollment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Progress value={enrollment.status === "completed" ? 100 : 50} className="flex-1" />
                    <Link href={`/marhalas/${enrollment.marhala.id}`}>
                      <Button variant="ghost" size="sm">
                        View <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
