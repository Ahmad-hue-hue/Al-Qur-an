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
  faStar,
  faUsers,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons"

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: enrollments = [], isLoading } = useMyMarhalas()

  const completedCount = enrollments.filter((e: any) => e.status === "completed").length
  const activeCount = enrollments.filter((e: any) => e.status === "active").length

  return (
    <div className="px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
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

        {/* Enrolled Marhalas */}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm sm:py-16">
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="mb-4 size-12 text-muted-foreground"
              />
              <p className="mb-2 text-base font-medium text-foreground">
                No Enrolled Marhalas Yet
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                Browse our courses and start your Tajweed journey
              </p>
              <Link href="/marhalas">
                <Button>
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2 size-4" />
                  Browse Marhalas
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {enrollments.map((enrollment: any) => (
                <Link
                  key={enrollment.id}
                  href={`/marhalas/${enrollment.marhala.id}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
                >
                  {/* Card Image */}
                  <div className="relative aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/5">
                    {enrollment.marhala.image ? (
                      <Image
                        src={enrollment.marhala.image}
                        alt={enrollment.marhala.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-bold text-primary">
                          {enrollment.marhala.order}
                        </div>
                      </div>
                    )}
                    <div className="absolute left-3 top-3">
                      <Badge className="bg-primary text-primary-foreground">
                        المستوى {enrollment.marhala.order}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className={`size-3 ${star <= 4 ? "text-amber-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground group-hover:text-primary sm:text-lg">
                      {enrollment.marhala.title}
                    </h3>
                    <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUsers} className="size-3" />
                        {Math.floor(Math.random() * 5000) + 1000}
                      </span>
                      <Badge variant={enrollment.status === "completed" ? "default" : "secondary"}>
                        {enrollment.status}
                      </Badge>
                    </div>
                    <Progress
                      value={enrollment.status === "completed" ? 100 : 50}
                      className="w-full"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA for non-enrolled */}
        {enrollments.length === 0 && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
            <FontAwesomeIcon icon={faCertificate} className="mb-3 size-10 text-primary" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Start Your Tajweed Journey
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Enroll in Marhala 1 and earn your certificate upon completion
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
