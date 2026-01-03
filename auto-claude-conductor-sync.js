const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const AUTO_CLAUDE_SPECS = path.join(__dirname, '.auto-claude/specs');
const AUTO_CLAUDE_INSIGHTS = path.join(__dirname, '.auto-claude/insights');
const CONDUCTOR_TRACKS = path.join(__dirname, 'conductor/tracks');
const CONDUCTOR_CHANGELOG = path.join(__dirname, 'conductor/CHANGELOG.md');

/**
 * Converte uma spec do Auto Claude em um track do Conductor
 */
function convertSpecToTrack(specName, specDir) {
  const implementationPlanPath = path.join(specDir, 'implementation_plan.json');
  const requirementsPath = path.join(specDir, 'requirements.json');
  
  if (!fs.existsSync(implementationPlanPath)) {
    return null;
  }

  try {
    const implementationPlan = JSON.parse(fs.readFileSync(implementationPlanPath, 'utf8'));
    const requirements = fs.existsSync(requirementsPath) 
      ? JSON.parse(fs.readFileSync(requirementsPath, 'utf8'))
      : { task_description: specName, workflow_type: 'feature' };

    // Normalizar nome do track (remover números prefixados e caracteres especiais)
    const trackName = specName
      .replace(/^\d+-/, '') // Remove prefixo numérico (ex: "002-")
      .replace(/[^a-z0-9-]/gi, '-')
      .toLowerCase()
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const trackDir = path.join(CONDUCTOR_TRACKS, trackName);
    const planPath = path.join(trackDir, 'plan.md');

    // Verificar se o track já existe
    let existingContent = '';
    if (fs.existsSync(planPath)) {
      existingContent = fs.readFileSync(planPath, 'utf8');
    }

    // Gerar conteúdo do plan.md
    const feature = implementationPlan.feature || specName;
    const description = implementationPlan.description || requirements.task_description || '';
    const status = implementationPlan.status || 'draft';
    const phases = implementationPlan.phases || [];
    const createdAt = implementationPlan.created_at || new Date().toISOString();
    const updatedAt = implementationPlan.updated_at || new Date().toISOString();

    // Determinar status do track
    let trackStatus = 'Em Desenvolvimento';
    if (status === 'completed' || status === 'done') {
      trackStatus = 'CONCLUÍDO';
    } else if (status === 'review' || status === 'human_review') {
      trackStatus = 'EM REVISÃO';
    } else if (status === 'cancelled') {
      trackStatus = 'CANCELADO';
    }

    // Construir markdown
    let markdown = `# Track: ${feature} [${trackStatus}]\n\n`;
    
    if (description) {
      markdown += `## Contexto\n${description}\n\n`;
    }

    markdown += `## Objetivos\n`;
    if (phases.length > 0) {
      phases.forEach((phase, idx) => {
        const phaseName = phase.name || `Fase ${idx + 1}`;
        const tasks = phase.tasks || [];
        markdown += `\n### ${phaseName}\n`;
        tasks.forEach(task => {
          const checked = task.completed ? 'x' : ' ';
          markdown += `- [${checked}] ${task.description || task.name || 'Tarefa'}\n`;
        });
      });
    } else {
      markdown += `- [ ] Objetivo 1\n- [ ] Objetivo 2\n`;
    }

    markdown += `\n## Implementação\n\n`;
    markdown += `### Detalhes da Spec\n`;
    markdown += `- **Criado em**: ${new Date(createdAt).toLocaleDateString('pt-BR')}\n`;
    markdown += `- **Atualizado em**: ${new Date(updatedAt).toLocaleDateString('pt-BR')}\n`;
    markdown += `- **Status**: ${status}\n`;
    markdown += `- **Workflow**: ${requirements.workflow_type || 'feature'}\n\n`;

    if (phases.length > 0) {
      markdown += `### Fases de Implementação\n\n`;
      phases.forEach((phase, idx) => {
        const phaseName = phase.name || `Fase ${idx + 1}`;
        const phaseDesc = phase.description || '';
        const tasks = phase.tasks || [];
        
        markdown += `#### ${phaseName}\n`;
        if (phaseDesc) {
          markdown += `${phaseDesc}\n\n`;
        }
        tasks.forEach(task => {
          const checked = task.completed ? 'x' : ' ';
          markdown += `- [${checked}] ${task.description || task.name || 'Tarefa'}\n`;
        });
        markdown += `\n`;
      });
    }

    markdown += `## Arquivos Criados/Modificados\n`;
    markdown += `[Lista de arquivos será atualizada durante a implementação]\n\n`;

    markdown += `## Resultados\n`;
    markdown += `[Será preenchido após conclusão]\n\n`;

    // Adicionar nota sobre sincronização
    markdown += `---\n\n`;
    markdown += `*Este track foi sincronizado automaticamente do Auto Claude spec: \`${specName}\`*\n`;
    markdown += `*Última sincronização: ${new Date().toISOString()}*\n`;

    // Preservar conteúdo existente se houver seções adicionais
    if (existingContent) {
      const existingSections = {
        arquivos: existingContent.match(/## Arquivos Modificados\/Criados[\s\S]*?(?=\n##|$)/)?.[0],
        resultados: existingContent.match(/## Resultados[\s\S]*?(?=\n##|$)/)?.[0],
        regras: existingContent.match(/## Regras[\s\S]*?(?=\n##|$)/)?.[0],
      };

      if (existingSections.arquivos && !existingSections.arquivos.includes('[Lista de arquivos será atualizada')) {
        markdown = markdown.replace(
          /## Arquivos Criados\/Modificados[\s\S]*?(?=\n##|$)/,
          existingSections.arquivos
        );
      }

      if (existingSections.resultados && !existingSections.resultados.includes('[Será preenchido após conclusão]')) {
        markdown = markdown.replace(
          /## Resultados[\s\S]*?(?=\n##|$)/,
          existingSections.resultados
        );
      }

      if (existingSections.regras) {
        markdown += `\n${existingSections.regras}\n`;
      }
    }

    return {
      trackName,
      trackDir,
      planPath,
      markdown,
      specName
    };
  } catch (error) {
    console.error(`⚠️  Erro ao processar spec ${specName}:`, error.message);
    return null;
  }
}

/**
 * Sincroniza todas as specs do Auto Claude para tracks do Conductor
 */
function syncSpecsToTracks() {
  if (!fs.existsSync(AUTO_CLAUDE_SPECS)) {
    console.log('ℹ️  Diretório .auto-claude/specs não encontrado. Pulando sincronização de specs.');
    return { synced: 0, skipped: 0, errors: 0 };
  }

  const specs = fs.readdirSync(AUTO_CLAUDE_SPECS, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (specs.length === 0) {
    console.log('ℹ️  Nenhuma spec encontrada em .auto-claude/specs');
    return { synced: 0, skipped: 0, errors: 0 };
  }

  console.log(`📋 Encontradas ${specs.length} specs para sincronizar...`);

  let synced = 0;
  let skipped = 0;
  let errors = 0;

  specs.forEach(specName => {
    const specDir = path.join(AUTO_CLAUDE_SPECS, specName);
    const track = convertSpecToTrack(specName, specDir);

    if (!track) {
      skipped++;
      return;
    }

    try {
      // Criar diretório do track se não existir
      if (!fs.existsSync(track.trackDir)) {
        fs.mkdirSync(track.trackDir, { recursive: true });
      }

      // Verificar se precisa atualizar (comparar timestamps)
      let shouldUpdate = true;
      if (fs.existsSync(track.planPath)) {
        const existingStat = fs.statSync(track.planPath);
        const specStat = fs.statSync(path.join(specDir, 'implementation_plan.json'));
        
        // Se o track foi modificado mais recentemente que a spec, não sobrescrever
        if (existingStat.mtime > specStat.mtime) {
          const lastSyncMatch = fs.readFileSync(track.planPath, 'utf8').match(/Última sincronização: (.+)/);
          if (lastSyncMatch) {
            const lastSync = new Date(lastSyncMatch[1]);
            const specUpdate = new Date(JSON.parse(fs.readFileSync(path.join(specDir, 'implementation_plan.json'), 'utf8')).updated_at || 0);
            shouldUpdate = lastSync < specUpdate;
          } else {
            // Se não tem timestamp de sync, preservar conteúdo existente
            shouldUpdate = false;
          }
        }
      }

      if (shouldUpdate) {
        fs.writeFileSync(track.planPath, track.markdown, 'utf8');
        console.log(`  ✅ Sincronizado: ${track.specName} → ${track.trackName}`);
        synced++;
      } else {
        console.log(`  ⏭️  Pulado (track mais recente): ${track.trackName}`);
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Erro ao sincronizar ${track.specName}:`, error.message);
      errors++;
    }
  });

  return { synced, skipped, errors };
}

/**
 * Lê insights relevantes do Auto Claude
 */
function getAutoClaudeInsights() {
  const insights = {
    currentSession: null,
    latestSession: null,
    summary: null
  };

  // Ler sessão atual
  const currentSessionPath = path.join(AUTO_CLAUDE_INSIGHTS, 'current_session.json');
  if (fs.existsSync(currentSessionPath)) {
    try {
      insights.currentSession = JSON.parse(fs.readFileSync(currentSessionPath, 'utf8'));
    } catch (error) {
      console.error('⚠️  Erro ao ler current_session.json:', error.message);
    }
  }

  // Ler última sessão
  const sessionsDir = path.join(AUTO_CLAUDE_INSIGHTS, 'sessions');
  if (fs.existsSync(sessionsDir)) {
    try {
      const sessions = fs.readdirSync(sessionsDir)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(sessionsDir, f),
          mtime: fs.statSync(path.join(sessionsDir, f)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);

      if (sessions.length > 0) {
        insights.latestSession = JSON.parse(fs.readFileSync(sessions[0].path, 'utf8'));
      }
    } catch (error) {
      console.error('⚠️  Erro ao ler sessões:', error.message);
    }
  }

  return insights;
}

/**
 * Gera resumo de sincronização para o changelog
 */
function generateSyncSummary(syncResults, insights) {
  const today = new Date().toISOString().split('T')[0];
  const summary = {
    date: today,
    type: 'Sync',
    syncedSpecs: syncResults.synced,
    skippedSpecs: syncResults.skipped,
    errors: syncResults.errors,
    hasInsights: !!insights.latestSession
  };

  return summary;
}

/**
 * Adiciona entrada no changelog sobre sincronização
 */
function appendSyncToChangelog(summary) {
  if (!summary || summary.syncedSpecs === 0) {
    return; // Não adicionar entrada se não houve sincronizações
  }

  let changelog = '';
  if (fs.existsSync(CONDUCTOR_CHANGELOG)) {
    changelog = fs.readFileSync(CONDUCTOR_CHANGELOG, 'utf8');
  } else {
    changelog = '# Changelog - Especificações e Correções\n\nEste arquivo documenta todas as mudanças, correções e melhorias implementadas no projeto.\n\n';
  }

  // Verificar se já existe entrada para hoje sobre sync
  const todayPattern = new RegExp(`## ${summary.date.replace(/-/g, '[- ]')}.*?Sync.*?Auto Claude`, 's');
  if (todayPattern.test(changelog)) {
    console.log('ℹ️  Entrada de sync para hoje já existe no changelog. Pulando...');
    return;
  }

  const newEntry = `\n## ${summary.date} - Sync Auto Claude → Conductor\n\n` +
    `### Sincronização de Specs\n` +
    `- ✅ ${summary.syncedSpecs} spec(s) sincronizada(s) para tracks\n` +
    (summary.skippedSpecs > 0 ? `- ⏭️  ${summary.skippedSpecs} spec(s) pulada(s) (tracks mais recentes)\n` : '') +
    (summary.errors > 0 ? `- ❌ ${summary.errors} erro(s) durante sincronização\n` : '') +
    (summary.hasInsights ? `- 📊 Insights do Auto Claude disponíveis\n` : '') +
    `\n### Nota\n` +
    `Esta sincronização foi executada automaticamente pelo auto-claude-conductor-sync.js.\n` +
    `Specs do Auto Claude foram convertidas em tracks do Conductor para documentação compartilhada.\n\n`;

  // Inserir após o header
  const headerEnd = changelog.indexOf('\n## ');
  if (headerEnd > 0) {
    changelog = changelog.slice(0, headerEnd) + newEntry + changelog.slice(headerEnd);
  } else {
    changelog += newEntry;
  }

  fs.writeFileSync(CONDUCTOR_CHANGELOG, changelog);
}

/**
 * Função principal de sincronização
 */
function main() {
  console.log('🔄 Iniciando sincronização Auto Claude → Conductor...\n');

  // 1. Sincronizar specs para tracks
  console.log('📋 Sincronizando specs para tracks...');
  const syncResults = syncSpecsToTracks();

  // 2. Ler insights
  console.log('\n📊 Lendo insights do Auto Claude...');
  const insights = getAutoClaudeInsights();
  if (insights.latestSession) {
    console.log(`  ✅ Última sessão: ${insights.latestSession.title || 'Sem título'}`);
  }

  // 3. Gerar resumo
  const summary = generateSyncSummary(syncResults, insights);

  // 4. Atualizar changelog se houver mudanças
  if (syncResults.synced > 0) {
    console.log('\n📝 Atualizando changelog...');
    appendSyncToChangelog(summary);
  }

  // 5. Resumo final
  console.log('\n✅ Sincronização concluída!');
  console.log(`   - ${syncResults.synced} spec(s) sincronizada(s)`);
  if (syncResults.skipped > 0) {
    console.log(`   - ${syncResults.skipped} spec(s) pulada(s) (tracks mais recentes)`);
  }
  if (syncResults.errors > 0) {
    console.log(`   - ${syncResults.errors} erro(s)`);
  }
  if (insights.latestSession) {
    console.log(`   - Insights disponíveis`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  syncSpecsToTracks,
  getAutoClaudeInsights,
  convertSpecToTrack,
  main
};
