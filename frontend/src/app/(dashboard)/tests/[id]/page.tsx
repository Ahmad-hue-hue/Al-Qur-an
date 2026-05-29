"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useCourseTest, useSubmitTest } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faArrowRight,
  faClock,
  faCheckCircle,
  faCircleXmark,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons"

export default function TestPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: test, isLoading } = useCourseTest(id as string)
  const submitMutation = useSubmitTest()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [result, setResult] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (test) setTimeLeft(test.time_limit_minutes * 60)
  }, [test])

  useEffect(() => {
    if (timeLeft > 0 && !result) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !result && test) {
      handleSubmit()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, result, test])

  const handleAnswer = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = () => {
    if (!test || submitMutation.isPending) return
    submitMutation.mutate(
      { testId: test.id, answers },
      { onSuccess: (data) => setResult(data) }
    )
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-2xl">
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Test not found
      </div>
    )
  }

  if (result) {
    return (
      <div className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-lg">
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
            <FontAwesomeIcon
              icon={result.passed ? faCheckCircle : faCircleXmark}
              className={`mb-4 size-14 ${
                result.passed ? "text-green-500" : "text-red-500"
              }`}
            />
            <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
              {result.passed ? "Congratulations!" : "Keep Practicing"}
            </h2>
            <div className="mb-4 text-5xl font-bold">{result.score}%</div>
            <Badge
              variant={result.passed ? "default" : "destructive"}
              className="mb-6 text-sm"
            >
              {result.passed ? "Passed" : "Failed"}
            </Badge>
            <div>
              <Button onClick={() => router.back()}>Back to Course</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = test.questions[currentQuestion]
  const totalQuestions = test.questions.length
  const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClipboardList} className="size-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground sm:text-xl">{test.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="size-4 text-muted-foreground" />
            <span
              className={`font-mono text-sm font-medium ${
                timeLeft < 60 ? "text-red-500" : "text-foreground"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4 sm:mb-6">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:mb-8 sm:p-6">
          <h2 className="mb-4 text-base font-medium text-foreground sm:text-lg">
            {question.text}
          </h2>
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
          >
            {question.options.map((option: any) => (
              <label
                key={option.id}
                htmlFor={`option-${option.id}`}
                className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors sm:p-4 ${
                  answers[question.id] === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                }`}
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
                />
                <span className="text-sm text-foreground">{option.text}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 size-4" /> Previous
          </Button>
          {currentQuestion === totalQuestions - 1 ? (
            <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit Test"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              Next <FontAwesomeIcon icon={faArrowRight} className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
