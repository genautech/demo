# 🚀 Deploy em Produção - Yoobe Corporate Store

Este documento contém as informações do deploy em produção do sistema Yoobe Corporate Store.

## 📋 Status Atual

**Data do Deploy**: 03 de Janeiro de 2026

**Status**: ✅ **DEPLOYED** - Sistema em produção

## 🌐 URLs de Produção

| URL | Tipo | Status |
|-----|------|--------|
| **https://demo.yoobe.co** | Domínio Principal | ✅ Ativo |
| https://demo-delta-red-10.vercel.app | URL Vercel | ✅ Backup |

## 🎯 Objetivo

Sistema Yoobe Corporate Store em produção no Vercel, permitindo que diferentes pessoas acessem e testem o sistema de forma independente com dados isolados por navegador.

## 📚 Documentação Atualizada

### ✅ Documentos Revisados e Atualizados

1. **SITEMAP.md**
   - Todas as rotas do sistema documentadas (100+ rotas)
   - Organizadas por categoria e perfil de acesso
   - Inclui rotas de setup, dashboards, integrações, etc.

2. **conductor/DEPLOY.md**
   - Checklist completo de produção (10 categorias)
   - Configurações por plataforma (Vercel, Netlify, Docker)
   - Plano de migração Demo → Produção
   - Plano de rollback

3. **conductor/CHANGELOG.md**
   - Entrada de preparação para deploy adicionada
   - Status atual do projeto documentado
   - Próximos passos definidos

4. **DEPLOY_PRODUCTION.md** (este documento)
   - Guia completo de preparação
   - Checklist executável
   - Referências rápidas

## 🔍 Checklist Rápido de Início

### Antes de Começar
- [ ] Ler este documento completamente
- [ ] Revisar `conductor/DEPLOY.md` para detalhes completos
- [ ] Verificar `SITEMAP.md` para entender todas as rotas
- [ ] Confirmar acesso às plataformas de deploy (Vercel, Netlify, etc.)

### Primeiros Passos
1. **Revisar Configurações de Build**
   ```bash
   # Verificar next.config.mjs
   # Alterar ignoreBuildErrors: false (se necessário)
   # Configurar domínios de imagens
   ```

2. **Testar Build Local**
   ```bash
   npm run build
   # Verificar se build completa sem erros
   ```

3. **Validar Variáveis de Ambiente**
   ```bash
   # Verificar .env.example (se existir)
   # Listar todas as variáveis necessárias
   # Preparar valores para produção
   ```

## 📝 Checklist Detalhado

### 1. Configuração de Build ⚙️

#### next.config.mjs
- [ ] Revisar `ignoreBuildErrors` (considerar `false` para produção)
- [ ] Configurar `images.domains` se usar Next.js Image Optimization
- [ ] Verificar `transpilePackages` se necessário
- [ ] Testar build local: `npm run build`

#### package.json
- [ ] Verificar scripts de build
- [ ] Confirmar versão do Node.js (recomendado: 20.x)
- [ ] Verificar dependências críticas

### 2. Variáveis de Ambiente 🔐

#### Obrigatórias
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_APP_URL` (URL de produção)
- [ ] `NEXT_PUBLIC_API_URL` (se aplicável)

#### Opcionais (mas recomendadas)
- [ ] `GEMINI_API_KEY` (para Conductor)
- [ ] `GROK_API_KEY` (para features de IA)
- [ ] `SPREE_API_URL` (quando integrar Spree)
- [ ] `SPREE_API_TOKEN` (quando integrar Spree)

#### Configuração
- [ ] Criar `.env.production` (não commitar!)
- [ ] Configurar no painel da plataforma de deploy
- [ ] Validar todas as variáveis antes do deploy

### 3. Segurança 🔒

#### Configurações Básicas
- [ ] HTTPS/SSL habilitado
- [ ] CORS configurado corretamente
- [ ] Rate limiting em endpoints públicos
- [ ] Validação de inputs em todas as APIs

#### API Keys e Tokens
- [ ] Todas as keys rotacionadas
- [ ] Nenhuma key commitada no código
- [ ] Variáveis de ambiente seguras
- [ ] Rotação periódica configurada

#### Autenticação
- [ ] Sistema de autenticação real implementado
- [ ] Sessões configuradas corretamente
- [ ] Validação de roles funcionando
- [ ] Demo users removidos/desabilitados

### 4. Storage e Dados 💾

#### Migração de Mock Storage
- [ ] Backend API implementado
- [ ] Database configurado
- [ ] Migrations executadas
- [ ] Substituir chamadas `lib/storage.ts` por API calls

#### Backup e Recuperação
- [ ] Estratégia de backup configurada
- [ ] Teste de restauração realizado
- [ ] Backup automático configurado

### 5. Performance ⚡

#### Otimizações
- [ ] Image optimization configurado
- [ ] Code splitting verificado
- [ ] Caching implementado
- [ ] CDN configurado para assets estáticos
- [ ] Bundle size analisado e otimizado

#### Monitoramento
- [ ] Performance monitoring configurado
- [ ] Métricas de performance coletadas
- [ ] Alertas configurados

### 6. Monitoramento e Logs 📊

#### Error Tracking
- [ ] Sentry ou similar configurado
- [ ] Alertas de erro configurados
- [ ] Dashboard de erros acessível

#### Analytics
- [ ] Google Analytics ou similar configurado
- [ ] Eventos customizados implementados
- [ ] Dashboard de analytics acessível

#### Logs
- [ ] Sistema de logs configurado
- [ ] Logs estruturados
- [ ] Retenção de logs configurada
- [ ] Endpoint `/api/health` testado

### 7. Testes 🧪

#### Testes Locais
- [ ] `npm run build` executado com sucesso
- [ ] `npm run lint` sem erros críticos
- [ ] TypeScript sem erros (se `ignoreBuildErrors: false`)
- [ ] Testes unitários passando (se existirem)

#### Testes de Funcionalidade
- [ ] Login funcionando
- [ ] Navegação por roles funcionando
- [ ] Catálogo carregando
- [ ] Checkout funcionando
- [ ] Gamificação funcionando
- [ ] Temas funcionando

### 8. Documentação 📖

#### Documentos Atualizados
- [ ] `README.md` atualizado
- [ ] `DEPLOY.md` revisado
- [ ] `CHANGELOG.md` atualizado
- [ ] `SITEMAP.md` completo
- [ ] Este documento revisado

#### Documentação de API
- [ ] Endpoints documentados
- [ ] Exemplos de uso fornecidos
- [ ] Autenticação documentada

### 9. Deploy 🚀

#### Pré-Deploy
- [ ] Backup completo realizado
- [ ] Tag de versão criada no git
- [ ] Release notes preparadas
- [ ] Equipe notificada

#### Durante Deploy
- [ ] Monitoramento ativo
- [ ] Health checks verificados
- [ ] Logs monitorados
- [ ] Rollback plan pronto

#### Pós-Deploy
- [ ] Aplicação acessível no domínio
- [ ] Todas as funcionalidades testadas
- [ ] Performance verificada
- [ ] Erros monitorados
- [ ] Usuários notificados (se necessário)

### 10. Rollback Plan 🔄

#### Preparação
- [ ] Backup completo antes do deploy
- [ ] Tag de versão anterior identificada
- [ ] Script de rollback preparado
- [ ] Procedimento de rollback documentado

#### Execução (se necessário)
- [ ] Identificar problema
- [ ] Decidir rollback
- [ ] Executar rollback
- [ ] Validar sistema após rollback
- [ ] Documentar problema e solução

## 🛠️ Comandos Úteis

### Build e Teste
```bash
# Build local
npm run build

# Testar build
npm run start

# Linter
npm run lint

# TypeScript check
npx tsc --noEmit
```

### Deploy
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Docker
docker build -t yoobe-app .
docker run -p 3000:3000 yoobe-app
```

### Verificação
```bash
# Health check
curl https://your-domain.com/api/health

# Verificar variáveis de ambiente
# (depende da plataforma)
```

## 📞 Referências Rápidas

### Documentos Importantes
- **Deploy Completo**: `conductor/DEPLOY.md`
- **Sitemap**: `SITEMAP.md`
- **Changelog**: `conductor/CHANGELOG.md`
- **Product Context**: `conductor/product.md`
- **Tech Stack**: `conductor/tech-stack.md`

### Configurações
- **Next.js Config**: `next.config.mjs`
- **Package**: `package.json`
- **TypeScript**: `tsconfig.json`

### Scripts
- **Conductor Sync**: `./conductor.sh sync`
- **Claude Sync**: `./claude.sh sync`

## ⚠️ Avisos Importantes

### Crítico
1. **NUNCA** commitar arquivos `.env` ou `.env.local`
2. **SEMPRE** testar build local antes de deploy
3. **SEMPRE** validar variáveis de ambiente
4. **SEMPRE** fazer backup antes de deploy

### Recomendado
1. Fazer deploy em staging primeiro
2. Testar todas as funcionalidades críticas
3. Monitorar logs durante e após deploy
4. Ter plano de rollback pronto

## 🎯 Próximos Passos

Após completar este checklist:

1. **Revisar Configurações**
   - Revisar `next.config.mjs`
   - Validar variáveis de ambiente
   - Testar build local

2. **Preparar Ambiente de Produção**
   - Configurar plataforma de deploy
   - Configurar variáveis de ambiente
   - Configurar domínio e SSL

3. **Executar Deploy**
   - Fazer deploy em staging primeiro
   - Testar em staging
   - Fazer deploy em produção

4. **Monitorar e Validar**
   - Monitorar logs
   - Testar funcionalidades
   - Validar performance
   - Coletar feedback

## 📝 Informações do Deploy

### Configuração Atual

| Item | Valor |
|------|-------|
| **Plataforma** | Vercel |
| **Team** | yoobe-devs-s-team |
| **Projeto** | demo |
| **Domínio** | demo.yoobe.co |
| **Região** | GRU1 (São Paulo) |
| **Node Version** | 24.x |
| **Framework** | Next.js 16 |

### Variáveis de Ambiente

| Variável | Valor |
|----------|-------|
| `NODE_ENV` | production |
| `NEXT_PUBLIC_APP_URL` | https://demo.yoobe.co |

### DNS

| Registro | Tipo | Valor | Gerenciado em |
|----------|------|-------|---------------|
| demo.yoobe.co | A | 76.76.21.21 | Google Cloud DNS |

**Projeto GCP**: institucional-480905
**Zona DNS**: yoobe-co-zone

### Personas de Acesso

| Persona | Rota Inicial | Usuário Demo |
|---------|--------------|--------------|
| Super Admin | /super-admin | Ana Oliveira |
| Gestor | /dashboard/manager | João Silva |
| Membro | /dashboard/member | Pedro Costa |

## 📝 Notas Finais

- Deploy realizado em 03/01/2026 01:15 UTC
- Sistema funcionando em modo demo (localStorage)
- Cada usuário/navegador tem dados isolados
- Ideal para demonstrações e testes

---

**Status**: ✅ **DEPLOYED**
**URL Principal**: https://demo.yoobe.co
**Última Atualização**: 03 de Janeiro de 2026
**Próxima Revisão**: Quando migrar para produção real
