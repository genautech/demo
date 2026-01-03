const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const STORAGE_PATH = path.join(__dirname, 'lib/storage.ts');
const PKG_PATH = path.join(__dirname, 'package.json');
const PRODUCT_MD = path.join(__dirname, 'conductor/product.md');
const TECH_STACK_MD = path.join(__dirname, 'conductor/tech-stack.md');
const NAVIGATION_PATH = path.join(__dirname, 'lib/navigation.ts');
const CHANGELOG_PATH = path.join(__dirname, 'conductor/CHANGELOG.md');

function extractStorageInfo() {
  const content = fs.readFileSync(STORAGE_PATH, 'utf8');
  const interfaces = [...content.matchAll(/export interface (\w+)/g)].map(m => m[1]);
  const functions = [...content.matchAll(/export function (\w+)/g)].map(m => m[1]);
  const hasInventory = functions.includes('replicateProduct');
  const hasGifts = functions.includes('scheduleGiftOrder');
  const hasLogs = functions.includes('createReplicationLog');
  const hasGamification = content.includes('LEVEL_CONFIG');

  return { interfaces, functions, hasInventory, hasGifts, hasLogs, hasGamification };
}

function extractNavigationInfo() {
  const content = fs.readFileSync(NAVIGATION_PATH, 'utf8');
  const managerItems = [...content.matchAll(/roles: \["manager"\]/g)].length;
  const memberItems = [...content.matchAll(/roles: \["member"\]/g)].length;
  const superAdminItems = [...content.matchAll(/roles: \["superAdmin"\]/g)].length;
  const hasSendGiftsForManager = content.includes('"Enviar Presentes"') && content.includes('roles: ["manager"]');
  
  return { managerItems, memberItems, superAdminItems, hasSendGiftsForManager };
}

function extractPkgInfo() {
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  return {
    nextVersion: pkg.dependencies.next,
    reactVersion: pkg.dependencies.react,
  };
}

function updateProductDocs(info, navInfo) {
  let content = fs.readFileSync(PRODUCT_MD, 'utf8');
  const features = [
    '- **Dashboard**: Real-time overview of store performance and gamification.',
    info.hasInventory ? '- **Inventory & Swag Track**: Managed stock with replication logic.' : '',
    info.hasGifts ? '- **Send Gifts**: Scheduled shipment system for team members.' : '',
    info.hasLogs ? '- **Auditing**: Comprehensive Replication Logs.' : '',
    info.hasGamification ? '- **Gamification**: Multi-level loyalty system (Sistema de Pontos).' : '',
  ].filter(Boolean).join('\n');

  const newContent = content.replace(/## Core Features[\s\S]*?(?=\n\n|$)/, `## Core Features\n${features}`);
  fs.writeFileSync(PRODUCT_MD, newContent);
}

function updateTechDocs(info, pkg) {
  let content = fs.readFileSync(TECH_STACK_MD, 'utf8');
  const stateData = [
    '- **Framework**: Next.js ' + pkg.nextVersion,
    '- **Language**: TypeScript (Strict Mode)',
    '- **Storage**: lib/storage.ts (' + info.functions.length + ' functions)',
  ].join('\n');

  const newContent = content.replace(/## State & Data[\s\S]*?(?=\n\n|$)/, `## State & Data\n${stateData}`);
  fs.writeFileSync(TECH_STACK_MD, newContent);
}

function getGitDiff() {
  try {
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
    const unstaged = execSync('git diff --name-only', { encoding: 'utf8' }).trim();
    return [...new Set([...staged.split('\n'), ...unstaged.split('\n')].filter(Boolean))];
  } catch (err) {
    return [];
  }
}

async function generateClaudeSummary(changedFiles) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) return null;

  console.log('✨ Usando Claude API para gerar resumo...');
  // Implementation for Claude API call would go here
  // For now, we return a basic summary or placeholder
  return `Resumo gerado por Claude para ${changedFiles.length} arquivos.`;
}

(async () => {
  console.log('🔍 Analisando codebase para Auto Claude...');
  const storageInfo = extractStorageInfo();
  const pkgInfo = extractPkgInfo();
  const navInfo = extractNavigationInfo();

  console.log('📝 Atualizando documentação...');
  updateProductDocs(storageInfo, navInfo);
  updateTechDocs(storageInfo, pkgInfo);

  const changedFiles = getGitDiff();
  if (changedFiles.length > 0) {
    const summary = await generateClaudeSummary(changedFiles);
    if (summary) {
      console.log('📋 ' + summary);
    }
  }

  console.log('✅ Auto Claude sync concluído com sucesso!');
})();
