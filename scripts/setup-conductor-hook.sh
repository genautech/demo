#!/bin/bash

# Script para configurar git hook que executa conductor-sync automaticamente
# Uso: ./scripts/setup-conductor-hook.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOK_DIR="$PROJECT_ROOT/.git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

echo "🔧 Configurando git hook para Conductor..."

# Verificar se estamos em um repositório git
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo "❌ Erro: Este diretório não é um repositório git."
  echo "   Execute 'git init' primeiro."
  exit 1
fi

# Criar diretório de hooks se não existir
mkdir -p "$HOOK_DIR"

# Criar ou atualizar o hook pre-commit
cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash

# Conductor Auto-Sync Hook
# Este hook executa automaticamente o conductor-sync.js antes de cada commit

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
CONDUCTOR_SYNC="$PROJECT_ROOT/conductor-sync.js"

# Verificar se o arquivo existe
if [ ! -f "$CONDUCTOR_SYNC" ]; then
  echo "⚠️  conductor-sync.js não encontrado. Pulando sincronização."
  exit 0
fi

# Verificar se há mudanças relevantes
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(tsx?|js|md)$' || true)

if [ -z "$CHANGED_FILES" ]; then
  # Nenhuma mudança relevante, continuar normalmente
  exit 0
fi

echo "🔄 Executando Conductor sync antes do commit..."

# Executar conductor-sync.js
cd "$PROJECT_ROOT"
node conductor-sync.js

# Verificar se houve mudanças no conductor (changelog, etc)
if [ -n "$(git diff --name-only conductor/)" ]; then
  echo "📝 Conductor atualizou documentação. Adicionando mudanças ao commit..."
  git add conductor/CHANGELOG.md conductor/product.md conductor/tech-stack.md 2>/dev/null || true
fi

echo "✅ Conductor sync concluído."
EOF

# Tornar o hook executável
chmod +x "$HOOK_FILE"

echo "✅ Git hook configurado com sucesso!"
echo ""
echo "📋 O que foi configurado:"
echo "   - Pre-commit hook em: $HOOK_FILE"
echo "   - Executa automaticamente: conductor-sync.js"
echo "   - Adiciona mudanças do Conductor ao commit automaticamente"
echo ""
echo "💡 Para desabilitar, remova o arquivo:"
echo "   rm $HOOK_FILE"
echo ""
echo "🚀 Próximo commit executará o Conductor sync automaticamente!"
