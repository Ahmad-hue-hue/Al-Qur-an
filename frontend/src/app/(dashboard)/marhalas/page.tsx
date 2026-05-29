"use client"

import Link from "next/link"
import { useMarhalas } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons"

export default function MarhalasPage() {
  const { data: marhalas = [], isLoading } = useMarhalas()

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
          Marhalas
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 sm:h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {marhalas.map((marhala: any) => (
              <div
                key={marhala.id}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="p-4 sm:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                        {marhala.order}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{marhala.title}</h3>
                        <p className="text-xs text-muted-foreground">Marhala {marhala.order}</p>
                      </div>
                    </div>
                    {!marhala.is_visible && (
                      <FontAwesomeIcon icon={faLock} className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {marhala.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {marhala.courses_count} courses • {marhala.passing_threshold}%
                    </span>
                    <Link href={`/marhalas/${marhala.id}`}>
                      <Button variant="ghost" size="sm">
                        View <FontAwesomeIcon icon={faArrowRight} className="ml-1 size-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
