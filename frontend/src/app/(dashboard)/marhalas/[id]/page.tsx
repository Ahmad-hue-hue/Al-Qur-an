"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useMarhala, useMarhalaCourses, useEnroll, useMyMarhalas } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faStar,
  faUsers,
  faClock,
  faBookOpen,
  faClipboardList,
  faCheckCircle,
  faLock,
  faArrowRight,
  faAward,
  faCertificate,
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
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="mb-6 h-64" />
          <Skeleton className="h-48" />
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

        {/* Header Section */}
        <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/5 md:aspect-auto md:w-2/5">
              {marhala.image ? (
                <Image
                  src={marhala.image}
                  alt={marhala.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center">
                  <div className="flex size-20 items-center justify-center rounded-3xl bg-primary/20 text-3xl font-bold text-primary">
                    {marhala.order}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 p-4 sm:p-6">
              <div className="mb-2">
                <Badge className="bg-primary text-primary-foreground">
                  المستوى {marhala.order}
                </Badge>
              </div>
              <h1 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                {marhala.title}
              </h1>
              <p className="mb-4 text-sm text-muted-foreground sm:text-base">
                {marhala.description}
              </p>

              {/* Stats */}
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="size-3 text-amber-400" />
                  4.8 rating
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faUsers} className="size-3" />
                  {Math.floor(Math.random() * 5000) + 1000} students
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faBookOpen} className="size-3" />
                  {courses.length} courses
                </span>
              </div>

              {/* Pass Rate */}
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary">
                  Pass: {marhala.passing_threshold}%
                </Badge>
                <Badge variant="outline">
                  <FontAwesomeIcon icon={faCertificate} className="mr-1 size-3" />
                  Certificate
                </Badge>
              </div>

              {/* Enroll Button */}
              {enrolled ? (
                <Link href={`/courses/${courses[0]?.id}`}>
                  <Button className="w-full sm:w-auto">
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2 size-4" />
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {enrollMutation.isPending ? "Enrolling..." : "Enroll Now — Free"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 sm:w-auto sm:grid-cols-none">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground sm:text-xl">
                عن الدورة
              </h2>
              <div className="prose prose-slate max-w-none text-sm dark:prose-invert sm:text-base">
                <p className="mb-4">{marhala.description}</p>
                <h3 className="text-base font-semibold">ما سيتعلمه الطالب:</h3>
                <ul className="mb-4 list-inside list-disc space-y-2 text-muted-foreground">
                  <li>قواعد التجويد fundamentals</li>
                  <li>أحكام النون الساكنة والتنوين</li>
                  <li>أحكام الميم الساكنة</li>
                  <li>المخارج والصفات</li>
                  <li>الوقف والابتداء</li>
                </ul>
                <h3 className="text-base font-semibold">المتطلبات:</h3>
                <p className="text-muted-foreground">
                  القدرة على القراءة والكتابة بالعربية
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="mt-0">
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                  محتوى الدورة
                </h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {courses.length} courses • {courses.reduce((sum: number, c: any) => sum + (c.lessons_count || 0), 0)} lessons
                </p>
              </div>

              {courses.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No content available yet
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {courses.map((course: any, index: number) => (
                    <AccordionItem key={course.id} value={`course-${course.id}`}>
                      <AccordionTrigger className="px-4 sm:px-5">
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground">
                              {course.title}
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({course.lessons_count} lessons)
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 sm:px-5">
                        <div className="space-y-1.5">
                          {course.lessons?.map((lesson: any) => (
                            <Link
                              key={lesson.id}
                              href={`/lessons/${lesson.id}`}
                              className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                  {lesson.order}
                                </div>
                                <span className="text-foreground">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  <FontAwesomeIcon icon={faClock} className="mr-1 size-2.5" />
                                  {lesson.duration_minutes}m
                                </span>
                                {lesson.is_completed ? (
                                  <FontAwesomeIcon icon={faCheckCircle} className="size-4 text-green-500" />
                                ) : (
                                  <FontAwesomeIcon icon={faArrowRight} className="size-3 text-muted-foreground" />
                                )}
                              </div>
                            </Link>
                          ))}
                          {/* Test placeholder */}
                          <div className="flex items-center justify-between rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faClipboardList} className="size-4 text-primary" />
                              <span className="text-primary font-medium">Quiz</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {course.is_unlocked ? "Available" : "Locked"}
                            </Badge>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-0">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground sm:text-4xl">4.8</div>
                  <div className="mb-1 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon={faStar}
                        className={`size-4 ${star <= 4 ? "text-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">1,059 ratings</div>
                </div>
                <div className="flex-1 space-y-1">
                  {[
                    { stars: 5, count: 1002, percent: 95 },
                    { stars: 4, count: 38, percent: 4 },
                    { stars: 3, count: 11, percent: 1 },
                    { stars: 2, count: 2, percent: 0 },
                    { stars: 1, count: 6, percent: 1 },
                  ].map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-muted-foreground">{rating.stars}</span>
                      <FontAwesomeIcon icon={faStar} className="size-2.5 text-amber-400" />
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${rating.percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">
                        {rating.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-4">
                {[
                  { name: "Student A", comment: "دورة ممتازة ومفيدة جداً", time: "2 days ago" },
                  { name: "Student B", comment: "Barakallahu feek", time: "3 days ago" },
                  { name: "Student C", comment: "جزاكم الله خيرا", time: "1 week ago" },
                ].map((review, i) => (
                  <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="mb-1 flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesomeIcon
                              key={star}
                              icon={faStar}
                              className="size-2.5 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">{review.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
