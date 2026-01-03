#!/bin/bash

# Script para configurar git hook que executa claude-sync automaticamente
# Uso: ./scripts/setup-claude-hook.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOK_DIR="$PROJECT_ROOT/.git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

echo "🔧 Configurando git hook para Auto Claude..."

if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo "❌ Erro: Este diretório não é um repositório git."
  exit 1
fi

mkdir -p "$HOOK_DIR"

# Se o arquivo já existe, vamos anexar ou garantir que ambos rodem
if [ -f "$HOOK_FILE" ]; then
  if grep -q "claude-sync.js" "$HOOK_FILE"; then
    echo "✅ Hook já configurado para Claude."
  else
    echo "🔄 Adicionando Claude sync ao hook existente..."
    cat >> "$HOOK_FILE" << 'EOF'

# Auto Claude Sync
if [ -f "$PROJECT_ROOT/claude-sync.js" ]; then
  echo "🔄 Executando Auto Claude sync..."
  node "$PROJECT_ROOT/claude-sync.js"
fi
EOF
  fi
else
  # Criar novo
  cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash

PROJECT_ROOT="$(git rev-parse --show-toplevel)"

# Conductor Sync
if [ -f "$PROJECT_ROOT/conductor-sync.js" ]; then
  echo "🔄 Executando Conductor sync..."
  node "$PROJECT_ROOT/conductor-sync.js"
fi

# Auto Claude Sync
if [ -f "$PROJECT_ROOT/claude-sync.js" ]; then
  echo "🔄 Executando Auto Claude sync..."
  node "$PROJECT_ROOT/claude-sync.js"
fi

# Adicionar mudanças da documentação
git add conductor/ 2>/dev/null || true
EOF
  chmod +x "$HOOK_FILE"
fi

echo "✅ Git hook configurado com sucesso!"
