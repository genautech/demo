const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const WATCH_PATHS = [
  path.join(__dirname, 'lib'),
  path.join(__dirname, 'conductor/tracks'),
  path.join(__dirname, '.auto-claude/specs')
];

console.log('👀 Iniciando Watcher do Conductor...');
console.log('Monitorando mudanças em:', WATCH_PATHS.join(', '));

let timeout;
function runSync() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    try {
      console.log(`\n🔄 Mudança detectada em ${new Date().toLocaleString()}. Sincronizando...`);
      execSync('./conductor.sh sync', { stdio: 'inherit' });
      console.log('✅ Sincronização concluída.');
    } catch (error) {
      console.error('❌ Erro durante a sincronização:', error.message);
    }
  }, 1000); // Debounce
}

WATCH_PATHS.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.watch(dir, { recursive: true }, (event, filename) => {
      if (filename && (filename.endsWith('.ts') || filename.endsWith('.tsx') || filename.endsWith('.json') || filename.endsWith('.md'))) {
        runSync();
      }
    });
  }
});
