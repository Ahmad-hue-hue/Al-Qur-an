import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Award, Users, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="size-8 text-primary" />
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
            Al-Qur&apos;an Learning Platform
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Embark on a structured journey to learn the Quran with progressive courses,
            comprehensive tests, and detailed results tracking.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Your Learning Journey
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap className="size-6 text-primary" />
                </div>
                <CardTitle>Structured Marhalas</CardTitle>
                <CardDescription>
                  Progress through 4 levels with gated advancement. Pass the current marhala to unlock the next.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <CardTitle>Interactive Courses</CardTitle>
                <CardDescription>
                  Each marhala contains courses with lessons, audio recitations, and comprehensive content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
              <CardHeader>
                <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Award className="size-6 text-primary" />
                </div>
                <CardTitle>Tests & Results</CardTitle>
                <CardDescription>
                  Take MCQ tests for each course and a final exam. Get instant results and track your progress.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Marhala Preview */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            Four Levels of Learning
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Complete each level to progress. Average score of 50% for Marhala 1, 60% for Marhalas 2-4.
          </p>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { level: 1, title: "Foundation", threshold: "50%", color: "bg-emerald-500" },
              { level: 2, title: "Intermediate", threshold: "60%", color: "bg-blue-500" },
              { level: 3, title: "Advanced", threshold: "60%", color: "bg-purple-500" },
              { level: 4, title: "Mastery", threshold: "60%", color: "bg-amber-500" },
            ].map((marhala) => (
              <Card key={marhala.level} className="border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className={`mx-auto mb-2 flex size-12 items-center justify-center rounded-full ${marhala.color} text-white`}>
                    <span className="text-lg font-bold">{marhala.level}</span>
                  </div>
                  <CardTitle className="text-lg">{marhala.title}</CardTitle>
                  <CardDescription>Pass: {marhala.threshold}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
