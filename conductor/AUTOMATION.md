# Automação do Conductor

Este documento descreve como a automação do Conductor funciona para garantir que todas as especificações sejam documentadas automaticamente.

## Sincronização Automática

### Git Hook (post-commit)
Um hook do Git foi configurado em `.git/hooks/post-commit` que:
- Detecta commits com mudanças em arquivos relevantes (`.tsx`, `.ts`, `.md`, `.json`)
- Verifica se há mudanças em diretórios importantes (`conductor/`, `lib/`, `app/`, `components/`)
- Executa automaticamente `conductor-sync.js` após commits relevantes
- Mantém a documentação sempre atualizada

**Como funciona:**
```bash
git commit -m "feat: nova feature"
# Hook executa automaticamente: node conductor-sync.js
```

### Sincronização Manual
Execute quando precisar atualizar a documentação:
```bash
./conductor.sh sync
```

Ou diretamente:
```bash
node conductor-sync.js
```

## O que é Sincronizado Automaticamente

### 1. Features do Storage (`lib/storage.ts`)
- ✅ Contagem de funções exportadas
- ✅ Contagem de interfaces TypeScript
- ✅ Detecção de módulos de negócio:
  - Inventory (replicateProduct)
  - Gifts (scheduleGiftOrder)
  - Logs (createReplicationLog)
  - Gamification (LEVEL_CONFIG)

### 2. Navegação (`lib/navigation.ts`)
- ✅ Itens de menu por role (Manager, Member, SuperAdmin)
- ✅ Detecção de acesso a features específicas
- ✅ Verificação de restrições de acesso

### 3. Layout e Conformidade
- ✅ Verificação de uso incorreto de `AppShell` em páginas
- ✅ Detecção de conformidade com padrão `PageContainer`
- ✅ Alertas para problemas de layout

### 4. Changelog Automático
- ✅ Geração de entradas no `CHANGELOG.md` quando há mudanças
- ✅ Lista de arquivos modificados
- ✅ Data automática das mudanças

### 5. Documentação de Produto
- ✅ Atualização de `product.md` com features detectadas
- ✅ Informações de navegação e layout
- ✅ Restrições de acesso por role

### 6. Stack Técnico
- ✅ Atualização de `tech-stack.md` com versões de dependências
- ✅ Contagem de funções e interfaces
- ✅ Módulos de negócio disponíveis

## Fluxo de Trabalho Recomendado

### Para Novas Features

1. **Criar Track:**
   ```bash
   ./conductor.sh new-track nome-da-feature
   ```

2. **Desenvolver:**
   - Implementar a feature
   - Documentar mudanças no `plan.md` do track

3. **Commit:**
   ```bash
   git add .
   git commit -m "feat: implementa nova feature"
   # Hook executa sync automaticamente
   ```

4. **Verificar:**
   - `conductor/CHANGELOG.md` foi atualizado
   - `conductor/product.md` reflete as mudanças
   - `conductor/tracks/[feature]/plan.md` está completo

### Para Correções

1. **Corrigir o problema**
2. **Documentar no CHANGELOG:**
   - Adicionar entrada manual se necessário
   - Ou deixar o sync automático detectar
3. **Commit:**
   ```bash
   git commit -m "fix: corrige problema X"
   # Sync automático atualiza documentação
   ```

## Arquivos Atualizados Automaticamente

- `conductor/product.md` - Features e navegação
- `conductor/tech-stack.md` - Stack técnico
- `conductor/CHANGELOG.md` - Histórico de mudanças
- `conductor/README.md` - Documentação do sistema
- `conductor/DEPLOY.md` - Configurações de deploy
- `conductor/workflow.md` - Padrões de desenvolvimento
- `conductor/AUTOMATION.md` - Este arquivo (metadados de sync)

## Arquivos Criados Manualmente

- `conductor/tracks/[feature]/plan.md` - Plano de cada feature (sincronizado com Auto Claude specs)

## Troubleshooting

### Hook não executa
```bash
# Verificar se o hook existe e tem permissão
ls -la .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

### Sync não detecta mudanças
- Verificar se os arquivos estão em diretórios monitorados
- Executar sync manualmente: `./conductor.sh sync`

### Documentação desatualizada
```bash
# Forçar atualização completa
./conductor.sh sync
npx gemini conductor setup
```

## Personalização

Para adicionar novas detecções automáticas, edite `conductor-sync.js`:

1. Adicione função de extração de informações
2. Adicione função de atualização de documentação
3. Chame as funções no fluxo principal

Exemplo:
```javascript
function extractNewInfo() {
  // Sua lógica aqui
  return { /* dados */ };
}

function updateDocs(info) {
  // Atualizar documentação
}

// No fluxo principal
const newInfo = extractNewInfo();
updateDocs(newInfo);
```


## Gatilhos de Sincronização (Triggers)

O Conductor utiliza diversos gatilhos para garantir que a documentação esteja sempre em sincronia com o código e com o Auto Claude.

### 1. Git Hooks (Pre-commit)
Gatilho automático que dispara antes de cada commit.
- **Script**: `scripts/setup-conductor-hook.sh` e `scripts/setup-claude-hook.sh`
- **Ação**: Executa `conductor-sync.js` e `claude-sync.js`.
- **Filtro**: Apenas arquivos relevantes (`.tsx`, `.ts`, `.md`, `.json`) disparam o sync.
- **Automação**: Adiciona automaticamente os arquivos de documentação alterados (`conductor/`) ao commit atual.

### 2. Auto Claude Triggers
Integração bidirecional com o sistema de IA Auto Claude.
- **Gatilho de Entrada**: Quando o Claude Code termina uma tarefa ou detecta mudanças nas specs (`.auto-claude/specs/`).
- **Ação**: O script `claude-sync.js` é executado, convertendo as specs estruturadas em tracks legíveis no Conductor.
- **Sincronização**: O `./claude.sh sync` atua como o gatilho principal para sincronizar o "cérebro" da IA com a documentação do repositório.

### 3. Comandos Manuais (CLI)
Gatilhos disparados pelo desenvolvedor via terminal.
- `./conductor.sh sync`: Sincroniza tudo (Código + Auto Claude → Conductor).
- `./conductor.sh sync-claude`: Gatilho específico para sincronizar specs do Auto Claude.
- `./claude.sh sync`: Gatilho principal do ecossistema Claude para manter tudo atualizado.

### 4. Real-time Tracking
Gatilho interno do script de sincronização que anexa metadados de tempo e versão.
- **Ação**: Atualiza o rodapé de todos os arquivos do Conductor com o timestamp da última sincronização.

## Fluxo de Trabalho Integrado

1. **Ideação/Spec**: Você define requisitos no Auto Claude.
2. **Gatilho Sync**: Ao executar `./claude.sh sync`, o Conductor cria automaticamente o track em `conductor/tracks/`.
3. **Desenvolvimento**: Você codifica a feature.
4. **Gatilho Commit**: Ao fazer o commit, o Git Hook dispara o `conductor-sync.js`.
5. **Resultado**: O `CHANGELOG.md` e `product.md` são atualizados com as novas funções detectadas no código.

---
*Atualizado em 03/01/2026, 02:03:41 via Conductor Real-time Tracking*