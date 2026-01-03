# Approval Workflow System

## Status: Implemented

**Created**: 2026-01-01
**Last Updated**: 2026-01-01
**Owner**: Auto Claude

## Overview

Sistema completo de workflow de aprovações para gerenciamento de solicitações de pedidos, orçamentos, presentes e requisições dentro da plataforma Yoobe.

## Features Implemented

### 1. Backend - Storage System

**Arquivo**: `lib/storage.ts`

Novos tipos adicionados:
- `ApprovalCondition`: Condições para regras de aprovação
- `ApprovalRule`: Regras configuráveis de aprovação
- `ApprovalRequest`: Solicitações de aprovação
- `ApprovalStats`: Estatísticas de aprovação
- `ApprovalPriority`: Tipos de prioridade (alta, media, baixa)
- `ApprovalRequestType`: Tipos de solicitação (order, budget, gift, requisition)

Funções implementadas:
- `getApprovalRequests()`: Lista todas as solicitações
- `getPendingApprovals()`: Lista aprovações pendentes
- `getApprovalStats()`: Retorna estatísticas de aprovação
- `approveRequest()`: Aprova uma solicitação
- `rejectRequest()`: Rejeita uma solicitação
- `approveMultipleRequests()`: Aprovação em lote
- `createApprovalRequest()`: Cria nova solicitação
- `getApprovalRules()`: Lista regras de aprovação
- `createApprovalRule()`: Cria nova regra
- `updateApprovalRule()`: Atualiza regra existente
- `deleteApprovalRule()`: Remove regra
- `getApprovalHistory()`: Histórico de aprovações

### 2. Widget no Dashboard

**Arquivo**: `components/gestor/approval-workflow-widget.tsx`

Widget integrado no dashboard do gestor com:
- Lista de aprovações pendentes (3 itens)
- Estatísticas de aprovação em tempo real
- Ações rápidas para navegação
- Design responsivo seguindo o padrão shadcn/ui

### 3. Página de Aprovações

**Arquivo**: `app/gestor/aprovacoes/page.tsx`

Página completa com:
- Tabela de aprovações com paginação
- Filtros por status, prioridade e tipo
- Busca por título, solicitante ou ID
- Ações de aprovação e rejeição inline
- Modal de detalhes
- Aprovação em lote (bulk actions)
- Exportação CSV
- Tabs para pendentes e histórico

### 4. Página de Configuração de Regras

**Arquivo**: `app/gestor/aprovacoes/regras/page.tsx`

Página de configuração com:
- Lista de regras existentes
- Criar/editar regras
- Definir condições (valor, quantidade, prioridade, categoria)
- Configurar auto-aprovação
- Ativar/desativar regras
- Visualização de regras ativas

### 5. Navegação

**Arquivo**: `lib/navigation.ts`

Adicionado item de navegação:
- Nome: "Aprovações"
- Rota: `/gestor/aprovacoes`
- Ícone: `CheckCircle2`
- Grupo: "operacao"
- Role: manager

## Data Flow

```
Solicitação Criada
        │
        ▼
   Verificar Regras
        │
   ┌────┴────┐
   │         │
   ▼         ▼
Auto-Aprovado   Fila de Aprovação
   │                    │
   ▼                    ▼
Status: Approved   Status: Pending
                        │
                   ┌────┴────┐
                   │         │
                   ▼         ▼
              Aprovado    Rejeitado
```

## Storage Keys

- `yoobe_approval_requests`: Solicitações de aprovação
- `yoobe_approval_rules`: Regras de aprovação

## Demo Data

Dados de seed incluídos:
- 3 aprovações pendentes (Notebook, Mouse, Power Bank)
- 12+ aprovações históricas
- 2 rejeições para estatísticas
- 3 regras de aprovação padrão

## Technical Notes

1. **Integração com MUI**: Páginas do membro migradas para Material Design
2. **Compatibilidade**: Mantida compatibilidade com sistema de orçamentos existente
3. **Real-time Stats**: Estatísticas calculadas em tempo real
4. **Bulk Actions**: Suporte para ações em lote

## Files Changed

| File | Change |
|------|--------|
| `lib/storage.ts` | +350 linhas (tipos e funções) |
| `lib/navigation.ts` | +2 linhas (nav item) |
| `components/gestor/approval-workflow-widget.tsx` | Novo arquivo |
| `app/gestor/aprovacoes/page.tsx` | Novo arquivo |
| `app/gestor/aprovacoes/regras/page.tsx` | Novo arquivo |
| `app/dashboard/manager/page.tsx` | Widget integrado |

## Next Steps

1. Integrar com sistema de notificações
2. Adicionar webhooks para aprovações
3. Implementar aprovação por email
4. Dashboard de analytics de aprovações
5. Integração com Slack/Teams

## Related Tracks

- `auth-budget-redemption-fix`
- `send-gifts`
- `design-system-modernization`
