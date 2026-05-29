"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useCourseTest, useSubmitTest } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react"

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
    if (test) {
      setTimeLeft(test.time_limit_minutes * 60)
    }
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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!test) {
    return <div className="py-12 text-center text-muted-foreground">Test not found</div>
  }

  if (result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            {result.passed ? (
              <CheckCircle className="mx-auto mb-4 size-12 text-green-500" />
            ) : (
              <XCircle className="mx-auto mb-4 size-12 text-red-500" />
            )}
            <CardTitle className="text-2xl">
              {result.passed ? "Congratulations!" : "Keep Practicing"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 text-4xl font-bold">{result.score}%</div>
            <Badge variant={result.passed ? "default" : "destructive"}>
              {result.passed ? "Passed" : "Failed"}
            </Badge>
            <div className="mt-8">
              <Button onClick={() => router.back()}>Back to Course</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = test.questions[currentQuestion]
  const totalQuestions = test.questions.length

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{test.title}</h1>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span className={`font-mono ${timeLeft < 60 ? "text-red-500" : ""}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">{question.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
          >
            {question.options.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="mr-2 size-4" /> Previous
        </Button>
        {currentQuestion === totalQuestions - 1 ? (
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? "Submitting..." : "Submit Test"}
          </Button>
        ) : (
          <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
            Next <ArrowRight className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
