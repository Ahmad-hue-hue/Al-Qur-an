"use client"

import { useParams } from "next/navigation"
import { useAdminStudentResults } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminStudentDetailPage() {
  const { id } = useParams()
  const { data: results = [], isLoading } = useAdminStudentResults(id as string)

  return (
    <div>
      <Link href="/admin/students" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 size-4" /> Back to Students
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-foreground">Student Progress</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No results found for this student
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result: any) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{result.marhala_title}</CardTitle>
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.passed ? "Passed" : "Failed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-medium">{result.average_score}%</span>
                </div>
                <Progress value={parseFloat(result.average_score)} className="w-full" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Attempt #{result.attempt_number} • {new Date(result.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
