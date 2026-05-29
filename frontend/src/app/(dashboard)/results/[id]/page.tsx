"use client"

import { useParams } from "next/navigation"
import { useResultDetail } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, XCircle } from "lucide-react"

export default function ResultDetailPage() {
  const { id } = useParams()
  const { data: result, isLoading } = useResultDetail(id as string)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-8 h-12 w-64" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  if (!result) {
    return <div className="py-12 text-center text-muted-foreground">Result not found</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{result.marhala_title}</h1>
        <p className="text-muted-foreground">Result Details</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="text-center">
          {result.passed ? (
            <CheckCircle className="mx-auto mb-4 size-12 text-green-500" />
          ) : (
            <XCircle className="mx-auto mb-4 size-12 text-red-500" />
          )}
          <CardTitle className="text-2xl">
            {result.passed ? "Marhala Completed!" : "Marhala Not Passed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6 text-5xl font-bold">{result.average_score}%</div>
          <Badge variant={result.passed ? "default" : "destructive"} className="text-lg">
            {result.passed ? "Passed" : "Failed"}
          </Badge>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{result.average_score}%</span>
            </div>
            <Progress value={parseFloat(result.average_score)} className="w-full" />
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            Attempt #{result.attempt_number} • {new Date(result.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
