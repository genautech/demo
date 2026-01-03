"use client"

import { AppShell } from "@/components/app-shell"
import { AuthGate } from "@/components/auth-gate"

export default function MembroLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate requiredRole="member">
      <AppShell>{children}</AppShell>
    </AuthGate>
  )
}
