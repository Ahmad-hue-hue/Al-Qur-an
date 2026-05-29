"use client"

import { useAdminMarhalas } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faEdit, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

export default function AdminMarhalasPage() {
  const { data: marhalas = [], isLoading } = useAdminMarhalas()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Manage Marhalas</h1>
        <Button size="sm">
          <FontAwesomeIcon icon={faPlus} className="mr-1 size-3" /> Add
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 sm:h-24" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {marhalas.map((marhala: any) => (
            <div key={marhala.id} className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {marhala.order}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">
                      {marhala.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {marhala.courses_count} courses • {marhala.passing_threshold}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={marhala.is_visible ? "default" : "secondary"}>
                    <FontAwesomeIcon
                      icon={marhala.is_visible ? faEye : faEyeSlash}
                      className="mr-1 size-2"
                    />
                    {marhala.is_visible ? "Visible" : "Hidden"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <FontAwesomeIcon icon={faEdit} className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
