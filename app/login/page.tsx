"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react"
import { UserRole } from "@/lib/roles"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoRole, setDemoRole] = useState<UserRole>("manager")

  useEffect(() => {
    const roleParam = searchParams.get("as")
    const hasRoleParam = roleParam && ["superAdmin", "manager", "member"].includes(roleParam)

    if (hasRoleParam) {
      setDemoRole(roleParam as UserRole)
    }

    // Só redirecionar se já estiver autenticado E não estiver tentando trocar de perfil (as=...)
    const authData = localStorage.getItem("yoobe_auth")
    if (authData && !hasRoleParam) {
      router.push("/dashboard")
    }
  }, [searchParams, router])

  const DEMO_CREDENTIALS = {
    email: "admin@yoobe.com.br",
    password: "yoobe2024",
  }

  const getRoleFromEmail = (email: string) => {
    if (email === DEMO_CREDENTIALS.email) return demoRole as UserRole || "manager"
    if (email.includes("super")) return "superAdmin"
    if (email.includes("gestor") || email.includes("manager")) return "manager"
    return demoRole as UserRole || "member"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Validar credenciais (mock)
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const role = getRoleFromEmail(email)
      
      // Mapear role para userId existente no storage
      // spree_user_1 e spree_user_2 são managers
      // spree_user_3, spree_user_5, spree_user_6, spree_user_7, spree_user_8 são members
      // spree_user_4 é superAdmin
      let userId: string
      if (role === "superAdmin") {
        userId = "spree_user_4" // Ana Oliveira - superAdmin
      } else if (role === "manager") {
        userId = "spree_user_1" // João Silva - manager
      } else {
        userId = "spree_user_3" // Pedro Costa - member
      }
      
      localStorage.setItem(
        "yoobe_auth",
        JSON.stringify({
          userId,
          email,
          role: role,
          tenantId: "tenant_demo",
          companyId: "company_1",
          onboardingComplete: true,
          loggedInAt: new Date().toISOString(),
        }),
      )
      router.push("/dashboard")
    } else {
      setError("Email ou senha incorretos. Use as credenciais de demonstração.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg">
            Y
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Yoobe Corporate Store</h1>
          <p className="text-muted-foreground">Sistema de Gestão</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">Faça login para acessar o painel de demonstração</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Credenciais de demonstração:</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <code className="rounded bg-muted px-1 py-0.5">admin@yoobe.com.br</code>
                </p>
                <p>
                  <span className="text-muted-foreground">Senha:</span>{" "}
                  <code className="rounded bg-muted px-1 py-0.5">yoobe2024</code>
                </p>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Acessos rápidos por perfil:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/login?as=superAdmin")}
                    className="text-xs"
                  >
                    Super Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/login?as=manager")}
                    className="text-xs"
                  >
                    Gestor
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/login?as=member")}
                    className="text-xs"
                  >
                    Membro
                  </Button>
                </div>
                {demoRole && demoRole !== "manager" && (
                  <p className="text-xs text-primary mt-2">
                    Perfil selecionado: <strong>{demoRole}</strong>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Versão de demonstração. Integração com Spree Commerce pendente.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
