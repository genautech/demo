"use client"

import { useDemoState } from "@/hooks/use-demo-state"
import { useApiKeys } from "@/hooks/use-console-data"
import { demoClient } from "@/lib/demoClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Key, Plus, Trash2, Copy, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function ApiKeysPage() {
  const { env } = useDemoState()
  const { keys, isLoading, mutate } = useApiKeys(env)
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCreate = async () => {
    setCreating(true)
    try {
      await demoClient.createApiKey(env, `Nova Chave ${new Date().toLocaleTimeString()}`)
      mutate()
      toast.success("Chave de API criada!")
    } finally {
      setCreating(false)
    }
  }

  const handleRevoke = async (id: string) => {
    if (confirm("Tem certeza que deseja revogar esta chave?")) {
      await demoClient.revokeApiKey(env, id)
      mutate()
      toast.info("Chave revogada.")
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.info("Copiado para a área de transferência")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
            <Badge variant="secondary" className="text-[9px] font-bold uppercase py-0 px-1.5 h-4 bg-blue-100 text-blue-700 border-blue-200">DEMO</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Gerencie suas chaves de autenticação para o ambiente {env}. <span className="text-xs italic">(Modo demo: simulação local)</span></p>
        </div>
        <Button onClick={handleCreate} disabled={creating} className="gap-2">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Criar Nova Chave
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Prefixo</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
                </TableRow>
              ) : keys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma chave de API encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {key.prefix}********************
                      </code>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(key.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {key.revokedAt ? (
                        <Badge variant="destructive">Revogada</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Ativa</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleCopy(key.id, key.prefix + "********************")}
                        >
                          {copiedId === key.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        {!key.revokedAt && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRevoke(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
        <Key className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Dica de Segurança:</strong> Nunca compartilhe suas chaves secretas. Use Sandbox para desenvolvimento e Production apenas para tráfego real. No modo Demo, ambas as chaves são simuladas localmente.
        </p>
      </div>
    </div>
  )
}
