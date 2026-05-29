"use client"

import Link from "next/link"
import { useMyResults } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award } from "lucide-react"

export default function ResultsPage() {
  const { data: results = [], isLoading } = useMyResults()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">My Results</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">No results yet</p>
            <p className="text-sm text-muted-foreground">
              Complete tests to see your results here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result: any) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{result.marhala_title}</CardTitle>
                    <CardDescription>Attempt #{result.attempt_number}</CardDescription>
                  </div>
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.passed ? "Passed" : "Failed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-medium">{result.average_score}%</span>
                    </div>
                    <Progress value={parseFloat(result.average_score)} className="w-full" />
                  </div>
                </div>
                <Link href={`/results/${result.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
