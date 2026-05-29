"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useMarhalas } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSearch,
  faStar,
  faUsers,
  faArrowRight,
  faLock,
  faFilter,
} from "@fortawesome/free-solid-svg-icons"

const levelColors: Record<number, string> = {
  1: "bg-emerald-500",
  2: "bg-blue-500",
  3: "bg-purple-500",
  4: "bg-amber-500",
}

const levelNames: Record<number, string> = {
  1: "Foundation",
  2: "Intermediate",
  3: "Advanced",
  4: "Mastery",
}

export default function MarhalasPage() {
  const { data: marhalas = [], isLoading } = useMarhalas()
  const [search, setSearch] = useState("")

  const filtered = marhalas.filter((m: any) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            الدورات
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            اختر المستوى المناسب وابدأ رحلة تعلم القرآن والتجويد
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-2 sm:mb-8">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="ابحث في الدورات..."
              className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 shrink-0">
            <FontAwesomeIcon icon={faFilter} className="size-4" />
          </Button>
        </div>

        {/* Marhala Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">لا توجد دورات مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {filtered.map((marhala: any) => (
              <Link
                key={marhala.id}
                href={`/marhalas/${marhala.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                {/* Card Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                  {marhala.image ? (
                    <Image
                      src={marhala.image}
                      alt={marhala.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-bold text-primary">
                        {marhala.order}
                      </div>
                    </div>
                  )}
                  {/* Level Badge */}
                  <div className="absolute left-3 top-3">
                    <Badge className={`${levelColors[marhala.order]} text-white`}>
                      {levelNames[marhala.order]}
                    </Badge>
                  </div>
                  {/* Lock indicator */}
                  {!marhala.is_visible && (
                    <div className="absolute right-3 top-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-black/50">
                        <FontAwesomeIcon icon={faLock} className="size-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5">
                  {/* Rating */}
                  <div className="mb-2 flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className={`size-3 ${
                            star <= 4 ? "text-amber-400" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      (4.{Math.floor(Math.random() * 9) + 1})
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary sm:text-lg">
                    {marhala.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-3 text-xs text-muted-foreground line-clamp-2 sm:text-sm">
                    {marhala.description || "iswa msinga ya kujifunza Quran na Tajweed"}
                  </p>

                  {/* Stats */}
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUsers} className="size-3" />
                      {Math.floor(Math.random() * 5000) + 1000} students
                    </span>
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faStar} className="size-3" />
                      {marhala.courses_count} courses
                    </span>
                  </div>

                  {/* Pass Rate */}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <Badge variant="secondary" className="text-xs">
                      Pass: {marhala.passing_threshold}%
                    </Badge>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                      {marhala.is_visible ? "Enroll Now" : "View Details"}
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
