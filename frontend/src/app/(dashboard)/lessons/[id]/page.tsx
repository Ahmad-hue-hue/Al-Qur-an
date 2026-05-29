"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { useLesson, useCompleteLesson } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ArrowRight, CheckCircle, Play, Pause } from "lucide-react"

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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!lesson) {
    return <div className="py-12 text-center text-muted-foreground">Lesson not found</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 text-sm text-muted-foreground">Lesson {lesson.order}</div>
        <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
      </div>

      {lesson.audio_file && (
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={toggleAudio}>
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              </Button>
              <div className="flex-1">
                <audio
                  ref={audioRef}
                  src={lesson.audio_file}
                  onEnded={() => setPlaying(false)}
                />
                <span className="text-sm text-muted-foreground">Audio Recitation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardContent className="py-8">
          <div
            className="prose prose-slate max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        {lesson.is_completed ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="size-5" />
            <span className="font-medium">Completed</span>
          </div>
        ) : (
          <Button onClick={handleComplete} disabled={completeMutation.isPending}>
            {completeMutation.isPending ? "Completing..." : "Mark as Complete"}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
