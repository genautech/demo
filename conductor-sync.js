const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

const STORAGE_PATH = path.join(__dirname, 'lib/storage.ts');
const PKG_PATH = path.join(__dirname, 'package.json');
const PRODUCT_MD = path.join(__dirname, 'conductor/product.md');
const TECH_STACK_MD = path.join(__dirname, 'conductor/tech-stack.md');
const NAVIGATION_PATH = path.join(__dirname, 'lib/navigation.ts');
const CHANGELOG_PATH = path.join(__dirname, 'conductor/CHANGELOG.md');
const README_MD = path.join(__dirname, 'conductor/README.md');
const DEPLOY_MD = path.join(__dirname, 'conductor/DEPLOY.md');
const WORKFLOW_MD = path.join(__dirname, 'conductor/workflow.md');
const AUTOMATION_MD = path.join(__dirname, 'conductor/AUTOMATION.md');

function extractStorageInfo() {
  const content = fs.readFileSync(STORAGE_PATH, 'utf8');
  
  // Extract Interfaces
  const interfaces = [...content.matchAll(/export interface (\w+)/g)].map(m => m[1]);
  
  // Extract key Functions
  const functions = [...content.matchAll(/export function (\w+)/g)].map(m => m[1]);
  
  // Look for specific business modules
  const hasInventory = functions.includes('replicateProduct');
  const hasGifts = functions.includes('scheduleGiftOrder');
  const hasLogs = functions.includes('createReplicationLog');
  const hasGamification = content.includes('LEVEL_CONFIG');

  return { interfaces, functions, hasInventory, hasGifts, hasLogs, hasGamification };
}

function extractNavigationInfo() {
  const content = fs.readFileSync(NAVIGATION_PATH, 'utf8');
  
  // Extract navigation items by role
  const managerItems = [...content.matchAll(/roles: \["manager"\]/g)].length;
  const memberItems = [...content.matchAll(/roles: \["member"\]/g)].length;
  const superAdminItems = [...content.matchAll(/roles: \["superAdmin"\]/g)].length;
  
  // Check for send-gifts in navigation
  const hasSendGiftsForManager = content.includes('"Enviar Presentes"') && content.includes('roles: ["manager"]');
  const hasSendGiftsForMember = content.includes('"Enviar Presentes"') && content.includes('roles: ["member"]');
  
  return {
    managerItems,
    memberItems,
    superAdminItems,
    hasSendGiftsForManager,
    hasSendGiftsForMember
  };
}

function extractPkgInfo() {
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  return {
    nextVersion: pkg.dependencies.next,
    reactVersion: pkg.dependencies.react,
    hasTailwind: !!pkg.devDependencies.tailwindcss || !!pkg.dependencies.tailwindcss
  };
}

function checkLayoutCompliance() {
  const gestorPages = [];
  const issues = [];
  
  // Find all gestor pages
  const gestorDir = path.join(__dirname, 'app/gestor');
  if (fs.existsSync(gestorDir)) {
    const files = getAllFiles(gestorDir, ['.tsx', '.ts']);
    files.forEach(file => {
      if (file.endsWith('page.tsx')) {
        const content = fs.readFileSync(file, 'utf8');
        const usesAppShell = content.includes('from "@/components/app-shell"') || content.includes('from \'@/components/app-shell\'');
        const usesPageContainer = content.includes('from "@/components/page-container"') || content.includes('from \'@/components/page-container\'');
        
        if (usesAppShell && !usesPageContainer) {
          issues.push({
            file: path.relative(__dirname, file),
            issue: 'Usa AppShell diretamente (deve usar PageContainer)'
          });
        }
        
        gestorPages.push({
          file: path.relative(__dirname, file),
          usesAppShell,
          usesPageContainer
        });
      }
    });
  }
  
  return { gestorPages, issues };
}

function getAllFiles(dir, extensions) {
  let results = [];
  
  try {
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllFiles(filePath, extensions));
      } else if (extensions.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    });
  } catch (err) {
    // Ignore errors (permissions, etc.)
  }
  
  return results;
}

function updateProductDocs(info, navInfo) {
  let content = fs.readFileSync(PRODUCT_MD, 'utf8');
  
  const features = [
    '- **Dashboard**: Real-time overview of store performance and gamification.',
    info.hasInventory ? '- **Inventory & Swag Track**: Managed stock with replication logic.' : '',
    info.hasGifts ? '- **Send Gifts**: Scheduled shipment system for team members (Gestor/Admin only).' : '',
    info.hasLogs ? '- **Auditing**: Comprehensive Replication Logs for tracking changes.' : '',
    info.hasGamification ? '- **Gamification (BRENTS)**: Multi-level loyalty system.' : '',
    '- **CSV Export**: Data reporting for orders and budgets.'
  ].filter(Boolean).join('\n');

  const newContent = content.replace(/## Core Features[\s\S]*?(?=\n\n|$)/, `## Core Features\n${features}`);
  
  // Update navigation section if needed
  if (navInfo.hasSendGiftsForManager && !navInfo.hasSendGiftsForMember) {
    const navSection = `## Navigation & Layout
- **Sidebar Navigation**: Unified lateral sidebar menu across all roles (Super Admin, Manager, Member).
  - Collapsible sidebar with icon-only mode for space efficiency.
  - Role-based navigation items filtered by user permissions.
  - Gamification section integrated into sidebar with user stats and achievements.
- **Layout Standard**: All pages must use \`PageContainer\` component for consistent centering and responsive padding.
  - Default max-width: \`7xl\` (1280px).
  - Responsive padding: \`px-4 sm:px-6 lg:px-8 py-4 sm:py-6\`.
  - Content automatically centered with \`mx-auto\`.
- **Send Gifts Access**: Available only for Manager and Super Admin roles (not for Members).
  - Route: \`/gestor/send-gifts\`
  - Includes WOW experience with full tracking timeline and dispatch information.`;
    
    if (!content.includes('Send Gifts Access')) {
      const navMatch = content.match(/## Navigation & Layout[\s\S]*?(?=\n##|$)/);
      if (navMatch) {
        content = content.replace(navMatch[0], navSection);
      }
    }
  }
  
  fs.writeFileSync(PRODUCT_MD, content);
}

function updateTechDocs(info, pkg) {
  let content = fs.readFileSync(TECH_STACK_MD, 'utf8');
  
  const stateData = [
    '- **Framework**: Next.js ' + pkg.nextVersion,
    '- **Language**: TypeScript (Strict Mode)',
    '- **Storage**: Mock storage em `lib/storage.ts` with ' + info.functions.length + ' functions and ' + info.interfaces.length + ' types.',
    info.hasLogs ? '- **Auditing**: Internal logging system for transactions.' : '',
    '- **Export**: Client-side CSV generation.'
  ].join('\n');

  const newContent = content.replace(/## State & Data[\s\S]*?(?=\n\n|$)/, `## State & Data\n${stateData}`);
  fs.writeFileSync(TECH_STACK_MD, newContent);
}

function updateGeneralDocs() {
  const files = [README_MD, DEPLOY_MD, WORKFLOW_MD, AUTOMATION_MD];
  const now = new Date().toLocaleString('pt-BR');
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      const footer = `\n\n---\n*Atualizado em ${now} via Conductor Real-time Tracking*`;
      
      // Se já tem o footer, substitui
      if (content.includes('via Conductor Real-time Tracking')) {
        content = content.replace(/\n\n---\n\*Atualizado em .* via Conductor Real-time Tracking\*/, footer);
      } else {
        content += footer;
      }
      
      fs.writeFileSync(file, content);
    }
  });
}

function getGitDiff() {
  try {
    // Get staged changes
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8', cwd: __dirname, stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    // Get unstaged changes
    const unstaged = execSync('git diff --name-only', { encoding: 'utf8', cwd: __dirname, stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    
    const allFiles = [...new Set([...staged.split('\n'), ...unstaged.split('\n')].filter(Boolean))];
    
    if (allFiles.length === 0) {
      // Try to get last commit diff
      try {
        const lastCommit = execSync('git log -1 --name-only --pretty=format:', { encoding: 'utf8', cwd: __dirname, stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        return lastCommit.split('\n').filter(Boolean);
      } catch {
        return [];
      }
    }
    
    return allFiles;
  } catch (err) {
    // Git not available or not a git repo
    return [];
  }
}

function getGitDiffContent(files) {
  if (files.length === 0) return '';
  
  try {
    const diffs = files
      .filter(file => file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js'))
      .slice(0, 10) // Limit to 10 files to avoid token limits
      .map(file => {
        try {
          const diff = execSync(`git diff HEAD -- "${file}"`, { encoding: 'utf8', cwd: __dirname, stdio: ['pipe', 'pipe', 'ignore'], maxBuffer: 1024 * 1024 }).trim();
          return diff ? `File: ${file}\n${diff.substring(0, 2000)}` : null; // Limit diff size
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .join('\n\n---\n\n');
    
    return diffs;
  } catch {
    return '';
  }
}

function generateGeminiSummary(changedFiles, diffContent) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  GEMINI_API_KEY não encontrada. Usando resumo básico.');
    return Promise.resolve(null);
  }
  
  if (changedFiles.length === 0) {
    return Promise.resolve(null);
  }
  
  const prompt = `Analise as mudanças no código abaixo e gere um resumo estruturado em português brasileiro para o CHANGELOG.md do projeto Yoobe Corporate Store.

Arquivos modificados:
${changedFiles.slice(0, 20).map(f => `- ${f}`).join('\n')}

${diffContent ? `Diffs (primeiros 5000 caracteres):\n${diffContent.substring(0, 5000)}` : 'Sem diffs disponíveis'}

Gere um resumo seguindo este formato:
- Título: Data - [Tipo de mudança: Feature/Fix/Refactor/Chore]
- Problema Identificado (se aplicável)
- Solução Implementada (com subitens numerados)
- Arquivos Modificados (lista)
- Regras Estabelecidas (se houver novas regras)

Seja conciso mas informativo. Foque nas mudanças mais importantes.`;

  return new Promise((resolve) => {
    try {
      const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`);
      
      const postData = JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      });

      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode !== 200) {
              throw new Error(`Gemini API error: ${res.statusCode}`);
            }

            const response = JSON.parse(data);
            const summary = response.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (summary) {
              resolve(summary.trim());
            } else {
              resolve(null);
            }
          } catch (error) {
            console.log(`⚠️  Erro ao processar resposta da Gemini API: ${error.message}`);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        console.log(`⚠️  Erro ao chamar Gemini API: ${error.message}`);
        resolve(null);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        console.log('⚠️  Timeout ao chamar Gemini API');
        resolve(null);
      });

      req.write(postData);
      req.end();
    } catch (error) {
      console.log(`⚠️  Erro ao preparar requisição Gemini API: ${error.message}`);
      resolve(null);
    }
  });
}

async function generateSpecSummary() {
  const today = new Date().toISOString().split('T')[0];
  const changedFiles = getGitDiff();
  
  if (changedFiles.length === 0) {
    return null;
  }
  
  const relevantFiles = changedFiles.filter(file => 
    file.endsWith('.tsx') || 
    file.endsWith('.ts') || 
    file.endsWith('.js') || 
    file.endsWith('.md') ||
    file.includes('conductor/')
  );
  
  if (relevantFiles.length === 0) {
    return null;
  }
  
  const diffContent = getGitDiffContent(relevantFiles);
  const geminiSummary = await generateGeminiSummary(relevantFiles, diffContent);
  
  return {
    date: today,
    changedFiles: relevantFiles,
    summary: geminiSummary || `Auto-generated summary for ${today}`,
    hasGeminiSummary: !!geminiSummary
  };
}

function appendToChangelog(summary) {
  if (!summary) return;
  
  let changelog = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  } else {
    changelog = '# Changelog - Especificações e Correções\n\nEste arquivo documenta todas as mudanças, correções e melhorias implementadas no projeto.\n\n';
  }
  
  // Check if entry for today already exists
  const todayPattern = new RegExp(`## ${summary.date.replace(/-/g, '[- ]')}`);
  if (todayPattern.test(changelog)) {
    console.log('⚠️  Entrada para hoje já existe no changelog. Pulando...');
    return; // Don't duplicate entries
  }
  
  let newEntry;
  if (summary.hasGeminiSummary && summary.summary.includes('##')) {
    // Gemini returned a formatted entry
    newEntry = `\n${summary.summary}\n\n### Arquivos Modificados\n${summary.changedFiles.map(f => `- \`${f}\``).join('\n')}\n\n### Nota\nEsta entrada foi gerada automaticamente pelo conductor-sync.js com análise da Gemini API.\n`;
  } else {
    // Fallback to basic entry
    newEntry = `\n## ${summary.date} - Auto-sync\n\n${summary.hasGeminiSummary ? summary.summary + '\n\n' : ''}### Arquivos Modificados\n${summary.changedFiles.map(f => `- \`${f}\``).join('\n')}\n\n### Nota\nEsta entrada foi gerada automaticamente pelo conductor-sync.js${summary.hasGeminiSummary ? ' com análise da Gemini API' : ''}. Para documentação completa, consulte os arquivos de track específicos.\n`;
  }
  
  // Insert after the header
  const headerEnd = changelog.indexOf('\n## ');
  if (headerEnd > 0) {
    changelog = changelog.slice(0, headerEnd) + newEntry + changelog.slice(headerEnd);
  } else {
    changelog += newEntry;
  }
  
  fs.writeFileSync(CHANGELOG_PATH, changelog);
}

console.log('🔍 Analisando codebase para sincronização...');
const storageInfo = extractStorageInfo();
const pkgInfo = extractPkgInfo();
const navInfo = extractNavigationInfo();
const layoutCheck = checkLayoutCompliance();

console.log('📝 Atualizando documentação do Conductor...');
updateProductDocs(storageInfo, navInfo);
updateTechDocs(storageInfo, pkgInfo);
updateGeneralDocs();

// Check for layout issues
if (layoutCheck.issues.length > 0) {
  console.log('\n⚠️  Problemas de layout detectados:');
  layoutCheck.issues.forEach(issue => {
    console.log(`  - ${issue.file}: ${issue.issue}`);
  });
  console.log('\n💡 Dica: Use PageContainer em vez de AppShell nas páginas do gestor.\n');
}

// Generate and append changelog entry
(async () => {
  try {
    const specSummary = await generateSpecSummary();
    if (specSummary) {
      console.log('📋 Gerando entrada no changelog...');
      if (specSummary.hasGeminiSummary) {
        console.log('✨ Usando resumo inteligente da Gemini API');
      }
      appendToChangelog(specSummary);
    } else {
      console.log('ℹ️  Nenhuma mudança relevante detectada para o changelog');
    }
  } catch (error) {
    console.error('❌ Erro ao gerar resumo:', error.message);
    // Não falhar o processo se houver erro no resumo
  }
  
  console.log('✅ Documentação sincronizada com o código com sucesso!');
  console.log(`   - ${storageInfo.functions.length} funções detectadas`);
  console.log(`   - ${storageInfo.interfaces.length} interfaces detectadas`);
  console.log(`   - ${navInfo.managerItems} itens de navegação para Manager`);
  console.log(`   - ${navInfo.memberItems} itens de navegação para Member`);
})();

// Moved to async block above
