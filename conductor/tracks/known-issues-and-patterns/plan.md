# Known Issues and Patterns

Este documento cataloga problemas conhecidos que já foram corrigidos, padrões que devem ser seguidos, e anti-patterns que devem ser evitados.

## Objetivo

Garantir que erros já corrigidos não sejam reintroduzidos no código. Este documento serve como referência para desenvolvedores e agentes de IA.

---

## 🔴 Anti-Patterns (NUNCA Fazer)

### 1. Footer Cortado em Modais

**❌ Problema:**
```tsx
// ERRADO - Footer fica cortado quando conteúdo é grande
<DialogContent className="max-h-[90vh] overflow-y-auto">
  <DialogHeader>...</DialogHeader>
  <div>{children}</div>
  <DialogFooter>{footer}</DialogFooter>  {/* Footer rola junto e fica escondido */}
</DialogContent>
```

**✅ Solução:**
```tsx
// CORRETO - Footer sempre visível
<DialogContent className="max-h-[90vh] flex flex-col overflow-hidden">
  <DialogHeader className="shrink-0">...</DialogHeader>
  <div className="flex-1 overflow-y-auto">{children}</div>
  <DialogFooter className="shrink-0 border-t pt-4 bg-background">
    {footer}
  </DialogFooter>
</DialogContent>
```

**Componente Afetado:** `components/ui/responsive-modal.tsx`

**Data da Correção:** 2026-01-02

---

### 2. Login com userId Inexistente

**❌ Problema:**
```tsx
// ERRADO - userId hardcoded que não existe no storage
login({ userId: "spree_user_demo", role: "member" })
```

**✅ Solução:**
```tsx
// CORRETO - Buscar usuário real do storage
const user = getUsers().find(u => u.email === email)
if (user) {
  login({ userId: user.id, role: user.role })
}
```

**Componente Afetado:** `app/login/page.tsx`

**Data da Correção:** 2025-12-31 (ver CHANGELOG)

---

### 3. API Retornando Erros Vazios

**❌ Problema:**
```tsx
// ERRADO - Erro genérico sem informação útil
return NextResponse.json({ error: "Failed" }, { status: 500 })
```

**✅ Solução:**
```tsx
// CORRETO - Mensagem descritiva do erro
return NextResponse.json(
  { 
    error: "Falha ao processar replicação",
    details: error.message,
    code: "REPLICATION_FAILED"
  }, 
  { status: 500 }
)
```

**Componente Afetado:** Todas as APIs em `app/api/`

**Data da Correção:** 2025-12-31 (ver CHANGELOG)

---

### 4. Scroll Aninhado em Modais

**❌ Problema:**
```tsx
// ERRADO - max-h e overflow-y-auto dentro de ResponsiveModal causa conflito
<ResponsiveModal footer={<Footer />}>
  <div className="max-h-[60vh] overflow-y-auto">
    {/* conteúdo */}
  </div>
</ResponsiveModal>
```

**✅ Solução:**
```tsx
// CORRETO - Deixar o ResponsiveModal gerenciar o scroll
<ResponsiveModal footer={<Footer />}>
  <div className="space-y-3">
    {/* conteúdo - sem max-h nem overflow */}
  </div>
</ResponsiveModal>
```

**Componente Afetado:** `components/loja/GlobalCart.tsx`

**Data da Correção:** 2026-01-02

---

## 🟢 Patterns (SEMPRE Fazer)

### 1. Modais com Footer

Sempre use estrutura flexbox para modais com footer:

```tsx
<Container className="max-h-[90vh] flex flex-col overflow-hidden">
  <Header className="shrink-0" />
  <Content className="flex-1 overflow-y-auto" />
  <Footer className="shrink-0 border-t pt-4 bg-background" />
</Container>
```

### 2. Validação de Usuário no Login

Sempre validar que o usuário existe antes de fazer login:

```tsx
const user = getUserById(userId)
if (!user) {
  toast.error("Usuário não encontrado")
  return
}
```

### 3. Tratamento de Erros em APIs

Sempre retornar mensagens de erro úteis:

```tsx
try {
  // operação
} catch (error) {
  console.error("[API_NAME] Error:", error)
  return NextResponse.json({
    error: "Descrição do erro",
    details: error instanceof Error ? error.message : "Erro desconhecido",
    code: "ERROR_CODE"
  }, { status: 500 })
}
```

### 4. Leitura de Resposta de API

Sempre ler resposta como texto primeiro, depois tentar parsear JSON:

```tsx
const response = await fetch(url)
const text = await response.text()

try {
  const data = JSON.parse(text)
  return data
} catch {
  console.error("Response was not JSON:", text)
  throw new Error("Invalid response format")
}
```

---

## 📋 Checklist para Code Review

Antes de aprovar qualquer PR, verificar:

- [ ] Modais com footer usam estrutura flexbox correta
- [ ] Conteúdo dentro de ResponsiveModal NÃO tem max-h ou overflow próprio
- [ ] Login valida existência do usuário
- [ ] APIs retornam mensagens de erro descritivas
- [ ] Respostas de API são lidas como texto antes de parsear JSON
- [ ] Não há `overflow-y-auto` em containers que contêm footers fixos

---

## 📅 Histórico de Atualizações

| Data | Issue | Solução |
|------|-------|---------|
| 2026-01-02 | Scroll aninhado em GlobalCart | Remover max-h e overflow do children |
| 2026-01-02 | Footer cortado em ResponsiveModal | Flexbox com shrink-0 no footer |
| 2025-12-31 | Login com userId inexistente | Validação prévia de usuário |
| 2025-12-31 | API retornando erros vazios | Mensagens descritivas |

---

## Referências

- `conductor/CHANGELOG.md` - Log completo de mudanças
- `components/ui/responsive-modal.tsx` - Implementação correta de modal com footer
- `app/login/page.tsx` - Implementação correta de login
