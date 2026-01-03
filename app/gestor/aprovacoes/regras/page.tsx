"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveModal } from "@/components/ui/responsive-modal"
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Zap,
  Shield,
} from "lucide-react"
import {
  getApprovalRules,
  createApprovalRule,
  updateApprovalRule,
  deleteApprovalRule,
  type ApprovalRule,
  type ApprovalCondition,
} from "@/lib/storage"
import { toast } from "sonner"
import Link from "next/link"

const FIELD_LABELS: Record<ApprovalCondition["field"], string> = {
  value: "Valor",
  quantity: "Quantidade",
  category: "Categoria",
  priority: "Prioridade",
}

const OPERATOR_LABELS: Record<ApprovalCondition["operator"], string> = {
  gt: "Maior que",
  lt: "Menor que",
  eq: "Igual a",
  contains: "Contém",
}

export default function RegrasAprovacoesPage() {
  const [rules, setRules] = useState<ApprovalRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null)
  const [companyId, setCompanyId] = useState("company_1")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    autoApprove: false,
    maxValue: "",
    conditionField: "value" as ApprovalCondition["field"],
    conditionOperator: "lt" as ApprovalCondition["operator"],
    conditionValue: "",
    isActive: true,
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.companyId) setCompanyId(auth.companyId)
      } catch {}
    }
    loadRules()
  }, [])

  const loadRules = () => {
    setLoading(true)
    const allRules = getApprovalRules(companyId)
    setRules(allRules)
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      autoApprove: false,
      maxValue: "",
      conditionField: "value",
      conditionOperator: "lt",
      conditionValue: "",
      isActive: true,
    })
    setEditingRule(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleOpenEdit = (rule: ApprovalRule) => {
    setEditingRule(rule)
    const firstCondition = rule.conditions[0]
    setFormData({
      name: rule.name,
      description: rule.description,
      autoApprove: rule.autoApprove,
      maxValue: rule.maxValue?.toString() || "",
      conditionField: firstCondition?.field || "value",
      conditionOperator: firstCondition?.operator || "lt",
      conditionValue: firstCondition?.value?.toString() || "",
      isActive: rule.isActive,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Nome da regra é obrigatório")
      return
    }

    const conditions: ApprovalCondition[] = formData.conditionValue ? [
      {
        field: formData.conditionField,
        operator: formData.conditionOperator,
        value: formData.conditionField === "value" || formData.conditionField === "quantity"
          ? Number(formData.conditionValue)
          : formData.conditionValue,
      },
    ] : []

    if (editingRule) {
      // Update
      updateApprovalRule(editingRule.id, {
        name: formData.name,
        description: formData.description,
        autoApprove: formData.autoApprove,
        maxValue: formData.maxValue ? Number(formData.maxValue) : undefined,
        conditions,
        isActive: formData.isActive,
      })
      toast.success("Regra atualizada com sucesso")
    } else {
      // Create
      createApprovalRule({
        companyId,
        name: formData.name,
        description: formData.description,
        autoApprove: formData.autoApprove,
        maxValue: formData.maxValue ? Number(formData.maxValue) : undefined,
        conditions,
        approverRoles: ["manager"],
        isActive: formData.isActive,
      })
      toast.success("Regra criada com sucesso")
    }

    setShowModal(false)
    resetForm()
    loadRules()
  }

  const handleDelete = (rule: ApprovalRule) => {
    if (confirm(`Deseja realmente excluir a regra "${rule.name}"?`)) {
      deleteApprovalRule(rule.id)
      toast.success("Regra excluída com sucesso")
      loadRules()
    }
  }

  const handleToggleActive = (rule: ApprovalRule) => {
    updateApprovalRule(rule.id, { isActive: !rule.isActive })
    toast.success(rule.isActive ? "Regra desativada" : "Regra ativada")
    loadRules()
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/gestor/aprovacoes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              Regras de Aprovação
            </h1>
          </div>
          <p className="ml-12 text-muted-foreground">
            Configure regras automáticas para o workflow de aprovações
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadRules} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Regra
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Como funcionam as regras de aprovação
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                As regras são avaliadas automaticamente quando uma nova solicitação é criada.
                Se a regra tiver "Auto-aprovar" ativado e as condições forem atendidas,
                a solicitação será aprovada automaticamente. Caso contrário, entrará na fila de aprovação manual.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 flex justify-center">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground mb-4">Nenhuma regra configurada</p>
              <Button onClick={handleOpenCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeira Regra
              </Button>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id} className={!rule.isActive ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${rule.autoApprove ? "bg-green-100 dark:bg-green-950" : "bg-blue-100 dark:bg-blue-950"}`}>
                      {rule.autoApprove ? (
                        <Zap className="h-5 w-5 text-green-600" />
                      ) : (
                        <Shield className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.isActive ? "default" : "secondary"}>
                      {rule.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                    {rule.autoApprove && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                        Auto-aprovar
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    {rule.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {rule.conditions.map((cond, idx) => (
                          <Badge key={idx} variant="outline" className="font-normal">
                            {FIELD_LABELS[cond.field]} {OPERATOR_LABELS[cond.operator]} {cond.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {rule.maxValue && (
                      <p className="text-sm text-muted-foreground">
                        Valor máximo: R$ {rule.maxValue.toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => handleToggleActive(rule)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(rule)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <ResponsiveModal
        open={showModal}
        onOpenChange={setShowModal}
        title={editingRule ? "Editar Regra" : "Nova Regra de Aprovação"}
        description="Configure as condições e ações da regra"
        maxWidth="xl"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingRule ? "Salvar Alterações" : "Criar Regra"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Regra *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Auto-aprovar até R$ 500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o comportamento da regra"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-4">
            <Label>Condição</Label>
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                value={formData.conditionField}
                onValueChange={(v) => setFormData({ ...formData, conditionField: v as ApprovalCondition["field"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">Valor</SelectItem>
                  <SelectItem value="quantity">Quantidade</SelectItem>
                  <SelectItem value="priority">Prioridade</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.conditionOperator}
                onValueChange={(v) => setFormData({ ...formData, conditionOperator: v as ApprovalCondition["operator"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lt">Menor que</SelectItem>
                  <SelectItem value="gt">Maior que</SelectItem>
                  <SelectItem value="eq">Igual a</SelectItem>
                  <SelectItem value="contains">Contém</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={formData.conditionValue}
                onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                placeholder={formData.conditionField === "value" ? "500" : "Valor"}
                type={formData.conditionField === "value" || formData.conditionField === "quantity" ? "number" : "text"}
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxValue">Valor Máximo (opcional)</Label>
              <Input
                id="maxValue"
                type="number"
                value={formData.maxValue}
                onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
                placeholder="Ex: 5000"
              />
              <p className="text-xs text-muted-foreground">
                Limite máximo de valor para esta regra se aplicar
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="autoApprove">Auto-aprovar</Label>
                <p className="text-sm text-muted-foreground">
                  Aprovar automaticamente quando as condições forem atendidas
                </p>
              </div>
              <Switch
                id="autoApprove"
                checked={formData.autoApprove}
                onCheckedChange={(checked) => setFormData({ ...formData, autoApprove: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Regra Ativa</Label>
                <p className="text-sm text-muted-foreground">
                  Desative para pausar temporariamente esta regra
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
        </div>
      </ResponsiveModal>
    </PageContainer>
  )
}
