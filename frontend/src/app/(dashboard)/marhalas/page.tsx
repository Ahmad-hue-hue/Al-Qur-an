"use client"

import Link from "next/link"
import Image from "next/image"
import { useMarhalas } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faBookOpen,
  faClock,
  faClipboardList,
  faLock,
} from "@fortawesome/free-solid-svg-icons"

export default function MarhalasPage() {
  const { data: marhalas = [], isLoading } = useMarhalas()

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={64}
            height={64}
            className="mx-auto mb-3 rounded-full sm:mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Qur&apos;an & Tajweed Marhalas
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Select a marhala to view its courses and lessons
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 sm:h-56" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {marhalas.map((marhala: any) => (
              <Link
                key={marhala.id}
                href={`/marhalas/${marhala.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/20"
              >
                {/* Card Header with Marhala Number */}
                <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                      {marhala.order}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        {marhala.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Marhala {marhala.order} of 4
                      </p>
                    </div>
                  </div>
                  {!marhala.is_visible && (
                    <FontAwesomeIcon icon={faLock} className="size-4 text-muted-foreground" />
                  )}
                </div>

                {/* Card Body - Lesson Preview */}
                <div className="px-4 py-3 sm:px-5 sm:py-4">
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {marhala.description || "No description available"}
                  </p>

                  {/* Lesson List Preview */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <FontAwesomeIcon icon={faBookOpen} className="size-3" />
                      What you&apos;ll find:
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {[
                        "Quran recitation with Tajweed rules",
                        "Pronunciation and articulation points",
                        "Practical recitation exercises",
                      ].map((lesson, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="size-1.5 shrink-0 rounded-full bg-primary/40" />
                          {lesson}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClipboardList} className="size-3" />
                        {marhala.courses_count} courses
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="size-3" />
                        {marhala.passing_threshold}% pass
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                      View Lessons
                      <FontAwesomeIcon icon={faArrowRight} className="size-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
