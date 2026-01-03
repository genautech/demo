"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Settings, 
  Save, 
  Camera, 
  Building, 
  Key,
  LogOut,
  ChevronRight,
  ShieldCheck
} from "lucide-react"
import { getUserById, getUserByEmail, getCompanyById, updateUser, createUser, type User as UserType, type Company } from "@/lib/storage"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function GestorProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        
        // 1. Primeiro tenta buscar por ID
        let userData = getUserById(auth.userId)
        
        // 2. Se não encontrar por ID, tenta buscar por email (fix para colisão de IDs com emails existentes)
        if (!userData && auth.email) {
          userData = getUserByEmail(auth.email)
        }
        
        // 3. Se ainda não existe, criar novo usuário
        if (!userData && auth.firstName && auth.email) {
          try {
            userData = createUser({
              id: auth.userId,
              email: auth.email,
              firstName: auth.firstName,
              lastName: auth.lastName || "",
              companyId: auth.companyId,
            })
          } catch (createError) {
            // Silently fail - user creation is best-effort
          }
        }
        
        if (userData) {
          setUser(userData)
          setFormData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          })
          
          if (auth.companyId) {
            const companyData = getCompanyById(auth.companyId)
            setCompany(companyData)
          }
        }
      } catch (e) {
        console.error("Error loading profile:", e)
      }
    }
    setLoading(false)
  }, [])

  const handleSave = () => {
    if (!user) return
    setSaving(true)
    try {
      updateUser(user.id, {
        ...formData
      })
      toast.success("Perfil atualizado com sucesso!")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar perfil")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("yoobe_auth")
    router.push("/login")
  }

  if (loading) {
    return <PageContainer>Carregando...</PageContainer>
  }

  if (!user) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Usuário não encontrado</p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e configurações de conta do Gestor.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar de Perfil */}
        <div className="space-y-4">
          <div className="relative group">
            <div className="h-40 w-40 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/20 group-hover:border-primary/50 transition-colors overflow-hidden mx-auto">
              <span className="text-5xl font-bold text-primary">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
            <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full shadow-lg border-2 border-background">
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 pt-4">
            <Badge variant="outline" className="w-full justify-center py-1 gap-1.5 bg-green-50 text-green-700 border-green-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Gestor da Loja
            </Badge>
          </div>

          <nav className="flex flex-col gap-1 pt-4">
            <Button variant="ghost" className="justify-start gap-3 bg-muted">
              <User className="h-4 w-4" />
              Informações
              <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
            </Button>
            <Button variant="ghost" className="justify-start gap-3 hover:bg-muted" asChild>
              <a href="/gestor/settings">
                <Settings className="h-4 w-4" />
                Configurações
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              </a>
            </Button>
            <Button variant="ghost" className="justify-start gap-3 hover:bg-muted" asChild>
              <a href="/gestor/seguranca">
                <Key className="h-4 w-4" />
                Segurança
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              </a>
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
              <LogOut className="h-4 w-4" />
              Sair da Conta
            </Button>
          </nav>
        </div>

        {/* Conteúdo Principal */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Suas informações básicas de identificação</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Empresa Responsável</CardTitle>
              <CardDescription>A empresa que você gerencia no momento</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {company ? (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{company.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {company.id}</p>
                  </div>
                  <Badge className="ml-auto bg-green-500 text-white border-none">
                    Gestor Ativo
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma empresa associada.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? "Salvando..." : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
