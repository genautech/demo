#!/bin/bash

# Script de conveniência para o Google Conductor
# Garante que as variáveis de ambiente locais estejam sempre corretas

export GEMINI_HOME="$(pwd)/.gemini"
export HOME="$(pwd)/.gemini"

# Tenta carregar do .env se existir
if [ -f .env ]; then
    # Lê a chave diretamente para evitar problemas com xargs/export em shells restritos
    KEY=$(grep GEMINI_API_KEY .env | cut -d '=' -f2)
    if [ ! -z "$KEY" ]; then
        export GEMINI_API_KEY="$KEY"
    fi
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  ERRO: GEMINI_API_KEY não encontrada."
    echo "Por favor, crie um arquivo .env ou execute: export GEMINI_API_KEY='sua_chave'"
    exit 1
fi

# Passa todos os argumentos para o comando npx gemini
if [ "$1" == "sync" ]; then
    echo "🚀 Iniciando Sincronização Automática..."
    
    # Sincronizar Auto Claude → Conductor (specs para tracks)
    if [ -f "auto-claude-conductor-sync.js" ]; then
        echo "🔄 Sincronizando Auto Claude com Conductor..."
        node auto-claude-conductor-sync.js
        echo ""
    fi
    
    # Sincronização padrão do Conductor
    node conductor-sync.js
    echo "🧠 Atualizando o cérebro do Conductor..."
    npx gemini conductor setup
    echo "✨ Tudo pronto! O Conductor agora está ciente das últimas mudanças."
    echo ""
    echo "📋 Documentação atualizada em:"
    echo "   - conductor/product.md"
    echo "   - conductor/tech-stack.md"
    echo "   - conductor/CHANGELOG.md"
    echo "   - conductor/tracks/ (sincronizado com Auto Claude specs)"
elif [ "$1" == "watch" ]; then
    echo "👀 Iniciando Watcher do Conductor em tempo real..."
    node conductor-watcher.js
elif [ "$1" == "sync-claude" ]; then
    echo "🔄 Sincronizando Auto Claude → Conductor..."
    if [ -f "auto-claude-conductor-sync.js" ]; then
        node auto-claude-conductor-sync.js
        echo "✅ Sincronização Auto Claude concluída!"
    else
        echo "❌ Erro: auto-claude-conductor-sync.js não encontrado."
        exit 1
    fi
elif [ "$1" == "new-track" ]; then
    echo "📝 Criando novo track..."
    if [ -z "$2" ]; then
        echo "❌ Erro: Por favor, forneça um nome para o track."
        echo "   Uso: ./conductor.sh new-track nome-do-track"
        exit 1
    fi
    TRACK_NAME="$2"
    TRACK_DIR="conductor/tracks/$TRACK_NAME"
    mkdir -p "$TRACK_DIR"
    cat > "$TRACK_DIR/plan.md" << EOF
# Track: $TRACK_NAME

## Contexto
[Descreva o contexto e necessidade desta feature]

## Objetivos
- [ ] Objetivo 1
- [ ] Objetivo 2

## Implementação

### Fase 1: [Nome da Fase]
- [ ] Tarefa 1
- [ ] Tarefa 2

## Arquivos Criados/Modificados
- [Lista de arquivos será atualizada durante a implementação]

## Resultados
[Será preenchido após conclusão]
EOF
    echo "✅ Track criado em: $TRACK_DIR/plan.md"
    echo "📝 Edite o arquivo para adicionar os detalhes do track."
else
    npx gemini "$@"
fi
