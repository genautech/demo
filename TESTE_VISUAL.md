# Teste Visual - Design System v0

## ✅ Mudanças Implementadas e Como Testar

### 1. **Cards (Componente Base)**
**O que mudou:**
- Sombra mais pronunciada no hover (`shadow-sm` → `shadow-md`)
- Transição suave de sombra (`transition-shadow`)

**Como testar:**
1. Acesse qualquer página com Cards (Dashboard, Produtos, etc.)
2. Passe o mouse sobre qualquer Card
3. **Você deve ver:** A sombra do card aumenta suavemente

### 2. **Botões**
**O que mudou:**
- Sombra base (`shadow-sm`)
- Sombra no hover (`hover:shadow-md`)
- Efeito de escala ao clicar (`active:scale-[0.98]`)

**Como testar:**
1. Encontre qualquer botão na interface
2. Passe o mouse sobre o botão
3. **Você deve ver:** Sombra aumenta
4. Clique no botão
5. **Você deve ver:** Botão levemente encolhe (efeito de pressão)

### 3. **Inputs**
**O que mudou:**
- Borda mais visível no hover (`hover:border-ring/50`)
- Sombra no foco (`focus-visible:shadow-sm`)

**Como testar:**
1. Clique em qualquer campo de input
2. **Você deve ver:** Borda mais visível e sombra sutil
3. Passe o mouse sobre o input
4. **Você deve ver:** Borda muda de cor levemente

### 4. **Header/Navegação**
**O que mudou:**
- Backdrop blur mais pronunciado (`backdrop-blur-md`)
- Sombra no header (`shadow-sm`)
- Itens de navegação com sombra no hover

**Como testar:**
1. Olhe para o topo da página
2. **Você deve ver:** Header com efeito de blur mais visível
3. Passe o mouse sobre itens de navegação
4. **Você deve ver:** Sombra aparece e item fica destacado

### 5. **Badges**
**O que mudou:**
- Sistema de sombras (xs, sm, md)
- Elevação no hover

**Como testar:**
1. Encontre badges na página (status, tags, etc.)
2. Passe o mouse sobre badges clicáveis
3. **Você deve ver:** Sombra aumenta

### 6. **Tabs**
**O que mudou:**
- Sombra na lista de tabs (`shadow-sm`)
- Hover state melhorado

**Como testar:**
1. Encontre uma página com tabs
2. Passe o mouse sobre tabs inativos
3. **Você deve ver:** Background aparece suavemente

### 7. **Sitemap e Novas Rotas**
**O que mudou:**
- Sitemap atualizado com todas as rotas do sistema
- Novas categorias no sitemap (Financeiro, Onboarding, Campanhas)
- Novas rotas de Moeda Gamificada e Gestão de Verbas adicionadas

**Como testar:**
1. Acesse `/sitemap` (Logado como Super Admin)
2. **Você deve ver:** Uma visualização organizada de todas as rotas divididas por perfil
3. Verifique se as rotas de "Moeda Gamificada" e "Dashboard Moeda" aparecem em Gestor
4. Verifique se a rota "Gestão de Verbas" substituiu a antiga "Carteira"

## 🔍 Verificação Rápida

**Se você NÃO está vendo as mudanças:**

1. **Hard Refresh no navegador:**
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`

2. **Limpe o cache do navegador:**
   - Abra DevTools (F12)
   - Clique com botão direito no botão de refresh
   - Selecione "Empty Cache and Hard Reload"

3. **Verifique o console:**
   - Abra DevTools (F12)
   - Veja se há erros de compilação

4. **Reinicie o servidor:**
   ```bash
   # Pare o servidor (Ctrl+C)
   # Limpe o cache
   rm -rf .next
   # Reinicie
   npm run dev
   ```

## 📸 Elementos Visuais para Comparar

**Antes (sem as mudanças):**
- Cards: sombra estática
- Botões: sem sombra ou sombra fixa
- Inputs: borda simples
- Header: blur sutil

**Depois (com as mudanças):**
- Cards: sombra aumenta no hover ✨
- Botões: sombra + efeito de pressão ✨
- Inputs: borda e sombra no foco ✨
- Header: blur mais pronunciado ✨

## 🎨 Paleta de Cores

As cores foram atualizadas para OKLCH:
- **Primary:** Preto/escuro (oklch(0.205 0 0))
- **Background:** Branco puro (oklch(1 0 0))
- **Borders:** Cinza claro (oklch(0.922 0 0))

## 🌙 Dark Mode

No dark mode, as sombras são mais pronunciadas:
- Light mode: opacidade 0.1
- Dark mode: opacidade 0.4

Teste alternando entre light e dark mode para ver a diferença!
