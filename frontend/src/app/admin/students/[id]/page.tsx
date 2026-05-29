"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useAdminStudentResults } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

export default function AdminStudentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: results = [], isLoading } = useAdminStudentResults(id as string)

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground sm:mb-6"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="size-3" /> Back to Students
      </button>

      <h1 className="mb-6 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
        Student Progress
      </h1>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 sm:h-32" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
          No results found for this student
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result: any) => (
            <div key={result.id} className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground sm:text-base">
                  {result.marhala_title}
                </h3>
                <Badge variant={result.passed ? "default" : "destructive"}>
                  {result.passed ? "Passed" : "Failed"}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-medium">{result.average_score}%</span>
                </div>
                <Progress value={parseFloat(result.average_score)} className="w-full" />
              </div>
              <p className="text-xs text-muted-foreground">
                Attempt #{result.attempt_number} •{" "}
                {new Date(result.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
