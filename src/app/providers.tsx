"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { AuthInitializer } from "@/components/auth-initializer"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  )
}
