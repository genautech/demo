# Deploy Configuration & Access Keys

Este documento centraliza todas as informações necessárias para deploy, configuração de ambiente e acesso a serviços externos.

## 📋 Índice
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Configurações de Build](#configurações-de-build)
- [URLs e Endpoints](#urls-e-endpoints)
- [Acessos e Credenciais](#acessos-e-credenciais)
- [Comandos de Deploy](#comandos-de-deploy)
- [Checklist de Deploy](#checklist-de-deploy)

## 🔐 Variáveis de Ambiente

### Variáveis Necessárias

#### Next.js
```bash
# Node Environment
NODE_ENV=production

# Next.js Config
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

#### Storage (LocalStorage Keys)
O projeto usa localStorage para mock storage. As seguintes keys são utilizadas:

```javascript
// Autenticação
yoobe_auth                    // Dados de autenticação do usuário
yoobe_user_theme_preference   // Preferência de tema do usuário
yoobe-theme                   // Tema atual (light/dark/fun)

// Produtos
yoobe_base_products_v3        // Catálogo mestre (BaseProducts)
yoobe_company_products_v3     // Produtos da empresa (CompanyProducts)
prio_products_v2              // Produtos V2 (legacy)

// Orçamentos
yoobe_budgets_v3             // Orçamentos da empresa

// Pedidos
yoobe_orders_v3              // Pedidos da empresa

// Replicação
yoobe_replication_logs_v3    // Logs de replicação

// Usuários
yoobe_users_v3              // Usuários do sistema

// Presentes
yoobe_gifts_v3               // Envios de presentes
```

### Variáveis Opcionais (Futuras Integrações)

```bash
# API Externa (Spree Commerce - quando integrar)
SPREE_API_URL=https://spree-api.example.com
SPREE_API_TOKEN=your_spree_api_token
SPREE_STORE_ID=1

# Gemini CLI (Desenvolvimento/Conductor)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_HOME=./.gemini

# Cursor API (Cloud Agents)
CURSOR_API_KEY=your_cursor_api_key

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_STORE_URL=https://loja.exemplo.com

# Monitoring
SENTRY_DSN=your_sentry_dsn

# Admin
ADMIN_EMAIL=admin@exemplo.com
```

### Configuração do Gemini CLI (Conductor)
O projeto usa Google Gemini CLI para automação do Conductor. A chave deve estar em:
- Arquivo `.env` na raiz do projeto: `GEMINI_API_KEY=your_key`
- Ou variável de ambiente: `export GEMINI_API_KEY=your_key`

**Como obter a chave:**
1. Acessar: https://aistudio.google.com/apikey
2. Criar nova API key
3. Adicionar ao `.env` ou exportar como variável de ambiente

## ⚙️ Configurações de Build

### Next.js Config (`next.config.mjs`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ⚠️ Ajustar em produção
  },
  images: {
    unoptimized: true,        // Para deploy estático
  },
}

export default nextConfig
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",           // Desenvolvimento local
    "build": "next build",       // Build de produção
    "start": "next start",       // Servidor de produção
    "lint": "eslint ."           // Linter
  }
}
```

## 🌐 URLs e Endpoints

### Rotas Principais da Aplicação

#### Autenticação
- `/login` - Página de login
- `/onboarding` - Onboarding de novos usuários

#### Dashboard
- `/dashboard` - Dashboard principal (redireciona por role)
- `/dashboard/manager` - Dashboard do gestor
- `/dashboard/member` - Dashboard do membro

#### Gestor (Manager/SuperAdmin)
- `/gestor/catalog` - Catálogo da empresa
- `/gestor/catalog/import` - Importação do catálogo mestre
- `/gestor/catalog/[id]` - Detalhes do produto
- `/gestor/catalog/replication-logs` - Logs de replicação
- `/gestor/budgets` - Orçamentos
- `/gestor/orders` - Pedidos
- `/gestor/usuarios` - Usuários
- `/gestor/estoque` - Estoque
- `/gestor/swag-track` - Rastreamento de pedidos
- `/gestor/send-gifts` - Enviar presentes
- `/gestor/wallet` - Wallet & Ledger
- `/gestor/integrations` - Integrações
- `/gestor/settings` - Configurações

#### Membro (Member)
- `/loja` - Loja de produtos
- `/loja/produto/[id]` - Detalhes do produto
- `/loja/checkout` - Checkout
- `/loja/pedido/[id]` - Detalhes do pedido
- `/membro/pedidos` - Meus pedidos
- `/membro/gamificacao` - Hub de gamificação
- `/membro/swag-track` - Rastreamento de pedidos
- `/membro/enderecos` - Endereços
- `/membro/preferencias` - Preferências

#### Super Admin
- `/super-admin` - Dashboard super admin
- `/super-admin/companies` - Empresas
- `/super-admin/users` - Usuários globais
- `/sitemap` - Sitemap do sistema

### API Routes (Next.js)

#### Orçamentos
- `POST /api/budgets` - Criar orçamento
- `GET /api/budgets` - Listar orçamentos

#### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/base-products` - Listar produtos base
- `GET /api/companies` - Listar empresas
- `GET /api/stores` - Listar lojas

#### Replicação
- `POST /api/replication` - Replicar produtos
  - Body: `{ budgetId: string }`
  - Retorna: `{ success: boolean, message: string, logId?: string }`

#### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos

#### Presentes
- `POST /api/gifts` - Criar envio de presente
- `GET /api/gifts` - Listar presentes

#### Tags
- `GET /api/tags` - Listar tags

## 🔑 Acessos e Credenciais

### API Keys e Tokens

#### Gemini API (Conductor)
- **Uso**: Automação do sistema Conductor
- **Onde configurar**: `.env` ou variável de ambiente `GEMINI_API_KEY`
- **Como obter**: https://aistudio.google.com/apikey
- **Arquivo de configuração**: `conductor.sh` lê do `.env`

#### Cursor API (Cloud Agents)
- **Uso**: Integração com Cursor Cloud Agents
- **Onde configurar**: `.env` ou variável de ambiente `CURSOR_API_KEY`
- **Como obter**: https://cursor.com/en-US/dashboard?tab=cloud-agents
- **Status**: Configurada para automação avançada

#### Spree Commerce API (Futuro)
- **Uso**: Integração com backend Spree Commerce
- **Variáveis necessárias**:
  - `SPREE_API_URL`: URL base da API (ex: `https://sua-loja.com/api/v2`)
  - `SPREE_API_TOKEN`: Token OAuth2 do Spree
  - `SPREE_STORE_ID`: ID da loja (geralmente `1`)
- **Arquivo de referência**: `lib/spree-api.ts`
- **Documentação**: 
  - Storefront API: https://api.spreecommerce.org/docs/api-v2/storefront
  - Platform API: https://api.spreecommerce.org/docs/api-v2/platform

### Usuários Demo (Seeded)

#### Super Admin
- **Role**: `superAdmin`
- **UserId**: `spree_user_4`
- **Nome**: Ana Oliveira
- **Email**: ana.oliveira@example.com

#### Manager (Gestor)
- **Role**: `manager`
- **UserId**: `spree_user_1`
- **Nome**: João Silva
- **Email**: joao.silva@example.com

#### Member (Membro)
- **Role**: `member`
- **UserId**: `spree_user_3`
- **Nome**: Pedro Costa
- **Email**: pedro.costa@example.com

### ⚠️ Importante
- **NUNCA usar**: `spree_user_demo` - este usuário não existe no storage
- **Sempre mapear**: Roles para usuários seedados existentes
- **Validação**: Páginas devem redirecionar para login se usuário não encontrado

### Company IDs (Demo)
- `company_1` - Empresa demo principal
- IDs são obtidos de `yoobe_auth.companyId`

### Storage Keys (LocalStorage)
Todas as keys do localStorage são prefixadas com `yoobe_`:

```javascript
// Autenticação
yoobe_auth                    // { userId, role, companyId, storeId, onboardingComplete }
yoobe_user_theme_preference   // "light" | "dark" | "fun"
yoobe-theme                   // Tema atual (gerenciado por next-themes)

// Produtos
yoobe_base_products_v3        // Array de BaseProduct
yoobe_company_products_v3     // Array de CompanyProduct
prio_products_v2              // Array de Product (legacy)

// Orçamentos
yoobe_budgets_v3             // Array de Budget

// Pedidos
yoobe_orders_v3              // Array de Order

// Replicação
yoobe_replication_logs_v3    // Array de ReplicationLog

// Usuários
yoobe_users_v3              // Array de User

// Presentes
yoobe_gifts_v3               // Array de Gift

// API Keys (por ambiente)
yoobe_api_keys_sandbox       // Array de ApiKeyDTO (sandbox)
yoobe_api_keys_production    // Array de ApiKeyDTO (production)
```

**Nota**: Em produção real, substituir localStorage por backend/API.

## 🚀 Comandos de Deploy

### Desenvolvimento Local
```bash
# Instalar dependências
npm install
# ou
pnpm install

# Rodar em desenvolvimento
npm run dev
# ou
pnpm dev

# Acessar: http://localhost:3000
```

### Build de Produção
```bash
# Build
npm run build
# ou
pnpm build

# Iniciar servidor de produção
npm run start
# ou
pnpm start
```

### Deploy Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy de produção
vercel --prod
```

### Variáveis de Ambiente no Vercel
1. Acessar: https://vercel.com/dashboard
2. Selecionar projeto
3. Settings → Environment Variables
4. Adicionar variáveis necessárias

### Deploy Netlify
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy de produção
netlify deploy --prod
```

### Deploy Docker
```dockerfile
# Dockerfile exemplo
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## ✅ Checklist de Deploy

### Pré-Deploy
- [ ] Variáveis de ambiente configuradas
- [ ] Build local testado (`npm run build`)
- [ ] Linter executado (`npm run lint`)
- [ ] TypeScript sem erros críticos
- [ ] Testes (se houver) passando
- [ ] `.env.example` atualizado (se aplicável)

### Configuração de Ambiente
- [ ] `NODE_ENV=production` definido
- [ ] URLs públicas configuradas (`NEXT_PUBLIC_*`)
- [ ] API keys configuradas (se aplicável)
- [ ] Domínio configurado
- [ ] SSL/HTTPS habilitado

### Pós-Deploy
- [ ] Aplicação acessível no domínio
- [ ] Login funcionando
- [ ] Navegação por roles funcionando
- [ ] Catálogo carregando
- [ ] Checkout funcionando
- [ ] Gamificação funcionando
- [ ] Temas (Light/Dark/Fun) funcionando

### Monitoramento
- [ ] Analytics configurado (se aplicável)
- [ ] Error tracking configurado (Sentry, etc.)
- [ ] Logs sendo coletados
- [ ] Performance monitorada

## 🔒 Segurança

### Boas Práticas
- **Nunca commitar** arquivos `.env` ou `.env.local`
- **Usar variáveis de ambiente** para todas as configurações sensíveis
- **Rotacionar keys** regularmente
- **Usar HTTPS** em produção
- **Validar inputs** em todas as APIs
- **Rate limiting** em endpoints públicos

### Arquivos a Ignorar (`.gitignore`)
```
.env
.env.local
.env.production
.env.development
*.log
.DS_Store
node_modules
.next
.vercel
.netlify
```

## 📝 Notas Importantes

### Storage Local
- O projeto usa **localStorage** para mock storage
- Em produção real, substituir por backend/API
- Keys do localStorage são prefixadas com `yoobe_`
- Ver seção "Storage Keys" acima para lista completa

### Build Configuration
- `ignoreBuildErrors: true` está ativo - **revisar em produção**
- `images.unoptimized: true` - ajustar se usar Next.js Image Optimization
- Para produção, considerar:
  ```javascript
  typescript: {
    ignoreBuildErrors: false,  // Habilitar verificação de tipos
  },
  images: {
    domains: ['your-image-domain.com'],  // Configurar domínios permitidos
  },
  ```

### Demo Mode
- Sistema usa usuários seedados para demo
- Em produção, implementar autenticação real
- Substituir mock storage por API real
- Usuários seedados definidos em `lib/storage.ts` → `initialUsers`

### Conductor (Gemini CLI)
- Requer `GEMINI_API_KEY` configurada
- Usado para automação de documentação
- Script: `./conductor.sh sync` para sincronizar documentação
- Configuração em `conductor.sh` e `.env`

## 🔗 Links Úteis

### Documentação
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Spree Commerce API](https://api.spreecommerce.org/docs)

### Ferramentas e Dashboards
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Netlify Dashboard](https://app.netlify.com/)
- [Google AI Studio (Gemini API)](https://aistudio.google.com/apikey)

### APIs e Integrações
- **Spree Commerce**:
  - Storefront API: https://api.spreecommerce.org/docs/api-v2/storefront
  - Platform API: https://api.spreecommerce.org/docs/api-v2/platform
- **Gemini API**: https://aistudio.google.com/apikey

## 📞 Suporte

Para questões de deploy ou configuração:
1. Verificar este documento primeiro
2. Consultar `conductor/workflow.md` para padrões
3. Verificar `conductor/CHANGELOG.md` para mudanças recentes


## 🚀 Preparação para Deploy em Produção

### Checklist Completo de Produção

#### 1. Configuração de Build
- [ ] **TypeScript**: Alterar `ignoreBuildErrors: false` em `next.config.mjs`
- [ ] **Images**: Configurar domínios permitidos se usar Next.js Image Optimization
- [ ] **Environment**: Verificar `NODE_ENV=production` em todas as variáveis
- [ ] **Build Test**: Executar `npm run build` localmente sem erros

#### 2. Variáveis de Ambiente Críticas
- [ ] `NODE_ENV=production` configurado
- [ ] `NEXT_PUBLIC_APP_URL` configurado com URL de produção
- [ ] `NEXT_PUBLIC_API_URL` configurado (se aplicável)
- [ ] `GEMINI_API_KEY` configurado (para Conductor)
- [ ] `GROK_API_KEY` configurado (para features de IA)
- [ ] Variáveis opcionais documentadas e configuradas conforme necessário

#### 3. Segurança
- [ ] **HTTPS**: SSL/HTTPS habilitado e configurado
- [ ] **API Keys**: Todas as keys rotacionadas e seguras
- [ ] **Environment Variables**: Nenhuma key commitada no código
- [ ] **CORS**: Configurado corretamente para domínios permitidos
- [ ] **Rate Limiting**: Implementado em endpoints públicos
- [ ] **Input Validation**: Validado em todas as APIs

#### 4. Storage e Dados
- [ ] **Backend API**: Substituir localStorage por API real (se aplicável)
- [ ] **Database**: Configurado e testado
- [ ] **Migrations**: Executadas e validadas
- [ ] **Backup**: Estratégia de backup configurada
- [ ] **Seed Data**: Dados iniciais preparados (se necessário)

#### 5. Autenticação
- [ ] **Auth System**: Sistema de autenticação real implementado
- [ ] **Session Management**: Configurado e testado
- [ ] **User Roles**: Validação de roles funcionando
- [ ] **Demo Users**: Removidos ou desabilitados (se aplicável)

#### 6. Performance
- [ ] **Image Optimization**: Configurado e testado
- [ ] **Code Splitting**: Verificado e otimizado
- [ ] **Caching**: Estratégia de cache implementada
- [ ] **CDN**: Configurado para assets estáticos
- [ ] **Bundle Size**: Analisado e otimizado

#### 7. Monitoramento
- [ ] **Error Tracking**: Sentry ou similar configurado
- [ ] **Analytics**: Google Analytics ou similar configurado
- [ ] **Logs**: Sistema de logs configurado
- [ ] **Health Checks**: Endpoint `/api/health` testado
- [ ] **Uptime Monitoring**: Configurado

#### 8. Testes
- [ ] **Build**: `npm run build` executado com sucesso
- [ ] **Linter**: `npm run lint` sem erros críticos
- [ ] **TypeScript**: Sem erros de tipo (se `ignoreBuildErrors: false`)
- [ ] **E2E Tests**: Testes end-to-end executados (se aplicável)
- [ ] **Smoke Tests**: Testes básicos de funcionalidade

#### 9. Documentação
- [ ] **README**: Atualizado com instruções de deploy
- [ ] **DEPLOY.md**: Este documento revisado e atualizado
- [ ] **CHANGELOG**: Entrada de preparação para produção adicionada
- [ ] **SITEMAP**: Todas as rotas documentadas
- [ ] **API Docs**: Documentação de APIs atualizada

#### 10. Pós-Deploy
- [ ] **Domain**: Aplicação acessível no domínio de produção
- [ ] **Login**: Sistema de login funcionando
- [ ] **Navigation**: Navegação por roles funcionando
- [ ] **Catalog**: Catálogo carregando corretamente
- [ ] **Checkout**: Fluxo de checkout funcionando
- [ ] **Gamification**: Sistema de gamificação funcionando
- [ ] **Themes**: Temas (Light/Dark/Fun) funcionando
- [ ] **APIs**: Todas as APIs respondendo corretamente

### Configurações Específicas por Plataforma

#### Vercel
```bash
# Build Command
npm run build

# Output Directory
.next

# Install Command
npm install

# Node Version
20.x (recomendado)
```

#### Netlify
```bash
# Build Command
npm run build

# Publish Directory
.next

# Node Version
20.x (recomendado)
```

#### Docker
- Verificar Dockerfile incluído no projeto
- Testar build local: `docker build -t yoobe-app .`
- Testar execução: `docker run -p 3000:3000 yoobe-app`

### Migração de Demo para Produção

#### Passos Críticos
1. **Substituir Mock Storage**: 
   - Implementar backend real
   - Substituir chamadas `lib/storage.ts` por API calls
   - Configurar database

2. **Autenticação Real**:
   - Implementar sistema de autenticação (Auth0, NextAuth, etc.)
   - Remover usuários demo seedados
   - Configurar sessões e tokens

3. **Integração Spree Commerce**:
   - Configurar `SPREE_API_URL`
   - Configurar `SPREE_API_TOKEN`
   - Testar endpoints da API

4. **Configurações de Ambiente**:
   - Revisar todas as variáveis de ambiente
   - Configurar URLs de produção
   - Configurar keys de APIs externas

### Rollback Plan
- [ ] **Backup**: Backup completo antes do deploy
- [ ] **Version Tag**: Tag de versão criada no git
- [ ] **Rollback Script**: Script de rollback preparado
- [ ] **Monitoring**: Monitoramento ativo durante deploy

### Notas Finais
- ⚠️ **CRÍTICO**: Revisar `next.config.mjs` antes do deploy
- ⚠️ **CRÍTICO**: Testar build local antes de fazer deploy
- ⚠️ **CRÍTICO**: Validar todas as variáveis de ambiente
- ✅ **RECOMENDADO**: Fazer deploy em staging primeiro
- ✅ **RECOMENDADO**: Testar todas as funcionalidades críticas

---
*Atualizado em 03/01/2026, 02:23:32 via Conductor Real-time Tracking*
*Preparação para Deploy em Produção - 03/01/2026*