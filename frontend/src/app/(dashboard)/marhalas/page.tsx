"use client"

import Link from "next/link"
import { useMarhalas } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Lock, ArrowRight } from "lucide-react"

export default function MarhalasPage() {
  const { data: marhalas = [], isLoading } = useMarhalas()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Marhalas</h1>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {marhalas.map((marhala: any) => (
            <Card key={marhala.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{marhala.title}</CardTitle>
                    <CardDescription>Marhala {marhala.order}</CardDescription>
                  </div>
                  {!marhala.is_visible && (
                    <Lock className="size-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {marhala.description || "No description available"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {marhala.courses_count} courses • Pass: {marhala.passing_threshold}%
                  </span>
                  <Link href={`/marhalas/${marhala.id}`}>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
