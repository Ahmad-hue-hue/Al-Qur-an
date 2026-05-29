import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBookOpen,
  faGraduationCap,
  faAward,
  faArrowRight,
  faClipboardList,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-12 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 sm:mb-6">
            <Image
              src="/logo.jpeg"
              alt="Quran Learning & Tajweed Program"
              width={96}
              height={96}
              className="mx-auto rounded-full"
              priority
            />
          </div>
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:mb-4 sm:text-3xl lg:text-5xl">
            Qur&apos;an Learning & Tajweed Program
          </h1>
          <p className="mb-2 text-sm text-primary/80 sm:text-base">
            وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
          </p>
          <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base lg:text-lg">
            Recite the Quran with measured, deliberate recitation.
            Learn proper Tajweed through structured courses and progressive learning.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FontAwesomeIcon icon={faUserPlus} className="size-4" />
              Sign Up to Start
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
                desc: "Progress through 4 levels with gated advancement. Master each marhala to unlock the next.",
              },
              {
                icon: faBookOpen,
                title: "Tajweed Courses",
                desc: "Each marhala contains courses covering Tajweed rules, recitation practice, and Quranic studies.",
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
          <FontAwesomeIcon icon={faClipboardList} className="mb-4 size-8 text-primary sm:size-10" />
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl">
            Ready to Start?
          </h2>
          <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">
            Join students on their Quran and Tajweed learning journey.
            Create your free account to begin with Marhala 1.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <FontAwesomeIcon icon={faUserPlus} className="size-4" />
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
