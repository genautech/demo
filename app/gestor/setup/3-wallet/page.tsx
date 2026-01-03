"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemoState } from "@/hooks/use-demo-state"
import { demoClient } from "@/lib/demoClient"
import { User, WalletSummaryDTO } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Users, ArrowRight, Loader2, Coins, Plus } from "lucide-react"
import { toast } from "sonner"
// For now, let's keep it simple but ensure it loads
export default function WalletStep() {
  const { env, isMounted } = useDemoState()
  const router = useRouter()
  const [testUser, setTestUser] = useState<User | null>(null)
  const [wallet, setWallet] = useState<WalletSummaryDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [crediting, setCrediting] = useState(false)

  const DEFAULT_USER_ID = "spree_user_demo_test"

  useEffect(() => {
    if (!isMounted) return

    setLoading(true)
    demoClient.getWalletSummary(env, DEFAULT_USER_ID)
      .then(res => {
        setWallet(res)
        // Also check if user exists
        return demoClient.getApiKeys(env) // Just to trigger something else
      })
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading wallet summary:", err)
        setLoading(false)
      })
  }, [env, isMounted])

  const handleCreateUser = async () => {
    setLoading(true)
    try {
      const newUser = await demoClient.createUser(env, {
        id: DEFAULT_USER_ID,
        email: "usuario.teste@exemplo.com",
        firstName: "Usuário",
        lastName: "Teste",
        points: 0,
        level: "bronze",
        totalPurchases: 0,
        totalSpent: 0,
        totalPointsEarned: 0,
        totalPointsSpent: 0,
        achievements: [],
        tags: [],
      })
      setTestUser(newUser)
      // Refresh wallet summary
      const res = await demoClient.getWalletSummary(env, DEFAULT_USER_ID)
      setWallet(res)
      toast.success("Usuário de teste criado!")
    } catch (err) {
      toast.error("Erro ao criar usuário")
    } finally {
      setLoading(false)
    }
  }

  const handleCreditPoints = async () => {
    setCrediting(true)
    try {
      await demoClient.creditPoints(env, DEFAULT_USER_ID, 1000, "Carga inicial de teste")
      const res = await demoClient.getWalletSummary(env, DEFAULT_USER_ID)
      setWallet(res)
      await demoClient.updateSetupStep(env, "wallet", "done")
      toast.success("1.000 pontos creditados com sucesso!")
    } catch (err) {
      toast.error("Erro ao creditar pontos")
    } finally {
      setCrediting(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.push("/gestor/setup")} className="mb-4">
          ← Voltar para visão geral
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Step 3: Wallet & Users</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o saldo de pontos dos seus colaboradores e crie usuários de teste.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Usuário de Teste
            </CardTitle>
            <CardDescription>
              Crie um perfil para testar o fluxo de resgate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (!testUser && (!wallet || wallet.available === 0)) ? (
              <Button onClick={handleCreateUser} disabled={loading} variant="outline" className="w-full border-dashed">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Criar Usuário de Teste
              </Button>
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                <div>
                  <p className="font-semibold text-sm">Usuário Teste</p>
                  <p className="text-xs text-muted-foreground">usuario.teste@exemplo.com</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Sandbox User</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Carteira (Wallet)
            </CardTitle>
            <CardDescription>
              Adicione saldo à conta do usuário de teste.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-primary/5 rounded-xl border border-primary/10">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Saldo Disponível</p>
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-yellow-600" />
                  <span className="text-3xl font-bold">{wallet?.available || 0}</span>
                  <span className="text-sm font-semibold text-muted-foreground">BRTS</span>
                </div>
              </div>
              <Button onClick={handleCreditPoints} disabled={crediting || loading} className="gap-2">
                {crediting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Creditar 1.000 BRTS
              </Button>
            </div>

            {wallet && wallet.available > 0 && (
              <div className="pt-4 border-t flex justify-end">
                <Button onClick={() => router.push("/gestor/setup/4-webhooks")} className="gap-2">
                  Próximo Passo: Webhooks <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
