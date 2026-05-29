import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBookOpen,
  faGraduationCap,
  faAward,
  faArrowRight,
  faClipboardList,
  faLock,
} from "@fortawesome/free-solid-svg-icons"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-12 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 sm:mb-6 sm:size-16">
            <FontAwesomeIcon icon={faBookOpen} className="size-7 text-primary sm:size-8" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:mb-4 sm:text-4xl lg:text-5xl">
            Al-Qur&apos;an Learning Platform
          </h1>
          <p className="mb-6 text-base text-muted-foreground sm:mb-8 sm:text-lg lg:text-xl">
            Embark on a structured journey to learn the Quran with progressive courses,
            comprehensive tests, and detailed results tracking.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started <FontAwesomeIcon icon={faArrowRight} className="size-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:mb-12 sm:text-3xl">
            Your Learning Journey
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              {
                icon: faGraduationCap,
                title: "Structured Marhalas",
                desc: "Progress through 4 levels with gated advancement. Pass the current marhala to unlock the next.",
              },
              {
                icon: faBookOpen,
                title: "Interactive Courses",
                desc: "Each marhala contains courses with lessons, audio recitations, and comprehensive content.",
              },
              {
                icon: faAward,
                title: "Tests & Results",
                desc: "Take MCQ tests for each course and a final exam. Get instant results and track your progress.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 sm:mb-4 sm:size-12">
                  <FontAwesomeIcon icon={feature.icon} className="size-5 text-primary sm:size-6" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marhala Levels */}
      <section className="bg-muted/30 px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl">
            Four Levels of Learning
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-sm text-muted-foreground sm:mb-12 sm:text-base">
            Complete each level to progress. Average score of 50% for Marhala 1, 60% for Marhalas 2-4.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {[
              { level: 1, title: "Foundation", threshold: "50%", color: "bg-emerald-500" },
              { level: 2, title: "Intermediate", threshold: "60%", color: "bg-blue-500" },
              { level: 3, title: "Advanced", threshold: "60%", color: "bg-purple-500" },
              { level: 4, title: "Mastery", threshold: "60%", color: "bg-amber-500" },
            ].map((marhala) => (
              <div
                key={marhala.level}
                className="rounded-xl border border-border bg-card p-4 text-center shadow-sm sm:p-6"
              >
                <div
                  className={`mx-auto mb-2 flex size-10 items-center justify-center rounded-full text-sm font-bold text-white sm:mb-3 sm:size-12 sm:text-lg ${marhala.color}`}
                >
                  {marhala.level}
                </div>
                <h3 className="text-sm font-semibold text-foreground sm:text-base">
                  {marhala.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Pass: {marhala.threshold}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <FontAwesomeIcon icon={faLock} className="mb-4 size-8 text-primary sm:size-10" />
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl">
            Ready to Start?
          </h2>
          <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">
            Join thousands of students on their Quran learning journey.
            Register now to begin with Marhala 1.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Learning <FontAwesomeIcon icon={faArrowRight} className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
