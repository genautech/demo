"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  XCircle, 
  Clock,
  DollarSign,
} from "lucide-react"
import { type BudgetRequest, type TeamBudget } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface BudgetRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: TeamBudget | null
  onApprove: (requestId: string, notes?: string) => void
  onReject: (requestId: string, notes?: string) => void
}

export function BudgetRequestModal({
  open,
  onOpenChange,
  budget,
  onApprove,
  onReject,
}: BudgetRequestModalProps) {
  const [reviewNotes, setReviewNotes] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  if (!budget) return null

  const pendingRequests = budget.requests.filter(r => r.status === "pending")
  const processedRequests = budget.requests.filter(r => r.status !== "pending")

  const handleApprove = (requestId: string) => {
    onApprove(requestId, reviewNotes)
    setReviewNotes("")
    setSelectedRequest(null)
  }

  const handleReject = (requestId: string) => {
    onReject(requestId, reviewNotes)
    setReviewNotes("")
    setSelectedRequest(null)
  }

  const getStatusBadge = (status: BudgetRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Aprovado</Badge>
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" />Rejeitado</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Solicitações de Verba - {budget.teamName}
          </DialogTitle>
          <DialogDescription>
            Revise e aprove ou rejeite as solicitações de verba do time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase text-muted-foreground">
                Pendentes ({pendingRequests.length})
              </h3>
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-colors",
                    selectedRequest === request.id 
                      ? "border-primary bg-primary/5" 
                      : "border-muted hover:border-muted-foreground/20"
                  )}
                  onClick={() => setSelectedRequest(
                    selectedRequest === request.id ? null : request.id
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(request.status)}
                        <span className="text-xs text-muted-foreground">
                          por {request.requestedBy}
                        </span>
                      </div>
                      <p className="font-medium">{request.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Solicitado em: {new Date(request.requestedAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        {request.amount.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  {selectedRequest === request.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-xs">Observações (opcional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Adicione uma observação..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Pending Requests */}
          {pendingRequests.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="font-medium">Nenhuma solicitação pendente</p>
              <p className="text-sm text-muted-foreground">
                Todas as solicitações foram processadas.
              </p>
            </div>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase text-muted-foreground">
                Histórico ({processedRequests.length})
              </h3>
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="font-medium text-sm">{request.reason}</p>
                      {request.reviewNotes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          "{request.reviewNotes}"
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        R$ {request.amount.toLocaleString("pt-BR")}
                      </p>
                      {request.reviewedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.reviewedAt).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface AllocateBudgetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: TeamBudget | null
  onAllocate: (amount: number, description: string) => void
}

export function AllocateBudgetModal({
  open,
  onOpenChange,
  budget,
  onAllocate,
}: AllocateBudgetModalProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  if (!budget) return null

  const handleSubmit = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return
    if (!description.trim()) return

    onAllocate(numAmount, description)
    setAmount("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alocar Verba - {budget.teamName}</DialogTitle>
          <DialogDescription>
            Adicione verba ao orçamento do time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground uppercase font-bold">Saldo Atual</p>
            <p className="text-2xl font-black text-green-600">
              R$ {budget.availableAmount.toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor a Alocar (R$)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Ex: Alocação extra para campanha de fim de ano"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!amount || !description.trim()}>
            Alocar Verba
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
