"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import api from "@/lib/api"

interface User {
  id: number
  email: string
  name: string
  role: "admin" | "student"
  language_pref: string
  registration_number: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      api
        .get("/auth/me/")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login/", { email, password })
    localStorage.setItem("access_token", data.tokens.access)
    localStorage.setItem("refresh_token", data.tokens.refresh)
    setUser(data.user)
  }

  const register = async (email: string, name: string, password: string) => {
    const { data } = await api.post("/auth/register/", { email, name, password })
    localStorage.setItem("access_token", data.tokens.access)
    localStorage.setItem("refresh_token", data.tokens.refresh)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
