"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useRef } from "react"
import Image from "next/image"
import { useLesson, useCompleteLesson } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faPlay,
  faPause,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons"

export default function LessonPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: lesson, isLoading } = useLesson(id as string)
  const completeMutation = useCompleteLesson()
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleComplete = () => {
    completeMutation.mutate(Number(id), {
      onSuccess: (data) => {
        if (data.next_lesson_id) {
          router.push(`/lessons/${data.next_lesson_id}`)
        } else if (lesson?.course) {
          router.push(`/courses/${lesson.course}`)
        }
      },
    })
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setPlaying(!playing)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="mb-6 h-48 sm:h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Lesson not found
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="size-3" /> Back
        </button>

        {/* Lesson Header */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:mb-8 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              {lesson.order}
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground sm:text-xl">
                {lesson.title}
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Lesson {lesson.order}
              </p>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {lesson.audio_file && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleAudio}
                className="size-12 shrink-0 rounded-full"
              >
                <FontAwesomeIcon icon={playing ? faPause : faPlay} className="size-5" />
              </Button>
              <div className="flex-1">
                <audio
                  ref={audioRef}
                  src={lesson.audio_file}
                  onEnded={() => setPlaying(false)}
                />
                <p className="text-sm font-medium text-foreground">Audio Recitation</p>
                <p className="text-xs text-muted-foreground">Listen and follow along</p>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Content */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:mb-8 sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FontAwesomeIcon icon={faBookOpen} className="size-4" />
            Lesson Content
          </div>
          <div
            className="prose prose-slate max-w-none text-sm dark:prose-invert sm:text-base"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* Complete Button */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <Button variant="outline" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 size-4" /> Back
          </Button>
          {lesson.is_completed ? (
            <div className="flex items-center gap-2 text-green-600">
              <FontAwesomeIcon icon={faCheckCircle} className="size-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          ) : (
            <Button onClick={handleComplete} disabled={completeMutation.isPending}>
              {completeMutation.isPending ? (
                "Completing..."
              ) : (
                <>
                  Mark as Complete
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
