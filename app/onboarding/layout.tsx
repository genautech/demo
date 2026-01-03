"use client"

import { AuthGate } from "@/components/auth-gate"

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      {children}
    </AuthGate>
  )
}
