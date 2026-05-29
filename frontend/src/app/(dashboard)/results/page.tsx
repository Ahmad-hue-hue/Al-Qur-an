"use client"

import Link from "next/link"
import { useMyResults } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAward, faArrowRight } from "@fortawesome/free-solid-svg-icons"

export default function ResultsPage() {
  const { data: results = [], isLoading } = useMyResults()

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
          My Results
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 sm:h-32" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:py-12">
            <FontAwesomeIcon
              icon={faAward}
              className="mb-3 size-10 text-muted-foreground sm:mb-4 sm:size-12"
            />
            <p className="mb-2 text-sm text-muted-foreground sm:mb-4">No results yet</p>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Complete tests to see your results here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result: any) => (
              <div key={result.id} className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{result.marhala_title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Attempt #{result.attempt_number}
                    </p>
                  </div>
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.passed ? "Passed" : "Failed"}
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-medium">{result.average_score}%</span>
                  </div>
                  <Progress value={parseFloat(result.average_score)} className="w-full" />
                </div>
                <Link href={`/results/${result.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details{" "}
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1 size-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
