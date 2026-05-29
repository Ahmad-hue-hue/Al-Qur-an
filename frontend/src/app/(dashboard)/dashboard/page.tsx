"use client"

import Link from "next/link"
import Image from "next/image"
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
  faClipboardList,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: enrollments = [], isLoading } = useMyMarhalas()

  const completedCount = enrollments.filter((e: any) => e.status === "completed").length
  const activeCount = enrollments.filter((e: any) => e.status === "active").length

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Welcome Header */}
        <div className="mb-6 flex items-center gap-4 sm:mb-8">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Welcome, {user?.name}
            </h1>
            {user?.registration_number && (
              <Badge variant="secondary" className="mt-1 text-xs">
                Reg: {user.registration_number}
              </Badge>
            )}
          </div>
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

        {/* Enrolled Marhalas as Cards */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              My Marhalas
            </h2>
            <Link href="/marhalas">
              <Button variant="ghost" size="sm">
                View All <FontAwesomeIcon icon={faArrowRight} className="ml-1 size-3" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 sm:h-32" />
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
                <Button>
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2 size-4" />
                  Browse Marhalas
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment: any) => (
                <Link
                  key={enrollment.id}
                  href={`/marhalas/${enrollment.marhala.id}`}
                  className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:ring-2 hover:ring-primary/20"
                >
                  <div className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                        {enrollment.marhala.order}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground sm:text-base">
                          {enrollment.marhala.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Marhala {enrollment.marhala.order}
                        </p>
                      </div>
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
                  <div className="px-4 py-3 sm:px-5">
                    <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {enrollment.status === "completed" ? "100" : "50"}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.status === "completed" ? 100 : 50}
                      className="w-full"
                    />
                    <div className="mt-2 flex items-center justify-end text-xs font-medium text-primary group-hover:underline">
                      View Courses
                      <FontAwesomeIcon icon={faArrowRight} className="ml-1 size-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA for non-enrolled */}
        {enrollments.length === 0 && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center sm:p-8">
            <FontAwesomeIcon icon={faUserPlus} className="mb-3 size-8 text-primary sm:mb-4" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Start Your Tajweed Journey
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Browse our marhalas and enroll to begin learning
            </p>
            <Link href="/marhalas">
              <Button>
                <FontAwesomeIcon icon={faClipboardList} className="mr-2 size-4" />
                Explore Marhalas
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
