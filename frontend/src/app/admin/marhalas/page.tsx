"use client"

import { useAdminMarhalas } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit, Eye, EyeOff } from "lucide-react"

export default function AdminMarhalasPage() {
  const { data: marhalas = [], isLoading } = useAdminMarhalas()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Manage Marhalas</h1>
        <Button>
          <Plus className="mr-2 size-4" /> Add Marhala
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {marhalas.map((marhala: any) => (
            <Card key={marhala.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                      {marhala.order}
                    </div>
                    <div>
                      <CardTitle>{marhala.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {marhala.courses_count} courses • Pass: {marhala.passing_threshold}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={marhala.is_visible ? "default" : "secondary"}>
                      {marhala.is_visible ? (
                        <><Eye className="mr-1 size-3" /> Visible</>
                      ) : (
                        <><EyeOff className="mr-1 size-3" /> Hidden</>
                      )}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
