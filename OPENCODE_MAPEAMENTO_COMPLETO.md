# 🗺️ Mapeamento Completo de Sugestões OpenCode

## 📋 Arquivos com Debug Fetch Calls (Alta Prioridade)

### `app/loja/page.tsx`
**Total**: 14 blocos de debug logging  
**Linhas**: 130-132, 140-142, 145-147, 165-167, 169-171, 181-183, 186-188, 190-192, 199-201, 351-353, 490-492, 498-500

**Ação**: Remover todos os blocos `#region agent log` / `#endregion` e seus fetch calls

### `app/loja/produto/[id]/page.tsx`
**Total**: 8 blocos de debug logging  
**Linhas**: 137-139, 141-143, 155-157, 183-185, 187-189, 202-204, 207-209, 213-215

**Ação**: Remover todos os blocos de debug logging

### `app/campanha/loja/page.tsx`
**Total**: 1 bloco de debug logging  
**Linhas**: 70-72

**Ação**: Remover bloco de debug logging

### `app/campanha/checkout/page.tsx`
**Total**: 1 bloco de debug logging  
**Linhas**: 199-201

**Ação**: Remover bloco de debug logging

### `app/gestor/budgets/page.tsx`
**Total**: 4 blocos de debug logging  
**Linhas**: 103-105, 130-132, 135-137, 443-450 (JSX comment)

**Ação**: Remover blocos de debug logging

### `app/gestor/swag-track/page.tsx`
**Total**: 3 blocos de debug logging  
**Linhas**: 71-77, 94-96

**Ação**: Remover blocos de debug logging

---

## 📋 Arquivos com Tipos `any` Restantes (Média Prioridade)

### `app/loja/page.tsx`
- Linha 149: `let newCart: any[]` → Pode ser tipado como `CartItem[]`

### `app/loja/produto/[id]/page.tsx`
- Linha 167: `let updatedCart: any[]` → Pode ser tipado como `CartItem[]`
- Linha 186: `catch (error: any)` → Já corrigido anteriormente, verificar se aplicado

### `app/gestor/catalog/import/page.tsx`
- Linha 44: `const [currentUser, setCurrentUser] = useState<any>(null)` → Usar `User | null`
- Linha 45: `const [company, setCompany] = useState<any>(null)` → Usar `Company | null`

### `app/dashboard/member/page.tsx`
- Linha 42: `const [currentUser, setCurrentUser] = useState<any>(null)` → Usar tipo específico
- Linha 43: `const [myOrders, setMyOrders] = useState<any[]>([])` → Usar `Order[]`
- Linha 44: `const [topUsers, setTopUsers] = useState<any[]>([])` → Criar tipo específico

---

## 📋 Configuração Next.js (Média Prioridade)

### `next.config.mjs`
**Linha 6**: `ignoreBuildErrors: true`

**Sugestão**: 
- Manter `true` para demo (aceitável)
- Documentar que deve ser `false` em produção
- Adicionar comentário explicativo

---

## 📋 Segurança - dangerouslySetInnerHTML (Baixa Prioridade)

### `components/ui/chart.tsx`
**Linha 83**: `dangerouslySetInnerHTML`

**Status**: Parece necessário para injeção de estilos CSS dinâmicos  
**Ação**: Verificar se conteúdo é estático/controlado (parece ser)

---

## 📊 Resumo por Arquivo

### Arquivos com Debug Fetch Calls (6 arquivos)
1. `app/loja/page.tsx` - 14 blocos
2. `app/loja/produto/[id]/page.tsx` - 8 blocos
3. `app/gestor/budgets/page.tsx` - 4 blocos
4. `app/gestor/swag-track/page.tsx` - 3 blocos
5. `app/campanha/checkout/page.tsx` - 1 bloco
6. `app/campanha/loja/page.tsx` - 1 bloco

**Total**: ~31 blocos de debug logging

### Arquivos com Tipos `any` Restantes (4 arquivos)
1. `app/loja/page.tsx` - 1 tipo
2. `app/loja/produto/[id]/page.tsx` - 1 tipo
3. `app/gestor/catalog/import/page.tsx` - 2 tipos
4. `app/dashboard/member/page.tsx` - 3 tipos

**Total**: 7 tipos `any` restantes

---

## 🎯 Plano de Ação Recomendado

### Fase 1: Limpeza de Debug (Alta Prioridade)
1. Remover todos os fetch calls de debug
2. Remover blocos `#region agent log` / `#endregion`
3. Testar que aplicação ainda funciona

### Fase 2: Tipos TypeScript (Média Prioridade)
4. Criar interface `CartItem` se não existir
5. Substituir `any[]` por tipos específicos
6. Substituir `any` por tipos específicos em estados

### Fase 3: Configuração (Média Prioridade)
7. Adicionar comentários em `next.config.mjs`
8. Documentar configurações de produção

### Fase 4: Verificação (Baixa Prioridade)
9. Verificar sanitização de `dangerouslySetInnerHTML`
10. Revisar error boundaries (já está bom)

---

**Última atualização**: 2026-01-01
