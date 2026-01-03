# Track: Correções de Autenticação, Orçamento e Experiência de Resgate

## Overview
Correções críticas para garantir que o fluxo completo funcione: desde login até resgate de produtos como membro.

## Problema
1. Login usava `userId: "spree_user_demo"` que não existia no storage
2. Gestor não conseguia adicionar produtos ao orçamento
3. Membro não conseguia visualizar experiência completa de resgate
4. Checkout e tracking dependiam de produtos V2, quebrando com V3
5. API de replicação retornava erros vazios

## Solução

### 1. Autenticação Demo
- Mapear roles para usuários seedados existentes
- Remover todos os fallbacks para `spree_user_demo`
- Redirecionar para login quando usuário não encontrado

### 2. Fluxo de Orçamento
- Corrigir seleção de produtos (stopPropagation)
- Melhorar feedback visual (botão desabilitado com motivo)
- Validar usuário e empresa antes de criar

### 3. Storefront V3
- Suportar CompanyProducts no detalhe do produto
- Suportar CompanyProducts no checkout
- Validar e deduzir estoque de V3

### 4. Tracking V3
- Buscar imagens/nomes em CompanyProducts
- Fallback para V2 quando necessário

### 5. API de Replicação
- Validações prévias no frontend
- Tratamento de erros robusto
- Logs detalhados para debug

## Arquivos Modificados
- `app/login/page.tsx`
- `components/app-shell.tsx`
- `components/gamification/UserStats.tsx`
- `app/dashboard/member/page.tsx`
- `app/gestor/catalog/import/page.tsx`
- `app/gestor/budgets/page.tsx`
- `app/loja/produto/[id]/page.tsx`
- `app/loja/checkout/page.tsx`
- `app/membro/pedidos/page.tsx`
- `app/loja/pedido/[id]/page.tsx`
- `app/api/replication/route.ts`

## Status
✅ Completo

## Testes
- [x] Login com diferentes roles funciona
- [x] Gestor consegue criar orçamento
- [x] Membro consegue resgatar produtos V3
- [x] Checkout funciona com produtos V3
- [x] Tracking mostra produtos V3 corretamente
- [x] API de replicação retorna erros úteis
