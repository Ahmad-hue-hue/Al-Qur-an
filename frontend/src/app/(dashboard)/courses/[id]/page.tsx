"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useCourse } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Lock, CheckCircle, ArrowRight } from "lucide-react"

export default function CourseDetailPage() {
  const { id } = useParams()
  const { data: course, isLoading } = useCourse(id as string)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    )
  }

  if (!course) {
    return <div className="py-12 text-center text-muted-foreground">Course not found</div>
  }

  const completedLessons = course.lessons?.filter((l: any) => l.is_completed).length || 0
  const totalLessons = course.lessons?.length || 0
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 text-sm text-muted-foreground">
          Course {course.order}
        </div>
        <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
        <p className="mt-2 text-muted-foreground">{course.description}</p>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedLessons}/{totalLessons} lessons completed
            </span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="w-full" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Lessons</h2>
        {course.lessons?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No lessons available yet
            </CardContent>
          </Card>
        ) : (
          course.lessons?.map((lesson: any, index: number) => {
            const isUnlocked = index === 0 || course.lessons[index - 1].is_completed
            return (
              <Card
                key={lesson.id}
                className={`transition-shadow ${isUnlocked ? "hover:shadow-lg" : "opacity-60"}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {lesson.is_completed ? (
                        <CheckCircle className="size-5 text-green-500" />
                      ) : isUnlocked ? (
                        <div className="flex size-5 items-center justify-center rounded-full border-2 border-primary text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                      ) : (
                        <Lock className="size-5 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-base">
                          Lesson {lesson.order}: {lesson.title}
                        </CardTitle>
                        <CardDescription>
                          {lesson.duration_minutes} min
                        </CardDescription>
                      </div>
                    </div>
                    {isUnlocked && (
                      <Link href={`/lessons/${lesson.id}`}>
                        <Button variant="ghost" size="sm">
                          {lesson.is_completed ? "Review" : "Start"} <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
