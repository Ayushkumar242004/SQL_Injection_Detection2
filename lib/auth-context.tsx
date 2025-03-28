"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  image?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simple hash function for passwords (not secure for production)
  const hashPassword = (password: string) => {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash.toString(16)
  }

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const hashedPassword = hashPassword(password)

    const foundUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashedPassword,
    )

    if (foundUser) {
      const userToStore = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        image: foundUser.image || "/placeholder.svg?height=32&width=32",
      }

      setUser(userToStore)
      localStorage.setItem("currentUser", JSON.stringify(userToStore))
      return { success: true, message: "Login successful" }
    }

    return { success: false, message: "Invalid email or password" }
  }

  const signup = async (name: string, email: string, password: string) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if user already exists
    if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "User with this email already exists" }
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashPassword(password),
      image: "/placeholder.svg?height=32&width=32",
      createdAt: new Date().toISOString(),
    }

    // Add to users array
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Log user in
    const userToStore = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
    }

    setUser(userToStore)
    localStorage.setItem("currentUser", JSON.stringify(userToStore))

    return { success: true, message: "Account created successfully" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

