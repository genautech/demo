# Production Deploy - Track

## Status: ✅ Deployed

**Data**: 03 de Janeiro de 2026
**Plataforma**: Vercel
**Modo**: Demo (localStorage + usuários seedados)

## 🌐 URLs de Produção

| URL | Status | Descrição |
|-----|--------|-----------|
| **https://demo.yoobe.co** | ✅ Principal | Domínio customizado |
| https://demo-delta-red-10.vercel.app | ✅ Backup | URL Vercel padrão |

## Objetivo

Deploy do Yoobe Corporate Store em produção no Vercel, permitindo que diferentes pessoas acessem e testem o sistema de forma independente.

## Arquitetura de Deploy

### Fluxo de Dados

```
Usuário A (Chrome)    → demo.yoobe.co → Vercel → App Next.js → localStorage A
Usuário B (Firefox)   → demo.yoobe.co → Vercel → App Next.js → localStorage B
Usuário C (Mobile)    → demo.yoobe.co → Vercel → App Next.js → localStorage C
```

Cada usuário/navegador mantém seus próprios dados isolados.

### Stack de Deploy

- **Plataforma**: Vercel (Team: yoobe-devs-s-team)
- **Framework**: Next.js 16
- **Storage**: localStorage (por navegador)
- **Auth**: Usuários demo seedados
- **Região**: GRU1 (São Paulo)
- **Domínio**: demo.yoobe.co (Cloud DNS via institucional-480905)

## Arquivos Criados/Modificados

### 1. vercel.json
- Configurações de build e deploy
- Headers de segurança (X-Frame-Options, X-Content-Type-Options)
- Região de deploy (gru1 - São Paulo)
- Redirects (/admin → /super-admin)

### 2. .env.example
- Documentação de variáveis de ambiente
- Instruções para configuração
- Notas sobre o modo demo

### 3. app/page.tsx
- Landing page completa com seleção de persona
- Cards para Super Admin, Gestor e Membro
- Explicação do modo demo
- Links para documentação

### 4. GUIA_USUARIO.md
- Instruções detalhadas para cada tipo de usuário
- Rotas principais por persona
- Fluxos típicos de uso
- FAQ

### 5. conductor/tracks/production-deploy/plan.md
- Este arquivo
- Documentação do deploy

## Configuração do Vercel

### Variáveis de Ambiente Configuradas

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `NODE_ENV` | `production` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://demo.yoobe.co` | Production |

### Build Settings

- Build Command: `NEXT_DISABLE_TURBOPACK=1 npm run build`
- Output Directory: `.next`
- Install Command: `pnpm install`
- Node Version: 24.x

### DNS Configurado

| Registro | Tipo | Valor | Projeto GCP |
|----------|------|-------|-------------|
| `demo.yoobe.co` | A | `76.76.21.21` | institucional-480905 |

Zona DNS: `yoobe-co-zone`

## Personas e Acesso

### Super Admin
- **Rota inicial**: `/super-admin`
- **Funcionalidades**: Empresas, catálogo base, usuários globais, conductor
- **Usuário demo**: Ana Oliveira (spree_user_4)

### Gestor
- **Rota inicial**: `/dashboard/manager`
- **Funcionalidades**: Catálogo, pedidos, usuários, presentes, orçamentos
- **Usuário demo**: João Silva (spree_user_1)

### Membro
- **Rota inicial**: `/dashboard/member`
- **Funcionalidades**: Loja, pedidos, gamificação, swag track
- **Usuário demo**: Pedro Costa (spree_user_3)

## Comandos de Deploy

```bash
# Instalar Vercel CLI (se necessário)
npm i -g vercel

# Login no Vercel
vercel login

# Deploy de preview
vercel

# Deploy de produção
vercel --prod

# Verificar health
curl https://demo.yoobe.co/api/health
```

## Checklist de Validação

### Pré-Deploy
- [x] vercel.json criado
- [x] .env.example documentado
- [x] Landing page melhorada
- [x] GUIA_USUARIO.md criado
- [x] Track do Conductor criado
- [x] Build testado localmente
- [x] Deploy executado

### Pós-Deploy
- [x] Aplicação acessível
- [x] Landing page funcionando
- [x] Login por persona funcionando
- [x] Navegação funcionando
- [x] Health check respondendo
- [x] Domínio customizado configurado (demo.yoobe.co)
- [x] DNS propagado
- [x] SSL ativo

## Limitações do Modo Demo

1. **Dados não sincronizam**: Cada dispositivo tem dados próprios
2. **Cache limpo = reset**: Limpar cache do navegador apaga dados
3. **Sem persistência real**: Ideal para demos e testes

## Histórico de Deploys

| Data | Versão | URL | Status |
|------|--------|-----|--------|
| 03/01/2026 | v1.0.0 | demo.yoobe.co | ✅ Ativo |

## Próximos Passos (Futuro)

Para produção real, considerar:
1. Substituir localStorage por Supabase/Firebase
2. Implementar autenticação real (NextAuth, Auth0)
3. Integrar com API Spree Commerce
4. Configurar analytics e monitoramento
5. Adicionar Sentry para error tracking
6. Configurar GEMINI_API_KEY e GROK_API_KEY

## Referências

- [DEPLOY_PRODUCTION.md](/DEPLOY_PRODUCTION.md) - Guia completo de deploy
- [conductor/DEPLOY.md](/conductor/DEPLOY.md) - Configurações detalhadas
- [GUIA_USUARIO.md](/GUIA_USUARIO.md) - Instruções para usuários
- [SITEMAP.md](/SITEMAP.md) - Mapa de rotas

## Acesso Rápido

🌐 **Produção**: https://demo.yoobe.co
📊 **Vercel Dashboard**: https://vercel.com/yoobe-devs-s-team/demo
🔧 **DNS**: Google Cloud DNS (projeto: institucional-480905)

---

*Deploy realizado em 03/01/2026 01:15 UTC*
*Documentado via Conductor*
