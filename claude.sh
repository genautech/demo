#!/bin/bash

# Script de conveniência para o Auto Claude
# Garante que as variáveis de ambiente locais estejam sempre corretas

export CLAUDE_HOME="$(pwd)/.auto-claude"

# Tenta carregar do .env se existir
if [ -f .env ]; then
    KEY=$(grep CLAUDE_API_KEY .env | cut -d '=' -f2)
    if [ ! -z "$KEY" ]; then
        export CLAUDE_API_KEY="$KEY"
    fi
    
    # Fallback para ANTHROPIC_API_KEY
    if [ -z "$CLAUDE_API_KEY" ]; then
        KEY=$(grep ANTHROPIC_API_KEY .env | cut -d '=' -f2)
        if [ ! -z "$KEY" ]; then
            export CLAUDE_API_KEY="$KEY"
        fi
    fi
fi

# Comando principal
if [ "$1" == "sync" ]; then
    echo "🚀 Iniciando Sincronização Automática (Claude)..."
    node claude-sync.js
    
    # Sincronizar com Conductor (specs para tracks)
    if [ -f "auto-claude-conductor-sync.js" ]; then
        echo ""
        echo "🔄 Sincronizando specs do Auto Claude para tracks do Conductor..."
        node auto-claude-conductor-sync.js
    fi
    
    echo "🧠 Atualizando o cérebro do Auto Claude..."
    # Aqui poderíamos adicionar um comando para atualizar o contexto do Claude se necessário
    echo "✨ Tudo pronto! O Auto Claude agora está ciente das últimas mudanças."
    echo ""
    echo "📋 Documentação sincronizada."
    echo "   - Auto Claude: .auto-claude/"
    echo "   - Conductor: conductor/ (tracks sincronizados)"
elif [ "$1" == "sync-conductor" ]; then
    echo "🔄 Sincronizando Auto Claude → Conductor..."
    if [ -f "auto-claude-conductor-sync.js" ]; then
        node auto-claude-conductor-sync.js
        echo "✅ Sincronização concluída!"
    else
        echo "❌ Erro: auto-claude-conductor-sync.js não encontrado."
        exit 1
    fi
elif [ "$1" == "new-spec" ]; then
    echo "📝 Criando nova especificação..."
    if [ -z "$2" ]; then
        echo "❌ Erro: Por favor, forneça um nome para a especificação."
        echo "   Uso: ./claude.sh new-spec nome-da-feature"
        exit 1
    fi
    SPEC_NAME="$2"
    SPEC_DIR=".auto-claude/specs/$SPEC_NAME"
    mkdir -p "$SPEC_DIR"
    
    cat > "$SPEC_DIR/requirements.json" << EOF
{
  "task_description": "$SPEC_NAME",
  "workflow_type": "feature",
  "status": "draft"
}
EOF

    cat > "$SPEC_DIR/implementation_plan.json" << EOF
{
  "feature": "$SPEC_NAME",
  "description": "",
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "updated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "status": "draft",
  "phases": [],
  "planStatus": "draft"
}
EOF
    echo "✅ Especificação criada em: $SPEC_DIR/"
else
    echo "Auto Claude CLI"
    echo "Uso: ./claude.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  sync            Sincroniza o código com a documentação e Conductor"
    echo "  sync-conductor  Sincroniza apenas specs do Auto Claude para tracks do Conductor"
    echo "  new-spec        Cria uma nova especificação de feature"
    echo ""
    echo "Integração com Conductor:"
    echo "  O Auto Claude trabalha em conjunto com o Conductor (Gemini)."
    echo "  Use './claude.sh sync' para sincronizar ambos os sistemas."
fi
