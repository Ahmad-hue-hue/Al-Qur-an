"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useMarhala, useMarhalaCourses, useEnroll, useMyMarhalas } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Lock, ArrowRight, CheckCircle } from "lucide-react"

export default function MarhalaDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const { data: marhala, isLoading: marhalaLoading } = useMarhala(id as string)
  const { data: courses = [], isLoading: coursesLoading } = useMarhalaCourses(id as string)
  const { data: myMarhalas = [] } = useMyMarhalas()
  const enrollMutation = useEnroll()

  const enrolled = myMarhalas.some((e: any) => e.marhala.id === Number(id))
  const loading = marhalaLoading || coursesLoading

  const handleEnroll = () => {
    enrollMutation.mutate(Number(id), {
      onError: () => alert("Cannot enroll. Complete previous marhala first."),
    })
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (!marhala) {
    return <div className="py-12 text-center text-muted-foreground">Marhala not found</div>
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{marhala.title}</h1>
        <p className="mt-2 text-muted-foreground">{marhala.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <Badge variant="secondary">Pass: {marhala.passing_threshold}%</Badge>
          <span className="text-sm text-muted-foreground">
            {courses.length} courses
          </span>
        </div>
      </div>

      {!enrolled && (
        <Card className="mb-8">
          <CardContent className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">
              Enroll in this marhala to start learning
            </p>
            <Button onClick={handleEnroll} disabled={enrollMutation.isPending}>
              {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Courses</h2>
        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No courses available yet
            </CardContent>
          </Card>
        ) : (
          courses.map((course: any) => (
            <Card
              key={course.id}
              className={`transition-shadow ${course.is_unlocked ? "hover:shadow-lg" : "opacity-60"}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {course.is_unlocked ? (
                        <CheckCircle className="size-5 text-green-500" />
                      ) : (
                        <Lock className="size-5 text-muted-foreground" />
                      )}
                      Course {course.order}: {course.title}
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                  {course.is_unlocked && (
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        Start <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-muted-foreground">
                  {course.lessons_count} lessons
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
