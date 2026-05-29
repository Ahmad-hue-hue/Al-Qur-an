"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useMarhala, useMarhalaCourses, useEnroll, useMyMarhalas } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLock,
  faArrowRight,
  faCheckCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons"

export default function MarhalaDetailPage() {
  const { id } = useParams()
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
      <div className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="mb-6 h-8 w-48 sm:mb-8" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 sm:h-24" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!marhala) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Marhala not found
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{marhala.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {marhala.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-4">
            <Badge variant="secondary">
              Pass: {marhala.passing_threshold}%
            </Badge>
            <span className="text-xs text-muted-foreground sm:text-sm">
              {courses.length} courses
            </span>
          </div>
        </div>

        {!enrolled && (
          <div className="mb-6 rounded-xl border border-border bg-card p-5 text-center shadow-sm sm:mb-8 sm:p-8">
            <p className="mb-4 text-sm text-muted-foreground">
              Enroll in this marhala to start learning
            </p>
            <Button onClick={handleEnroll} disabled={enrollMutation.isPending}>
              {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
            </Button>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">Courses</h2>
          {courses.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
              No courses available yet
            </div>
          ) : (
            courses.map((course: any) => (
              <div
                key={course.id}
                className={`rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow sm:p-5 ${
                  course.is_unlocked ? "hover:shadow-md" : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {course.is_unlocked ? (
                      <FontAwesomeIcon icon={faCheckCircle} className="size-5 text-green-500" />
                    ) : (
                      <FontAwesomeIcon icon={faLock} className="size-5 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground sm:text-base">
                        Course {course.order}: {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {course.lessons_count} lessons
                      </p>
                    </div>
                  </div>
                  {course.is_unlocked && (
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="ghost" size="sm">
                        <FontAwesomeIcon icon={faArrowRight} className="size-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
