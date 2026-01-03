"use client"

import { AppShell } from "@/components/app-shell"
import { AuthGate } from "@/components/auth-gate"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate requiredRole="superAdmin">
      <AppShell>{children}</AppShell>
    </AuthGate>
  )
}
