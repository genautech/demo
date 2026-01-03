# Conductor - Sistema de Documentação Automática

O Conductor é o sistema de documentação e sincronização do projeto Yoobe. Ele garante que todas as especificações, configurações e correções sejam documentadas e não se percam.

## Gatilhos e Automação

O Conductor é projetado para ser "mãos livres". Ele utiliza gatilhos (triggers) para se manter atualizado:

### 1. Gatilho de Commit (Git Hook)
Toda vez que você faz um `git commit`, o Conductor analisa suas mudanças:
- **Detecção Inteligente**: Se você alterou arquivos `.ts`, `.tsx` ou `.md`, o sync é disparado.
- **Auto-correção**: Ele verifica se você esqueceu de usar `PageContainer` e te avisa no terminal.
- **Auto-documentação**: Atualiza o `CHANGELOG.md` com um resumo das mudanças usando a Gemini API.

### 2. Gatilho Auto Claude
A integração com o Auto Claude permite que a IA documente o que planeja:
- **Sync de Specs**: Quando você roda `./claude.sh sync`, o Conductor transforma planos de implementação da IA em documentação de track legível.
- **Triggers Bidirecionais**: Mudanças no código refletem no Conductor, e planos no Auto Claude também.

### 3. Conductor Watcher (Background)
Um novo gatilho de tempo real que monitora mudanças nos arquivos sem necessidade de commit.
- **Script**: `conductor-watcher.js`
- **Ação**: Monitora as pastas `lib/`, `conductor/tracks/` e `.auto-claude/specs/`.
- **Funcionamento**: Roda em segundo plano e executa o sync automaticamente ao detectar mudanças em arquivos `.ts`, `.tsx`, `.json` ou `.md`.
- **Uso**: `./conductor.sh watch` (ou `node conductor-watcher.js`).

### 4. Gatilho de Interface (Super Admin)
O painel em `/super-admin/conductor` serve como um gatilho de visualização:
- **Renderização Real-time**: Mostra a documentação formatada para revisão final.

---

## Estrutura

```
conductor/
├── README.md              # Este arquivo
├── CHANGELOG.md           # Histórico de mudanças e correções
├── product.md             # Contexto do produto e features
├── tech-stack.md          # Stack técnico e dependências
├── workflow.md            # Regras de desenvolvimento e padrões
├── DEPLOY.md              # Configurações de deploy, keys e acessos
└── tracks/                # Tracks de features implementadas
    ├── advanced-platform-architecture/
    │   └── plan.md        # Arquitetura avançada da plataforma
    ├── ai-recommendations-visualization/
    │   └── plan.md        # Visualização de recomendações de IA e seeding automático
    ├── ai-simulated-demo/
    │   └── plan.md        # Demo simulada com IA
    ├── approval-workflow-system/
    │   └── plan.md        # Sistema de workflow de aprovações
    ├── auth-budget-redemption-fix/
    │   └── plan.md        # Correções de autenticação e orçamento
    ├── catalog-master-import/
    │   └── plan.md        # Sistema de catálogo mestre e replicação
    ├── design-system-modernization/
    │   └── plan.md        # Modernização do design system
    ├── fun-mode-sophisticated-redesign/
    │   └── plan.md        # Redesign sofisticado do modo Fun
    ├── gamification-hub-stitch-design/
    │   └── plan.md        # Hub de gamificação com design Stitch
    ├── grok-ai-integration/
    │   └── plan.md        # Integração Grok AI (xAI)
    ├── known-issues-and-patterns/
    │   └── plan.md        # ⚠️ Erros conhecidos e padrões obrigatórios
    ├── product-detail-page-fix/
    │   └── plan.md        # Correção da página de detalhes do produto
    ├── send-gifts/
    │   └── plan.md        # Sistema de envio de presentes
    └── ui-extensions-reference/
        └── plan.md        # Referência de extensões de UI
```

## Comandos Disponíveis

### Sincronização Automática
```bash
./conductor.sh sync
```
ou
```bash
node conductor-sync.js
```

**O que faz:**
- **Sincronização Auto Claude**: Converte specs do Auto Claude (`.auto-claude/specs/`) em tracks do Conductor (`conductor/tracks/`)
- Analisa o código para detectar funções, interfaces e features
- Atualiza `product.md` com features detectadas
- Atualiza `tech-stack.md` com informações técnicas
- Atualiza `README.md`, `DEPLOY.md`, `workflow.md` e `AUTOMATION.md` com metadados de rastreamento em tempo real
- Verifica problemas de layout (uso incorreto de AppShell)
- Gera entrada no `CHANGELOG.md` com resumo inteligente da Gemini API
- Detecta itens de navegação por role
- Analisa git diffs para entender mudanças no código
- Integra com Gemini API para resumos contextuais e estruturados

### Sincronização com Auto Claude
```bash
./conductor.sh sync-claude
```

**O que faz:**
- Sincroniza specs do Auto Claude (`.auto-claude/specs/`) para tracks do Conductor (`conductor/tracks/`)
- Converte `implementation_plan.json` e `requirements.json` em `plan.md` formatado
- Preserva conteúdo existente nos tracks (não sobrescreve se o track foi modificado mais recentemente)
- Atualiza o changelog com informações sobre a sincronização
- Permite que o Claude Code atue como ajudante no fluxo do Conductor

**Integração Automática:**
- O comando `./conductor.sh sync` já inclui a sincronização com Auto Claude automaticamente
- Use `./claude.sh sync` para sincronizar do lado do Auto Claude

### Configurar Git Hook Automático
```bash
./scripts/setup-conductor-hook.sh
```

**O que faz:**
- Instala um `pre-commit` hook que executa `conductor-sync.js` automaticamente
- Adiciona mudanças do Conductor ao commit automaticamente
- Garante que toda mudança aprovada seja documentada

**Requisitos:**
- Repositório git inicializado
- `GEMINI_API_KEY` configurada no `.env` (opcional, mas recomendado)

### Criar Novo Track
```bash
./conductor.sh new-track nome-do-track
```

Cria um novo arquivo de track em `conductor/tracks/nome-do-track/plan.md` com template básico.

**Nota:** Tracks também podem ser criados automaticamente a partir de specs do Auto Claude usando `./conductor.sh sync-claude` ou `./claude.sh sync`.

### Usar Gemini Conductor
```bash
./conductor.sh [comando gemini]
```

Passa comandos diretamente para o Gemini Conductor.

## Documentação Automática

O `conductor-sync.js` detecta automaticamente:

### Features do Storage
- Funções exportadas em `lib/storage.ts`
- Interfaces TypeScript
- Módulos de negócio (Inventory, Gifts, Logs, Gamification)
- Sistema de moeda dinâmica (`getCurrencyName`, `StoreSettings.currency`)
- Funções de gestão de usuários (add, invite, import)

### Navegação
- Itens de menu por role (Manager, Member, SuperAdmin)
- Acesso a features específicas (ex: Send Gifts)

### Layout
- Uso incorreto de `AppShell` em páginas
- Conformidade com padrão `PageContainer`

### Mudanças
- Arquivos modificados (`.tsx`, `.ts`, `.md`)
- Análise de git diffs para entender contexto
- Geração automática de entradas no changelog com resumo inteligente (Gemini API)
- Detecção de novas funcionalidades (exportação CSV, gráficos, gestão de usuários)
- Atualização de referências de moeda (substituição de "Pontos" por sistema dinâmico)

### Integração com Gemini API
- Analisa diffs do git para entender mudanças
- Gera resumos estruturados e informativos
- Identifica padrões e regras estabelecidas
- Requer `GEMINI_API_KEY` no `.env` (opcional, mas recomendado)

## Padrões Documentados

### Layout de Páginas
✅ **CORRETO**: Usar `PageContainer`
```tsx
import { PageContainer } from "@/components/page-container"

export default function MyPage() {
  return (
    <PageContainer className="space-y-6">
      {/* conteúdo */}
    </PageContainer>
  )
}
```

❌ **ERRADO**: Usar `AppShell` nas páginas
```tsx
import { AppShell } from "@/components/app-shell"
// ❌ Causa menus duplicados
```

### Navegação por Role
- **Manager/SuperAdmin**: Acesso completo
- **Member**: Acesso limitado (loja, pedidos próprios)
- **Send Gifts**: Exclusivo para Manager/Admin

## Workflow Recomendado

1. **Nova Feature**: 
   ```bash
   ./conductor.sh new-track nome-feature
   # Editar conductor/tracks/nome-feature/plan.md
   ```

2. **Durante Desenvolvimento**:
   - Documentar mudanças no `plan.md` do track
   - Seguir padrões em `workflow.md`

3. **Após Conclusão**:
   ```bash
   ./conductor.sh sync
   ```
   - Atualiza documentação automaticamente
   - Gera changelog se necessário

4. **Antes de Commits**:
   - Verificar se `CHANGELOG.md` está atualizado
   - Confirmar que `plan.md` do track está completo

## Arquivos Importantes

- **CHANGELOG.md**: Histórico completo de mudanças (atualizado automaticamente)
- **workflow.md**: Regras e padrões de desenvolvimento (rastreado em tempo real)
- **product.md**: Visão geral do produto e features (atualizado automaticamente)
- **tech-stack.md**: Stack técnico e dependências (atualizado automaticamente)
- **DEPLOY.md**: Configurações de deploy, keys e acessos (rastreado em tempo real)
- **tracks/[feature]/plan.md**: Plano detalhado de cada feature (sincronizado automaticamente)
- **README.md**: Documentação principal (rastreado em tempo real)
- **AUTOMATION.md**: Detalhes da automação do Conductor (rastreado em tempo real)

## Integração com Auto Claude

O Conductor trabalha em conjunto com o **Auto Claude** para manter documentação sincronizada:

### Fluxo de Trabalho

1. **Auto Claude** cria specs em `.auto-claude/specs/[feature-name]/`
   - `implementation_plan.json`: Plano de implementação estruturado
   - `requirements.json`: Requisitos da feature

2. **Sincronização Automática** converte specs em tracks:
   ```bash
   ./conductor.sh sync
   # ou
   ./claude.sh sync
   ```

3. **Tracks do Conductor** são criados/atualizados em `conductor/tracks/[feature-name]/plan.md`
   - Formato markdown legível
   - Preserva conteúdo existente se o track foi editado manualmente

4. **Documentação Compartilhada** fica disponível em:
   - `conductor/tracks/` - Tracks formatados (tracked by git)
   - `.auto-claude/specs/` - Specs estruturadas (ignored by git, shared via brain)

### Claude Code como Ajudante

O **Claude Code** pode atuar como ajudante no fluxo do Conductor:

- **Análise de Specs**: Claude Code pode analisar specs do Auto Claude e sugerir melhorias
- **Geração de Tracks**: Converte automaticamente specs em tracks formatados
- **Sincronização Inteligente**: Detecta mudanças e sincroniza apenas quando necessário
- **Documentação Automática**: Mantém changelog e documentação atualizados

### Comandos de Integração

```bash
# Sincronizar tudo (Auto Claude + Conductor)
./conductor.sh sync

# Sincronizar apenas Auto Claude → Conductor
./conductor.sh sync-claude

# Sincronizar do lado do Auto Claude
./claude.sh sync
./claude.sh sync-conductor
```

## Visualização de Specs

### Spec Viewer (Super Admin)
- **Rota**: `/super-admin/conductor`
- **Acesso**: Apenas Super Admin
- **Features**:
  - Visão geral com estatísticas
  - Visualização profissional de toda documentação (markdown renderizado com `react-markdown`)
  - Lista de tracks implementados
  - Changelog interativo
  - Suporte completo para Fun Mode
  - **Syntax Highlighting**: Realce de sintaxe colorido em blocos de código
  - **Copy to Clipboard**: Botão para copiar código com um clique
  - **Tabelas e Checklists**: Suporte completo para GitHub Flavored Markdown
  - **Animações Suaves**: Transições elegantes usando `framer-motion`

### API de Conductor
- **Endpoint**: `/api/conductor`
- **Ações**:
  - `?action=list`: Lista todos os arquivos e tracks
  - `?action=read&file=filename.md`: Lê arquivo específico
- **Segurança**: Apenas leitura, validação de path traversal

## Troubleshooting

### Menu Duplicado
**Problema**: Dois menus aparecem na página
**Solução**: Verificar se a página não está usando `AppShell` diretamente. Use `PageContainer`.

### Documentação Desatualizada
**Solução**: Execute `./conductor.sh sync` para sincronizar.

### Track Não Aparece
**Solução**: Verificar se o track está em `conductor/tracks/[nome]/plan.md` e foi documentado corretamente.


---
*Atualizado em 03/01/2026, 01:45:26 via Conductor Real-time Tracking*