"use client"

import { AppShell } from "@/components/app-shell"
import { AuthGate } from "@/components/auth-gate"

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate requiredRole="manager">
      <AppShell>{children}</AppShell>
    </AuthGate>
  )
}
