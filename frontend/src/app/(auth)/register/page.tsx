"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserPlus } from "@fortawesome/free-solid-svg-icons"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await register(email, name, password)
      router.push("/dashboard")
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-200px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Image
            src="/logo.jpeg"
            alt="Logo"
            width={56}
            height={56}
            className="mx-auto mb-3 rounded-full"
          />
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start your Quran and Tajweed journey today
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2 size-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
