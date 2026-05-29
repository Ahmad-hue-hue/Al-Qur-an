"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useMyMarhalas } from "@/lib/hooks"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGraduationCap,
  faBookOpen,
  faAward,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons"

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: enrollments = [], isLoading } = useMyMarhalas()

  const completedCount = enrollments.filter((e: any) => e.status === "completed").length
  const activeCount = enrollments.filter((e: any) => e.status === "active").length

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {user?.name}
          </h1>
          {user?.registration_number && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                Registration: {user.registration_number}
              </Badge>
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
          {[
            { label: "Enrolled", value: enrollments.length, icon: faGraduationCap },
            { label: "Completed", value: completedCount, icon: faAward },
            { label: "Active", value: activeCount, icon: faBookOpen },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground sm:text-sm">{stat.label}</span>
                <FontAwesomeIcon icon={stat.icon} className="size-3 text-muted-foreground sm:size-4" />
              </div>
              <div className="text-xl font-bold sm:text-2xl">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Enrolled Marhalas */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground sm:mb-4 sm:text-xl">
            My Marhalas
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 sm:h-28" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:py-12">
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="mb-3 size-10 text-muted-foreground sm:mb-4 sm:size-12"
              />
              <p className="mb-3 text-sm text-muted-foreground sm:mb-4">
                You haven&apos;t enrolled in any marhalas yet
              </p>
              <Link href="/marhalas">
                <Button size="sm">Browse Marhalas</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {enrollment.marhala.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Marhala {enrollment.marhala.order}
                      </p>
                    </div>
                    <Badge
                      variant={
                        enrollment.status === "completed"
                          ? "default"
                          : enrollment.status === "active"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {enrollment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={enrollment.status === "completed" ? 100 : 50} className="flex-1" />
                    <Link href={`/marhalas/${enrollment.marhala.id}`}>
                      <Button variant="ghost" size="sm">
                        <FontAwesomeIcon icon={faArrowRight} className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
