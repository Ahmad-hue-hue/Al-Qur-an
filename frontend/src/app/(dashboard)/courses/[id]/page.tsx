"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useCourse } from "@/lib/hooks"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLock,
  faCheckCircle,
  faArrowRight,
  faArrowLeft,
  faClock,
} from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/navigation"

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: course, isLoading } = useCourse(id as string)

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 sm:h-20" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Course not found
      </div>
    )
  }

  const completedLessons = course.lessons?.filter((l: any) => l.is_completed).length || 0
  const totalLessons = course.lessons?.length || 0
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="size-3" /> Back
        </button>

        <div className="mb-6 sm:mb-8">
          <p className="mb-1 text-xs text-muted-foreground sm:text-sm">
            Course {course.order}
          </p>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{course.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {course.description}
          </p>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">
                {completedLessons}/{totalLessons} lessons
              </span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="w-full" />
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">Lessons</h2>
          {course.lessons?.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
              No lessons available yet
            </div>
          ) : (
            course.lessons?.map((lesson: any, index: number) => {
              const isUnlocked = index === 0 || course.lessons[index - 1].is_completed
              return (
                <div
                  key={lesson.id}
                  className={`rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow sm:p-4 ${
                    isUnlocked ? "hover:shadow-md" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {lesson.is_completed ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="size-5 text-green-500" />
                      ) : isUnlocked ? (
                        <div className="flex size-6 items-center justify-center rounded-full border-2 border-primary text-xs font-bold text-primary sm:size-7">
                          {index + 1}
                        </div>
                      ) : (
                        <FontAwesomeIcon icon={faLock} className="size-5 text-muted-foreground" />
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-foreground sm:text-base">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <FontAwesomeIcon icon={faClock} className="size-3" />
                          {lesson.duration_minutes} min
                        </div>
                      </div>
                    </div>
                    {isUnlocked && (
                      <Link href={`/lessons/${lesson.id}`}>
                        <Button variant="ghost" size="sm">
                          <FontAwesomeIcon
                            icon={lesson.is_completed ? faCheckCircle : faArrowRight}
                            className="size-4"
                          />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
