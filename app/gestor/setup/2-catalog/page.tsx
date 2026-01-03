"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDemoState } from "@/hooks/use-demo-state"
import { demoClient } from "@/lib/demoClient"
import { Product } from "@/lib/storage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2, ArrowRight, PackageCheck, Box } from "lucide-react"
import { toast } from "sonner"

export default function CatalogStep() {
  const { env } = useDemoState()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    setLoading(true)
    demoClient.getProducts(env).then(res => {
      setProducts(res)
      setLoading(false)
    })
  }, [env])

  const handleImport = async () => {
    setImporting(true)
    try {
      await demoClient.importMasterProducts(env)
      const res = await demoClient.getProducts(env)
      setProducts(res)
      await demoClient.updateSetupStep(env, "catalog", "done")
      toast.success("Catálogo importado com sucesso!")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.push("/gestor/setup")} className="mb-4">
          ← Voltar para visão geral
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Step 2: Catalog</h1>
        <p className="text-muted-foreground mt-2">
          Configure os produtos que estarão disponíveis para resgate na sua loja corporativa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Produtos do Catálogo
          </CardTitle>
          <CardDescription>
            Importe itens do catálogo mestre do Yoobe para sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed">
              <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground mb-6">Seu catálogo está vazio.</p>
              <Button onClick={handleImport} disabled={importing} className="gap-2">
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                Importar Produtos (Demo)
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.slice(0, 6).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card shadow-sm">
                    <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <PackageCheck className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg text-green-700 text-sm font-medium border border-green-100">
                {products.length} produtos importados e ativos no seu catálogo.
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button onClick={() => router.push("/gestor/setup/3-wallet")} className="gap-2">
                  Próximo Passo: Wallet <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
