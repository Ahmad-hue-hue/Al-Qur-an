"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useResultDetail } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheckCircle,
  faXCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons"

export default function ResultDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: result, isLoading } = useResultDetail(id as string)

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-lg">
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="h-48 sm:h-64" />
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Result not found
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-lg">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="size-3" /> Back to Results
        </button>

        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <FontAwesomeIcon
            icon={result.passed ? faCheckCircle : faXCircle}
            className={`mb-4 size-12 sm:size-14 ${
              result.passed ? "text-green-500" : "text-red-500"
            }`}
          />
          <h1 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
            {result.passed ? "Marhala Completed!" : "Marhala Not Passed"}
          </h1>
          <p className="mb-4 text-sm text-muted-foreground">{result.marhala_title}</p>

          <div className="mb-4 text-4xl font-bold sm:text-5xl">{result.average_score}%</div>
          <Badge variant={result.passed ? "default" : "destructive"} className="mb-6 text-sm">
            {result.passed ? "Passed" : "Failed"}
          </Badge>

          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{result.average_score}%</span>
            </div>
            <Progress value={parseFloat(result.average_score)} className="w-full" />
          </div>

          <p className="text-xs text-muted-foreground">
            Attempt #{result.attempt_number} •{" "}
            {new Date(result.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
