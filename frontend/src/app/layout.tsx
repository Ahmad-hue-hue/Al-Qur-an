import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { QueryProvider } from "@/lib/providers"
import { Navbar } from "@/components/layout/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Al-Qur'an Learning Platform",
  description: "Learn the Quran with structured courses and progressive learning",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-border bg-muted/30 py-6">
                <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
                  &copy; 2026 Al-Qur&apos;an Learning Platform. All rights reserved.
                </div>
              </footer>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
