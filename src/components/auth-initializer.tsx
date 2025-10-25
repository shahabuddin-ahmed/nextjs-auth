"use client"

import type React from "react"
import { useAuthInit } from "@/hooks/useAuthInit"

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit()
  return <>{children}</>
}
