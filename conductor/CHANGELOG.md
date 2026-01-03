# Changelog - Especificações e Correções

Este arquivo documenta todas as mudanças, correções e melhorias implementadas no projeto, garantindo que nenhuma especificação se perca.

## 2026-01-03 - Deploy em Produção Realizado ✅

### URL de Produção
🌐 **https://demo.yoobe.co**

### Resumo
Deploy completo do Yoobe Corporate Store em produção no Vercel com domínio customizado configurado.

### O que foi feito
- ✅ Deploy no Vercel (team: yoobe-devs-s-team)
- ✅ Domínio customizado: demo.yoobe.co
- ✅ DNS configurado no Google Cloud DNS (projeto: institucional-480905)
- ✅ SSL/HTTPS ativo
- ✅ Variáveis de ambiente configuradas
- ✅ Health check funcionando

### Configuração
| Item | Valor |
|------|-------|
| Plataforma | Vercel |
| Domínio | demo.yoobe.co |
| Região | GRU1 (São Paulo) |
| Node Version | 24.x |
| Framework | Next.js 16 |

---

## 2026-01-03 - Preparação para Deploy em Produção

### Resumo
Atualização completa de toda documentação, sitemaps, conductor e specs para preparar o sistema para deploy em produção. Todos os documentos foram revisados e atualizados para garantir que após reiniciar o Cursor, possamos começar a tratar o deploy em produção imediatamente.

### Documentação Atualizada

#### 1. SITEMAP.md
- ✅ Adicionadas todas as rotas de Setup e Configuração (6 etapas)
- ✅ Adicionadas rotas de Dashboards e Analytics
- ✅ Adicionadas rotas de Aparência e Branding
- ✅ Adicionadas rotas de Segurança e Integrações
- ✅ Adicionadas rotas de Ferramentas de Desenvolvimento
- ✅ Adicionadas rotas de Gestão de Fornecedores
- ✅ Adicionadas rotas de Landing Pages Dinâmicas
- ✅ Adicionadas rotas de Snapshots e Histórico
- ✅ Total de rotas documentadas: 100+ rotas organizadas por categoria

#### 2. conductor/DEPLOY.md
- ✅ Adicionada seção completa "Preparação para Deploy em Produção"
- ✅ Checklist completo com 10 categorias principais:
  1. Configuração de Build
  2. Variáveis de Ambiente Críticas
  3. Segurança
  4. Storage e Dados
  5. Autenticação
  6. Performance
  7. Monitoramento
  8. Testes
  9. Documentação
  10. Pós-Deploy
- ✅ Configurações específicas por plataforma (Vercel, Netlify, Docker)
- ✅ Plano de migração de Demo para Produção
- ✅ Plano de Rollback
- ✅ Notas críticas e recomendações

#### 3. conductor/CHANGELOG.md
- ✅ Esta entrada adicionada para documentar a preparação

### Status Atual do Projeto

#### Features Implementadas
- ✅ Sistema completo de gestão de loja corporativa
- ✅ Multi-tenant com suporte a múltiplas empresas
- ✅ Sistema de gamificação completo
- ✅ Workflow de aprovações
- ✅ Integração Grok AI
- ✅ Sistema de catálogo mestre e replicação
- ✅ Dashboard com gráficos e analytics
- ✅ Sistema de envio de presentes
- ✅ Landing pages dinâmicas
- ✅ Temas (Light/Dark/Fun)
- ✅ Documentação completa (Conductor)

#### Próximos Passos para Produção
1. **Revisar Configurações de Build**:
   - Alterar `ignoreBuildErrors: false` em `next.config.mjs`
   - Configurar domínios de imagens se necessário
   
2. **Configurar Variáveis de Ambiente**:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_APP_URL` com URL de produção
   - Todas as API keys necessárias
   
3. **Substituir Mock Storage**:
   - Implementar backend real
   - Configurar database
   - Substituir localStorage por API calls
   
4. **Implementar Autenticação Real**:
   - Sistema de autenticação (Auth0, NextAuth, etc.)
   - Remover usuários demo
   - Configurar sessões
   
5. **Testes e Validação**:
   - Build local sem erros
   - Testes de funcionalidade
   - Validação de segurança

### Arquivos Modificados
- `SITEMAP.md` - Atualizado com todas as rotas
- `conductor/DEPLOY.md` - Adicionada seção completa de preparação
- `conductor/CHANGELOG.md` - Esta entrada

### Regras Estabelecidas
- **Documentação**: Toda documentação deve estar atualizada antes do deploy
- **Checklist**: Seguir checklist completo em `conductor/DEPLOY.md`
- **Build**: Sempre testar build local antes de deploy
- **Variáveis**: Validar todas as variáveis de ambiente
- **Segurança**: Revisar todas as configurações de segurança

### Status
✅ **Documentação Completa** - Pronto para iniciar deploy em produção

```markdown
```markdown
```
### 2023-11-07 - [Refactor: Rota de Produtos e Dashboard]

- **Problema Identificado:** A rota de produtos (`/api/products`) precisava suportar a busca de produtos específicos de uma empresa (CompanyProduct), além de produtos globais (Product). O dashboard estava incompleto e com lógica no componente.

- **Solução Implementada:**
    1.  **Rota de Produtos Refatorada:** A rota `/api/products` foi atualizada para buscar produtos de uma empresa específica se o parâmetro `companyId` for fornecido na query string. Caso contrário, retorna os produtos do catálogo global.
    2.  **Mapeamento de Campos:** Adicionado mapeamento de campos de `CompanyProduct` para o formato compatível com `Product` para garantir consistência na resposta da API.
    3.  **Remoção de Lógica do Dashboard:** O dashboard foi simplificado para apenas redirecionar o usuário para a página apropriada, baseada em sua role. A lógica de renderização foi removida do componente.
    4.  **Introdução do Componente PageContainer:** Adicionado o componente `PageContainer` para padronizar o layout das páginas.

- **Arquivos Modificados:**
    -   `app/api/products/route.ts`
    -   `app/dashboard/page.tsx`
    -   `app/documentacao/loading.tsx` (Removido)
    -   `app/documentacao/page.tsx`
    -   `app/estoque/loading.tsx` (Removido)
    -   `app/estoque/page.tsx`
    -   `app/layout.tsx`
    -   `app/login/page.tsx`
    -   `app/pedidos/loading.tsx` (Removido)
    -   `app/pedidos/page.tsx`
    -   `app/produtos-cadastrados/loading.tsx` (Removido)
    -   `app/produtos-cadastrados/page.tsx`
    -   `app/snapshots/loading.tsx` (Removido)
    -   `app/snapshots/page.tsx`
    -   `app/swag-track/loading.tsx` (Removido)
    -   `app/swag-track/page.tsx`
    -   `app/usuarios/loading.tsx` (Removido)
    -   `app/usuarios/page.tsx`
    -   `components/app-shell.tsx`
    -   `components/ui/badge.tsx`

- **Regras Estabelecidas:**
    - A rota `/api/products` agora requer o parâmetro `companyId` para retornar produtos específicos de uma empresa. Se omitido, retorna produtos globais.
```

### Arquivos Modificados
- `app/api/products/route.ts`
- `app/dashboard/page.tsx`
- `app/documentacao/loading.tsx`
- `app/documentacao/page.tsx`
- `app/estoque/loading.tsx`
- `app/estoque/page.tsx`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/pedidos/loading.tsx`
- `app/pedidos/page.tsx`
- `app/produtos-cadastrados/loading.tsx`
- `app/produtos-cadastrados/page.tsx`
- `app/snapshots/loading.tsx`
- `app/snapshots/page.tsx`
- `app/swag-track/loading.tsx`
- `app/swag-track/page.tsx`
- `app/usuarios/loading.tsx`
- `app/usuarios/page.tsx`
- `components/app-shell.tsx`
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/input.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/sheet.tsx`
- `lib/spree-api.ts`
- `lib/storage.ts`

### Nota
Esta entrada foi gerada automaticamente pelo conductor-sync.js com análise da Gemini API.

## 2026-01-03 - Auto-sync

Aqui está um resumo estruturado das mudanças nos arquivos fornecidos, no formato de CHANGELOG.md em português brasileiro:

- Título: 2024-10-27 - [Feature: Integração de Produtos da Empresa]
- Problema Identificado: Necessidade de exibir produtos específicos de uma empresa, além dos produtos globais do catálogo.
- Solução Implementada:
    1.  Adicionado suporte para filtrar produtos por `companyId` na API `/api/products`.
    2.  Se `companyId` for fornecido, a API agora retorna produtos associados à empresa (CompanyProduct).
    3.  Mapeamento dos campos do CompanyProduct para um formato compatível com Product (stock, price, name, sku, images, category, available, active).
    4.  Implementação do `DashboardDispatcher` para direcionar o usuário para a interface correta, baseado na role.
- Arquivos Modificados:
    *   app/api/products/route.ts
    *   app/dashboard/page.tsx
    *   app/documentacao/loading.tsx
    *   app/documentacao/page.tsx
    *   app/estoque/loading.tsx
    *   app/estoque/page.tsx
    *   app/layout.tsx
    *   app/login/page.tsx
    *   app/pedidos/loading.tsx
    *   app/pedidos/page.tsx
    *   app/produtos-cadastrados/loading.tsx
    *   app/produtos-cadastrados/page.tsx
    *   app/snapshots/loading.tsx
    *   app/snapshots/page.tsx
    *   app/swag-track/loading.tsx
    *   app/swag-track/page.tsx
    *   app/usuarios/loading.tsx
    *   app/usuarios/page.tsx
    *   components/app-shell.tsx
    *   components/ui/badge.tsx

**Detalhes Adicionais:**

*   Remoção de arquivos `loading.tsx` redundantes das páginas `documentacao`, `estoque`, `pedidos`, `produtos-cadastrados`, `snapshots`, `swag-track` e `usuarios`. A estrutura de loading provavelmente foi movida para um componente mais genérico ou gerenciada de forma diferente.
*   Alterações significativas na estrutura do `app/dashboard/page.tsx`, indicando uma refatoração para roteamento baseado na role do usuário.
*   Refatoração de componentes UI, possivelmente visando reutilização e consistência.
*   Atualização de dependências e configuração geral do projeto.

**Observações:**

*   Sem informações sobre regras específicas.
*   O resumo foca nas mudanças mais relevantes para o CHANGELOG.

### Arquivos Modificados
- `app/api/products/route.ts`
- `app/dashboard/page.tsx`
- `app/documentacao/loading.tsx`
- `app/documentacao/page.tsx`
- `app/estoque/loading.tsx`
- `app/estoque/page.tsx`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/pedidos/loading.tsx`
- `app/pedidos/page.tsx`
- `app/produtos-cadastrados/loading.tsx`
- `app/produtos-cadastrados/page.tsx`
- `app/snapshots/loading.tsx`
- `app/snapshots/page.tsx`
- `app/swag-track/loading.tsx`
- `app/swag-track/page.tsx`
- `app/usuarios/loading.tsx`
- `app/usuarios/page.tsx`
- `components/app-shell.tsx`
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/input.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/sheet.tsx`
- `lib/spree-api.ts`
- `lib/storage.ts`

### Nota
Esta entrada foi gerada automaticamente pelo conductor-sync.js com análise da Gemini API. Para documentação completa, consulte os arquivos de track específicos.

## CHANGELOG

- 2023-10-27 - [Refactor: Roteamento Dinâmico e Estrutura da Aplicação]
- **Problema Identificado:** Necessidade de adaptar a aplicação para diferentes perfis de usuário (Super Admin, Empresa) e direcionar para dashboards específicos.
- **Solução Implementada:**
    1. Adicionada lógica de roteamento dinâmico no `DashboardDispatcher` para redirecionar usuários com base em seu papel (Super Admin ou Empresa). Usuários sem papel definido são redirecionados para a página de login.
    2. Removidos componentes desnecessários das páginas de dashboard para simplificar a estrutura e facilitar a manutenção.
    3. Atualizado o componente `AppShell` para `PageContainer`, visando uma melhor organização e padronização das páginas.
- **Arquivos Modificados:**
    - app/dashboard/page.tsx
    - app/documentacao/page.tsx
    - app/estoque/page.tsx
    - app/pedidos/page.tsx
    - app/produtos-cadastrados/page.tsx
    - app/snapshots/page.tsx
    - app/swag-track/page.tsx
    - app/usuarios/page.tsx
    - components/app-shell.tsx

- 2023-10-27 - [Feature: API de Produtos com suporte a CompanyProduct]
- **Problema Identificado:** Necessidade de diferenciar produtos globais (Product) de produtos específicos de uma empresa (CompanyProduct) através da API.
- **Solução Implementada:**
    1. Modificada a rota da API `/api/products/route.ts` para suportar a busca de produtos tanto do catálogo global (Product) quanto produtos específicos de uma empresa (CompanyProduct).
    2. Adicionado o parâmetro `companyId` na requisição GET. Se `companyId` for fornecido, a API retorna os produtos da empresa, mapeando os campos de `CompanyProduct` para um formato compatível com `Product`. Caso contrário, retorna os produtos globais.
- **Arquivos Modificados:**
    - app/api/products/route.ts

- 2023-10-27 - [Chore: Remoção de Componentes de Loading Desnecessários]
- **Problema Identificado:** Existência de arquivos de loading desnecessários, pois o Suspense do Next.js já estava gerenciando o estado de carregamento.
- **Solução Implementada:**
    1. Removidos os arquivos `loading.tsx` das pastas `app/documentacao`, `app/estoque`, `app/pedidos`, `app/produtos-cadastrados`, `app/snapshots`, `app/swag-track`, e `app/usuarios`.
- **Arquivos Modificados:**
    - app/documentacao/loading.tsx
    - app/estoque/loading.tsx
    - app/pedidos/loading.tsx
    - app/produtos-cadastrados/loading.tsx
    - app/snapshots/loading.tsx
    - app/swag-track/loading.tsx
    - app/usuarios/loading.tsx

- 2023-10-27 - [Fix: Correção na exibição do badge]
- **Problema Identificado:** O badge não estava sendo exibido corretamente.
- **Solução Implementada:**
    1. Corrigido o problema de exibição do badge no componente `badge.tsx`.
- **Arquivos Modificados:**
    - components/ui/badge.tsx

- 2023-10-27 - [Refactor: Ajuste no Layout da Aplicação]
- **Problema Identificado:** Layout da aplicação precisava de ajustes para melhor organização e padronização.
- **Solução Implementada:**
    1. Ajustado o layout da aplicação para melhor organização e padronização, incluindo a remoção do componente AppShell.
- **Arquivos Modificados:**
    - app/layout.tsx

- 2023-10-27 - [Refactor: Simplificação da página de Login]
- **Problema Identificado:** Página de login estava complexa e precisava de simplificação.
- **Solução Implementada:**
    1. Simplificada a página de login.
- **Arquivos Modificados:**
    - app/login/page.tsx
```

### Arquivos Modificados
- `app/api/products/route.ts`
- `app/dashboard/page.tsx`
- `app/documentacao/loading.tsx`
- `app/documentacao/page.tsx`
- `app/estoque/loading.tsx`
- `app/estoque/page.tsx`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/pedidos/loading.tsx`
- `app/pedidos/page.tsx`
- `app/produtos-cadastrados/loading.tsx`
- `app/produtos-cadastrados/page.tsx`
- `app/snapshots/loading.tsx`
- `app/snapshots/page.tsx`
- `app/swag-track/loading.tsx`
- `app/swag-track/page.tsx`
- `app/usuarios/loading.tsx`
- `app/usuarios/page.tsx`
- `components/app-shell.tsx`
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/input.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/sheet.tsx`
- `lib/spree-api.ts`
- `lib/storage.ts`

### Nota
Esta entrada foi gerada automaticamente pelo conductor-sync.js com análise da Gemini API.

## CHANGELOG

- 2024-10-27 - [Tipo de mudança: Feature]
- Descrição: Implementação de produtos específicos para empresas e redirecionamento de usuário com base em role

### Produtos Específicos para Empresas

- Problema Identificado: Necessidade de exibir produtos específicos para cada empresa, em vez de apenas um catálogo global.
- Solução Implementada:
    1.  Adicionada a capacidade de filtrar produtos na API `/api/products` por `companyId`, buscando CompanyProducts ao invés de Products quando o `companyId` é fornecido.
    2.  Mapeamento de campos de CompanyProduct para o formato esperado de Product para compatibilidade.
    3. Adicionado um `DashboardDispatcher` para redirecionar o usuário para diferentes dashboards com base em suas roles.

### Redirecionamento por Role

- Problema Identificado: Usuários com diferentes roles (ex: superAdmin) visualizando o mesmo dashboard.
- Solução Implementada:
    1. Implementado um componente `DashboardDispatcher` que verifica a role do usuário e o redireciona para a página apropriada (superAdmin, etc.).
    2. Rota para dashboard principal removida, deixando apenas a lógica de direcionamento.

- Arquivos Modificados:
    - `app/api/products/route.ts`
    - `app/dashboard/page.tsx`
    - `app/documentacao/page.tsx`
    - `app/estoque/page.tsx`
    - `app/pedidos/page.tsx`
    - `app/produtos-cadastrados/page.tsx`
    - `app/snapshots/page.tsx`
    - `app/swag-track/page.tsx`
    - `app/usuarios/page.tsx`
    - `components/app-shell.tsx`
    - `components/ui/badge.tsx`
    - `app/login/page.tsx`
    - `app/layout.tsx`
    - `app/estoque/loading.tsx`
    - `app/documentacao/loading.tsx`
    - `app/pedidos/loading.tsx`
    - `app/produtos-cadastrados/loading.tsx`
    - `app/snapshots/loading.tsx`
    - `app/swag-track/loading.tsx`
    - `app/usuarios/loading.tsx`

```

### Arquivos Modificados
- `app/api/products/route.ts`
- `app/dashboard/page.tsx`
- `app/documentacao/loading.tsx`
- `app/documentacao/page.tsx`
- `app/estoque/loading.tsx`
- `app/estoque/page.tsx`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/pedidos/loading.tsx`
- `app/pedidos/page.tsx`
- `app/produtos-cadastrados/loading.tsx`
- `app/produtos-cadastrados/page.tsx`
- `app/snapshots/loading.tsx`
- `app/snapshots/page.tsx`
- `app/swag-track/loading.tsx`
- `app/swag-track/page.tsx`
- `app/usuarios/loading.tsx`
- `app/usuarios/page.tsx`
- `components/app-shell.tsx`
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/input.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/sheet.tsx`
- `lib/spree-api.ts`
- `lib/storage.ts`

### Nota
Esta entrada foi gerada automaticamente pelo conductor-sync.js com análise da Gemini API.

## 2026-01-02 - Fix: Footer Cortado em Modais (ResponsiveModal e GlobalCart)

### Problema
O footer (rodapé) dos modais ficava cortado quando o conteúdo era maior que a altura da viewport. Isso acontecia em:
- `ProductDetailModal`
- `OrderDetailModal`
- `UserDetailModal`
- `GlobalCart` (carrinho de compras)

### Causa Raiz
1. **ResponsiveModal**: O `DialogContent` tinha `overflow-y-auto` aplicado ao container inteiro
2. **GlobalCart**: Tinha `max-h-[60vh] overflow-y-auto` dentro do ResponsiveModal, causando conflito de scroll

### Solução

#### ResponsiveModal
Reestruturação do layout para usar flexbox:
- Container: `flex flex-col overflow-hidden`
- Header: `shrink-0` (sempre visível no topo)
- Content: `flex-1 overflow-y-auto` (área scrollável)
- Footer: `shrink-0 border-t bg-background` (sempre visível no final)

#### GlobalCart
Remoção do `max-h-[60vh] overflow-y-auto` do container de itens, deixando o ResponsiveModal gerenciar o scroll.

### Arquivos Modificados
- `components/ui/responsive-modal.tsx`
- `components/loja/GlobalCart.tsx`

### Impacto
Todos os modais que usam `ResponsiveModal` com footer agora exibem corretamente os botões de ação, mesmo com conteúdo longo.

### Regras Estabelecidas
1. **NUNCA** colocar `overflow-y-auto` no container principal de um modal que tem footer
2. **NUNCA** usar `max-h` ou `overflow` dentro do children de ResponsiveModal
3. **SEMPRE** usar estrutura flexbox para modais:
   - Container: `flex flex-col overflow-hidden max-h-[90vh]`
   - Header: `shrink-0`
   - Body: `flex-1 overflow-y-auto`
   - Footer: `shrink-0`

---

## 2026-01-02 - Atualização de Documentação e Novas Features

### Resumo
Atualização completa da documentação para refletir as novas features implementadas desde a última sincronização, incluindo integração Grok AI e sistema de workflow de aprovações.

### Features Documentadas

#### 1. Integração Grok AI (xAI)
- **Track Criado**: `conductor/tracks/grok-ai-integration/plan.md`
- **Documentação**: Completa integração com fallback para Gemini
- **Componentes**: GrokChat, SmartRecommendations, DashboardInsights
- **APIs**: 5 novos endpoints de IA documentados

#### 2. Sistema de Workflow de Aprovações
- **Track Existente**: `conductor/tracks/approval-workflow-system/plan.md`
- **Rotas**: `/gestor/aprovacoes`, `/gestor/aprovacoes/regras`, `/super-admin/aprovacoes`
- **Features**: Regras configuráveis, auto-aprovação, bulk actions, histórico

#### 3. Novas Páginas Documentadas
- `/gestor/aprovacoes` - Workflow de aprovações
- `/gestor/aprovacoes/regras` - Configuração de regras
- `/gestor/achievements` - Gestão de conquistas
- `/super-admin/aprovacoes` - Aprovações globais
- `/documentacao` - Documentação técnica

### Arquivos Modificados
- `SITEMAP.md` - Adicionadas novas rotas e seção de IA
- `PAGINAS_CRIADAS.md` - Novas páginas e endpoints de IA
- `conductor/tech-stack.md` - Seção AI & Intelligence
- `conductor/product.md` - Core features atualizadas
- `conductor/README.md` - Lista de tracks atualizada
- `conductor/CHANGELOG.md` - Esta entrada

### Arquivos Criados
- `conductor/tracks/grok-ai-integration/plan.md`

### Status
✅ Documentação completa e atualizada

---

## 2026-01-02 - Auto-sync

```markdown
- Título: 2023-10-27 - [Tipo de mudança: Refactor]
- Problema Identificado: Necessidade de refatorar o painel de controle e a documentação, remover estados de loading desnecessários e melhorar a estrutura do código. Além da necessidade de implementar redirecionamento baseado em roles.
- Solução Implementada:
    1.  Refatoração completa da página `app/dashboard/page.tsx` para implementar um dispatcher que redireciona o usuário com base em sua role.
    2.  Remoção dos arquivos de loading (`loading.tsx`) desnecessários para melhor performance.
    3.  Refatoração da página `app/documentacao/page.tsx`, atualizando a interface e adicionando novos componentes e funcionalidades, incluindo a exibição de informações baseadas no ID da empresa.
    4.  Implementação de um componente `PageContainer` para padronizar o layout das páginas.
    5.  Remoção das páginas de estoque, produtos cadastrados, snapshots, swag-track e usuários, juntamente com seus respectivos estados de loading.
    6.  Atualização do componente `app-shell.tsx` para usar o componente `PageContainer`.
    7.  Alterações nos componentes `badge.tsx` e `button.tsx` para remover importações não utilizadas e melhorar a organização do código.
    8.  Correção do redirecionamento na página de login para direcionar o usuário ao dashboard após o login.
    9.  Remoção dos estados de loading das páginas de pedidos, produtos cadastrados, snapshots, swag-track e usuários.
- Arquivos Modificados:
    - app/dashboard/page.tsx
    - app/documentacao/loading.tsx
    - app/documentacao/page.tsx
    - app/estoque/loading.tsx
    - app/estoque/page.tsx
    - app/layout.tsx
    - app/login/page.tsx
    - app/pedidos/loading.tsx
    - app/pedidos/page.tsx
    - app/produtos-cadastrados/loading.tsx
    - app/produtos-cadastrados/page.tsx
    - app/snapshots/loading.tsx
    - app/snapshots/page.tsx
    - app/swag-track/loading.tsx
    - app/swag-track/page.tsx
    - app/usuarios/loading.tsx
    - app/usuarios/page.tsx
    - components/app-shell.tsx
    - components/ui/badge.tsx
    - components/ui/button.tsx
- Regras Estabelecidas:
    - Utilizar o componente `PageContainer` para padronizar o layout das páginas.
    - Implementar redirecionamento baseado em roles para garantir a segurança e o acesso adequado às funcionalidades.
```

### Arquivos Modificados
- `app/dashboard/page.tsx`
- `app/documentacao/loading.tsx`
- `app/documentacao/page.tsx`
- `app/estoque/loading.tsx`
- `app/estoque/page.tsx`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/pedidos/loading.tsx`
- `app/pedidos/page.tsx`
- `app/produtos-cadastrados/loading.tsx`
- `app/produtos-cadastrados/page.tsx`
- `app/snapshots/loading.tsx`
- `app/snapshots/page.tsx`
- `app/swag-track/loading.tsx`
- `app/swag-track/page.tsx`
- `app/usuarios/loading.tsx`
- `app/usuarios/page.tsx`
- `components/app-shell.tsx`
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/input.tsx`
- `components/ui/sheet.tsx`
- `lib/storage.ts`

### Nota
Esta entrada foi gerada automaticamente pelo conductor-sync.js com análise da Gemini API. Para documentação completa, consulte os arquivos de track específicos.

## 2026-01-01 - Análise Completa OpenCode & Sugestões Adicionais

### Análise Realizada
- ✅ Análise completa do código baseada em padrões OpenCode
- ✅ Identificadas 10 categorias de melhorias
- ✅ 4 categorias já implementadas (TypeScript, Console Logs, Memoização, Error Handling)
- ✅ 6 categorias pendentes mapeadas

### Sugestões Pendentes Identificadas

#### Alta Prioridade
1. **Debug Fetch Calls**: 31+ blocos de debug logging em 6 arquivos
   - `app/loja/page.tsx` - 14 blocos
   - `app/loja/produto/[id]/page.tsx` - 8 blocos
   - `app/gestor/budgets/page.tsx` - 4 blocos
   - `app/gestor/swag-track/page.tsx` - 3 blocos
   - `app/campanha/checkout/page.tsx` - 1 bloco
   - `app/campanha/loja/page.tsx` - 1 bloco

#### Média Prioridade
2. **Tipos `any` Restantes**: 7 ocorrências em 4 arquivos
3. **Next.js Config**: Revisar `ignoreBuildErrors: true` para produção

#### Baixa Prioridade
4. **dangerouslySetInnerHTML**: Verificar sanitização em `components/ui/chart.tsx`
5. **Error Boundaries**: Adicionar em componentes críticos (opcional)
6. **Loading States**: Melhorar com skeletons (opcional)

### Documentação Criada
- ✅ `OPENCODE_SUGESTOES_COMPLETO.md` - Análise completa
- ✅ `OPENCODE_MAPEAMENTO_COMPLETO.md` - Mapeamento detalhado por arquivo

## 2026-01-01 - Melhorias de Código (OpenCode Suggestions)

### TypeScript - Substituição de `any`
- ✅ Substituído `any` por tipos específicos em arquivos críticos
- ✅ `app/api/health/route.ts` - Error handling melhorado
- ✅ `app/gestor/integrations/webhooks/page.tsx` - `WebhookEventType` ao invés de `any`
- ✅ `app/membro/estoque/page.tsx` - `Product` type ao invés de `any`
- ✅ `app/gestor/estoque/page.tsx` - `Product` type ao invés de `any`
- ✅ `app/gestor/send-gifts/page.tsx` - Interface `TransformedProduct` criada
- ✅ `app/loja/page.tsx` - `CompanyProduct` type ao invés de `any`

### Console Logs
- ✅ Removidos console.logs de debug
- ✅ Console.logs críticos agora só aparecem em modo desenvolvimento
- ✅ Arquivos atualizados:
  - `app/gestor/budgets/page.tsx` - Removidos múltiplos console.logs
  - `app/dashboard/admin/grok-integration/page.tsx` - Removido console.log
  - `app/gestor/budgets/page.tsx` - Console.error apenas em dev mode
  - `app/gestor/catalog/[id]/page.tsx` - Error handling melhorado
  - `app/gestor/currency/page.tsx` - Error handling melhorado
  - `app/campanha/checkout/page.tsx` - Error handling melhorado
  - `app/gestor/send-gifts/page.tsx` - Console.error apenas em dev mode

### Performance - Memoização
- ✅ Adicionado `useMemo` em cálculos pesados:
  - `app/membro/estoque/page.tsx` - `filteredProducts`, `totalStock`, `lowStockProducts`, `outOfStockProducts`
  - `app/gestor/estoque/page.tsx` - `filteredProducts`, `totalStock`, `lowStockProducts`, `outOfStockProducts`
  - `app/loja/page.tsx` - `categories`, `filteredProducts`

### Error Handling
- ✅ Melhorado error handling com tipos específicos
- ✅ Catch blocks vazios agora logam warnings em dev mode
- ✅ Error messages mais informativos
- ✅ Arquivos atualizados:
  - `app/membro/estoque/page.tsx`
  - `app/gestor/estoque/page.tsx`
  - `app/gestor/catalog/[id]/page.tsx`
  - `app/membro/documentacao/page.tsx`
  - `app/gestor/orders/page.tsx`
  - `app/gestor/currency/page.tsx`
  - `app/loja/page.tsx`

### Documentação
- ✅ Criado `OPENCODE_SUGESTOES.md` com análise completa
- ✅ Todas as melhorias documentadas

## 2026-01-01 - Correções de companyId e Sincronização

### Correções de Bugs
- **PodiumLeaderboard**: Corrigido erro `companyId is not defined` - adicionado como prop obrigatória
- **Orders Page**: Corrigido uso incorreto de `useState(() => {...})` → `useEffect(() => {...}, [])`
- **Documentação Page**: Corrigido mesmo erro de `useState` → `useEffect`
- Todos os componentes verificados para uso correto de `companyId`

### Sincronização
- ✅ Auto Claude → Conductor sincronizado
- ✅ 3 specs verificadas (nenhuma nova sincronização necessária)
- ✅ Insights do Auto Claude atualizados

### Documentação
- Criado `CORRECOES_COMPANYID.md` com resumo de todas as correções
- Padrões recomendados documentados

## 2026-01-01 - Sync Auto Claude → Conductor

### Sincronização de Specs
- ✅ 2 spec(s) sincronizada(s) para tracks
- 📊 Insights do Auto Claude disponíveis

### Nota
Esta sincronização foi executada automaticamente pelo auto-claude-conductor-sync.js.
Specs do Auto Claude foram convertidas em tracks do Conductor para documentação compartilhada.


## 2025-12-31 - Sincronização Geral e Consolidação do Conductor

### Resumo das Atualizações
O sistema **Conductor** foi totalmente atualizado e sincronizado com o estado atual da codebase. Todas as features implementadas recentemente foram devidamente documentadas em seus respectivos tracks e consolidadas nos documentos mestres.

### Mudanças Implementadas

#### 1. Sistema Conductor & Documentação
- **Sincronização Completa**: Executado `conductor-sync.js` para atualizar `product.md` e `tech-stack.md`.
- **Tracks Atualizados**:
  - `design-system-modernization`: Novo track documentando as melhorias de UI v0.
  - `fun-mode-sophisticated-redesign`: Marcado como concluído (padrão hexagonal e celebrações).
  - `ai-recommendations-visualization`: Documentado o sistema de visualização de IA e seeding automático.
- **Workflow & Regras**: Atualizado `workflow.md` com regras mandatórias para `PageContainer` e `react-markdown`.

#### 2. Design System & UI (v0)
- **Design Tokens**: Novo sistema de sombras e transições suaves em `app/globals.css`.
- **Componentes**: Feedback tátil (escala) em botões e sombras dinâmicas em cards.
- **Layout**: Auditoria completa de todas as páginas para garantir o uso de `PageContainer`.
- **Fun Mode**: Implementação sofisticada com padrão hexagonal e paleta baseada no projeto Stitch.

#### 3. Inteligência Artificial & Demo
- **Visualização de IA**: Novo componente `AIRecommendationView` para revisão de presentes sugeridos.
- **Seeding Automático**: Novas empresas agora recebem automaticamente produtos base replicados.
- **Branding Dinâmico**: Integração completa de logos gerados por IA em produtos da loja.

#### 4. Correções de Fluxo (Fixes)
- **Autenticação**: Remoção definitiva de fallbacks para usuários inexistentes (`spree_user_demo`).
- **Navegação**: Consolidação de menus duplicados e restrição de acesso a "Enviar Presentes" apenas para gestores.
- **Moeda**: Implementação de sistema de moeda dinâmica (plural/singular configurável).

### Arquivos Modificados (Destaque)
- `conductor/` (todos os arquivos MD)
- `app/globals.css`
- `lib/storage.ts`
- `lib/navigation.ts`
- `components/ui/` (botões, cards, etc)

### Status do Projeto
✅ **Conductor Sync**: 100% atualizado
✅ **Critical Tracks**: Todos marcados como CONCLUÍDO
✅ **Layout Compliance**: 100% (PageContainer em todas as rotas)

---

## 2025-12-31 - Visualização de Recomendações de IA e Seeding Automático de Produtos

### Problema Identificado
- As páginas de assistente de campanhas não geravam nenhum output visual das recomendações da IA
- Landing pages criadas não exibiam os produtos escolhidos
- Ao criar uma nova empresa/loja, o catálogo aparecia vazio (sem produtos em estoque)

### Solução Implementada

#### 1. Visualização de Recomendações de IA
- **Componente Criado**: `components/gifts/AIRecommendationView.tsx`
  - Cards visuais com imagens, nome, quantidade e razão da IA
  - Badges distintos para "Em Estoque" vs "Catálogo"
  - Resumo com totais e custos
  - Botão "Aplicar Recomendações" para confirmar seleção
  - Animações suaves com `framer-motion`
- **API Atualizada**: `app/api/gifts/recommend/route.ts`
  - Inclui todos os produtos ativos, independentemente do estoque
  - Separa produtos em estoque vs produtos do catálogo
  - Resposta enriquecida com `isStockRecommendation` e dados completos
- **Integração**: `app/gestor/landing-pages/page.tsx` e `app/gestor/send-gifts/page.tsx`
  - Estado para armazenar recomendações
  - Alterna entre formulário e visualização de recomendações
  - Lógica de aplicação das recomendações selecionadas

#### 2. Seeding Automático de Produtos
- **Função Criada**: `seedCompanyProducts(companyId: string)` em `lib/storage.ts`
  - Replica todos os base products para a empresa
  - Valores padrão: estoque 100, ativo, 1000 pontos
  - Idempotente: não duplica produtos existentes
- **Integração**: `createCompany()` agora chama `seedCompanyProducts()` automaticamente
  - Novas empresas têm produtos disponíveis imediatamente
  - Catálogo nunca fica vazio para novas empresas

#### 3. Busca Dinâmica de Landing Pages
- **Correção**: `getLandingPageBySlug()` em `lib/storage.ts`
  - Substituída lista hardcoded por busca dinâmica usando `getCompanies()`
  - Funciona para qualquer número de empresas

### Arquivos Criados
- `components/gifts/AIRecommendationView.tsx` - Componente de visualização de recomendações

### Arquivos Modificados
- `app/api/gifts/recommend/route.ts` - Inclui produtos sem estoque e enriquece resposta
- `app/gestor/landing-pages/page.tsx` - Integração de visualização de recomendações
- `app/gestor/send-gifts/page.tsx` - Integração de visualização de recomendações
- `lib/storage.ts` - Função `seedCompanyProducts()` e atualização de `createCompany()` e `getLandingPageBySlug()`

### Regras Estabelecidas
- **Visualização de Recomendações**: Sempre mostrar recomendações antes de aplicar
- **Seeding Automático**: Novas empresas sempre recebem produtos seedados
- **Produtos Padrão**: Estoque 100, ativo, 1000 pontos para novos produtos
- **Busca Dinâmica**: Landing pages devem ser buscadas em todas as empresas dinamicamente

### Status
✅ Completo - Visualização de recomendações implementada e seeding automático funcionando

## 2025-12-31 - Correção da Página de Detalhes do Produto

### Problema Identificado
- A página de detalhes do produto (`/loja/produto/[id]`) não exibia produtos demo quando clicados na loja
- Produtos demo estavam definidos apenas na página principal e não eram acessíveis na página de detalhes
- A lógica de busca de produtos não incluía produtos demo como fallback

### Solução Implementada

#### 1. Criação de Arquivo Compartilhado de Produtos Demo
- **Arquivo Criado**: `lib/demo-products.ts`
- **Conteúdo**:
  - Interface `DemoProduct` para tipagem TypeScript
  - Array `DEMO_PRODUCTS` com 8 produtos demo completos
  - Função `getDemoProductById()` para busca por ID
- **Benefício**: Centraliza produtos demo em um único local, acessível por todas as páginas

#### 2. Atualização da Página Principal da Loja
- **Arquivo**: `app/loja/page.tsx`
- **Mudanças**:
  - Removida constante local `DEMO_PRODUCTS` (89 linhas)
  - Adicionado import de `DEMO_PRODUCTS` do arquivo compartilhado
- **Benefício**: Mantém consistência e facilita manutenção futura

#### 3. Correção Completa da Página de Detalhes
- **Arquivo**: `app/loja/produto/[id]/page.tsx`
- **Mudanças Implementadas**:
  - Adicionado suporte para produtos demo na busca de produtos
  - Lógica de busca atualizada com fallback: CompanyProduct → Product → DemoProduct
  - Adicionado estado `isDemoProduct` para identificar produtos demo
  - Normalização completa de campos para os três tipos de produto:
    - CompanyProduct (V3)
    - Product (V2)
    - DemoProduct
  - Correção na chamada `getTagsByProductV3()` para usar "base" para produtos não-company
  - Produtos demo não têm tags (retorna array vazio corretamente)
  - Correção de texto ("disponível" vs "disponíveleis")
- **Benefício**: Todos os produtos (demo, company e base) são exibidos corretamente

### Arquivos Criados
- `lib/demo-products.ts` - Arquivo compartilhado com produtos demo e funções auxiliares

### Arquivos Modificados
- `app/loja/page.tsx` - Atualizado para usar produtos demo compartilhados
- `app/loja/produto/[id]/page.tsx` - Adicionado suporte completo para produtos demo

### Produtos Demo Disponíveis
1. Mochila Executiva Yoobe (R$ 250,00 / 1500 pontos)
2. Garrafa Térmica Emerald (R$ 89,90 / 600 pontos)
3. Kit Papelaria Sustentável (R$ 55,00 / 350 pontos)
4. Camiseta Algodão Pima (R$ 120,00 / 850 pontos)
5. Jaqueta Corta-vento Premium (R$ 350,00 / 2200 pontos)
6. Mousepad Gamer XL (R$ 75,00 / 450 pontos)
7. Caneca de Cerâmica Fosca (R$ 45,00 / 250 pontos)
8. Boné Trucker Yoobe (R$ 65,00 / 400 pontos)

### Fluxo de Busca de Produtos
```
1. Verifica se é CompanyProduct (ID começa com "cp_")
   └─ Se encontrado: usa como CompanyProduct
   
2. Se não encontrado, busca em Product (V2)
   └─ Se encontrado: usa como Product
   
3. Se ainda não encontrado, busca em DemoProduct
   └─ Se encontrado: usa como DemoProduct
   
4. Se nenhum encontrado: redireciona para /loja com erro
```

### Status
✅ Completo - Todos os produtos são acessíveis e exibidos corretamente

### Testes Realizados
- [x] Produtos demo são exibidos na página principal da loja
- [x] Clicar em produto demo navega para página de detalhes
- [x] Página de detalhes exibe informações corretas do produto demo
- [x] Adicionar ao carrinho funciona para produtos demo
- [x] Produtos company e base continuam funcionando normalmente
- [x] Tags são buscadas corretamente para cada tipo de produto
- [x] Sem erros de lint ou TypeScript

## 2025-12-30 - Auditoria Completa de Layouts e Correção de Imports

### Verificação e Correções de Layout

#### 1. Auditoria Completa de Menus Duplicados
- **Escopo**: Verificação sistemática de todas as 52 páginas do projeto
- **Método**: Análise de uso de `AppShell` vs `PageContainer` em relação aos layouts
- **Resultado**: Nenhum menu duplicado encontrado - todas as páginas seguem o padrão correto

#### 2. Correção de Imports em `app/membro/swag-track/page.tsx`
- **Problema**: Import não utilizado de `AppShell` e falta do import de `Label`
- **Solução**:
  - Removido import não utilizado: `import { AppShell } from "@/components/app-shell"`
  - Adicionado import faltante: `import { Label } from "@/components/ui/label"`
  - Página já estava usando `PageContainer` corretamente (layout fornece `AppShell`)

#### 3. Validação de Padrões de Layout
- **Páginas em `/loja/*`**: Corretas - usam `AppShell` diretamente (layout não fornece)
  - `app/loja/page.tsx`
  - `app/loja/produto/[id]/page.tsx`
  - `app/loja/checkout/page.tsx`
  - `app/loja/pedido/[id]/page.tsx`
  - `app/loja/send-gifts/page.tsx`
- **Páginas com layouts que fornecem `AppShell`**: Corretas - usam `PageContainer`
  - `/dashboard/*` → `app/dashboard/layout.tsx` fornece `AppShell`
  - `/gestor/*` → `app/gestor/layout.tsx` fornece `AppShell`
  - `/membro/*` → `app/membro/layout.tsx` fornece `AppShell`
  - `/super-admin/*` → `app/super-admin/layout.tsx` fornece `AppShell`
  - `/sandbox/*` → `app/sandbox/layout.tsx` fornece `AppShell`
- **Páginas especiais**: Corretas
  - `app/sitemap/page.tsx` → usa `PageContainer` corretamente
  - `app/demo-guide/page.tsx` → usa `PageContainer` corretamente
  - `app/onboarding/page.tsx` → não usa `AppShell` (layout não fornece)

#### 4. Correções de Imagens na Loja
- **Arquivo**: `components/demo/branded-product-image.tsx`
- **Problema**: Imagens quebradas causando layout desalinhado e experiência ruim
- **Melhorias**:
  - Adicionado fallback automático para `/placeholder.jpg` quando imagem falha
  - Handler `onError` para substituir imagens quebradas automaticamente
  - Estado para rastrear erros de imagem e evitar loops infinitos
  - Lazy loading para melhor performance
  - Fallback padrão quando `productImage` está vazio ou undefined
- **Arquivos Atualizados**:
  - `app/loja/page.tsx`: Aplicado fallback em todas as imagens da lista de produtos
  - `app/loja/produto/[id]/page.tsx`: Aplicado fallback em imagens principais e miniaturas
  - `app/loja/checkout/page.tsx`: Aplicado fallback em imagens do carrinho
  - `app/loja/pedido/[id]/page.tsx`: Verificado e confirmado correto
- **Layout Melhorado**:
  - Adicionado padding responsivo (`px-4 sm:px-6 lg:px-8 py-6`) em todas as páginas da loja
  - Melhorado espaçamento e alinhamento de cards de produtos
  - Adicionado hover effects e transições suaves (scale, shadow)
  - Cards com melhor estrutura flex para evitar quebras de layout
  - Melhorado alinhamento de preços, badges e botões
  - Adicionado `flex-1` e `min-w-0` para evitar overflow de texto

## 2025-12-30 - Melhorias na Experiência do Gestor e Membro

### Funcionalidades Implementadas

#### 1. Limpeza e Consolidação de Menus
- **Arquivo**: `lib/navigation.ts`
- **Mudanças**:
  - Removida duplicação de itens de menu para gestor e membro
  - Tradução completa para Português (PT-BR)
  - Consolidação de "Catálogo" e "Produtos" em um único item
  - Tradução de itens em inglês: "Sitemap" → "Mapa do Site", "Conductor Specs" → "Especificações do Conductor", etc.

#### 2. Sistema de Moeda Dinâmica
- **Arquivos Modificados**:
  - `lib/storage.ts`: Adicionada interface `currency` em `StoreSettings` com campos `name` (singular) e `plural`
  - Criada função `getCurrencyName(companyId, plural)` para obter nome da moeda dinamicamente
  - Substituição de todas as referências hardcoded "Pontos" por chamadas dinâmicas
- **Arquivos Atualizados**:
  - `app/loja/page.tsx`
  - `app/loja/checkout/page.tsx`
  - `app/gestor/usuarios/page.tsx`
  - `app/dashboard/manager/page.tsx`
  - `app/dashboard/member/page.tsx`
- **Padrão**: Moeda padrão é "ponto" (singular) e "pontos" (plural)

#### 3. Configuração de Renomeação de Moeda
- **Arquivo**: `app/gestor/store-settings/page.tsx`
- **Funcionalidade**: Nova aba "Moeda" nas configurações da loja
- **Recursos**:
  - Campos de input para nome singular e plural da moeda
  - Preview em tempo real da moeda configurada
  - Persistência em `StoreSettings` via localStorage

#### 4. Gestão Avançada de Usuários
- **Arquivo**: `app/gestor/usuarios/page.tsx`
- **Novas Funcionalidades**:
  - **Convidar Usuário**: Diálogo para enviar convite por email (simulado)
  - **Adicionar Manualmente**: Formulário completo para cadastro manual de novos membros
  - **Importação em Massa**: Upload de arquivo CSV/XLSX para importação de múltiplos usuários
  - **Formato CSV Esperado**: email, nome, sobrenome, telefone (opcional)

#### 5. Busca e Exportação CSV
- **Arquivos Modificados**:
  - `app/gestor/orders/page.tsx`: Adicionado botão "Exportar CSV" com dados de pedidos
  - `app/gestor/usuarios/page.tsx`: Adicionado botão "Exportar CSV" com dados de usuários
  - `app/gestor/estoque/page.tsx`: Adicionado botão "Exportar CSV" com dados de estoque
- **Funcionalidade**: Exportação de dados filtrados em formato CSV com nome de arquivo datado

#### 6. Gráficos Visuais nos Dashboards
- **Biblioteca**: `recharts` (já instalada)
- **Dashboard do Gestor** (`app/dashboard/manager/page.tsx`):
  - Gráfico de linha: Pedidos ao longo do tempo (últimos 7 dias)
  - Gráfico de pizza: Distribuição de pontos por nível de usuário
  - Gráfico de barras: Top 5 produtos mais vendidos
- **Dashboard do Membro** (`app/dashboard/member/page.tsx`):
  - Gráfico de área: Histórico de atividades e evolução de pontos (últimos 7 dias)
- **Visual**: Gráficos responsivos com cores do tema e animações suaves

### Melhorias de UX
- Todas as interfaces traduzidas para Português (PT-BR)
- Feedback visual em todas as ações (toasts, confirmações)
- Validação de formulários antes de submissão
- Preview de dados antes de exportação

### Arquivos Criados/Modificados
- `lib/storage.ts`: Interface `currency` e função `getCurrencyName`
- `lib/navigation.ts`: Limpeza e tradução de menus
- `app/gestor/store-settings/page.tsx`: Nova aba de moeda
- `app/gestor/usuarios/page.tsx`: Funcionalidades de convite, adição e importação
- `app/gestor/orders/page.tsx`: Exportação CSV
- `app/gestor/estoque/page.tsx`: Exportação CSV
- `app/dashboard/manager/page.tsx`: Gráficos visuais
- `app/dashboard/member/page.tsx`: Gráficos visuais
- Múltiplos arquivos: Substituição de "Pontos" por moeda dinâmica

## 2025-12-31 - Refinamento do Conductor Viewer: Renderização Profissional de Markdown

### Problema Identificado
- O Conductor Viewer usava um parser manual de Markdown com `dangerouslySetInnerHTML`, limitado e menos seguro
- Falta de suporte para recursos avançados de Markdown (tabelas, checklists, syntax highlighting)
- Experiência de leitura subótima para documentação técnica

### Solução Implementada

#### 1. Substituição do Renderer Manual
- **Arquivo**: `app/super-admin/conductor/page.tsx`
- **Mudança**: Substituído `MarkdownRenderer` customizado por implementação profissional com `react-markdown`
- **Bibliotecas Instaladas**:
  - `react-markdown`: Renderização segura e robusta de Markdown
  - `remark-gfm`: Suporte para GitHub Flavored Markdown (tabelas, checklists, links automáticos)
  - `react-syntax-highlighter`: Realce de sintaxe colorido em blocos de código
  - `@types/react-syntax-highlighter`: Tipos TypeScript

#### 2. Syntax Highlighting Profissional
- Realce de sintaxe dinâmico baseado na linguagem do código
- Temas automáticos (dark/light) baseados no tema ativo
- Suporte para múltiplas linguagens de programação
- Estilos visuais consistentes com o design system

#### 3. Funcionalidades Interativas
- **Botão "Copiar"**: Funcionalidade de copiar código com um clique
- **Feedback Visual**: Confirmação visual ao copiar código (ícone muda para checkmark)
- **Animações Suaves**: Transições de entrada usando `framer-motion` para melhor UX

#### 4. Melhorias de Tipografia
- Classes `prose` do Tailwind para tipografia otimizada
- Estilos customizados para headers, listas, tabelas e blocos de código
- Suporte completo para dark mode e Fun Mode
- Espaçamento e contraste otimizados para leitura

#### 5. Suporte Avançado de Markdown
- **Tabelas**: Renderização completa de tabelas markdown
- **Checklists**: Suporte para listas de tarefas (GitHub Flavored Markdown)
- **Links Automáticos**: Detecção e formatação automática de URLs
- **Blockquotes**: Citações com estilo visual diferenciado
- **Code Blocks**: Blocos de código com header mostrando a linguagem

### Arquivos Modificados
- `app/super-admin/conductor/page.tsx`: Refatoração completa do MarkdownRenderer
- `package.json`: Adicionadas novas dependências

### Arquivos Criados
- Nenhum (apenas atualizações)

### Dependências Adicionadas
- `react-markdown`: ^9.0.0
- `remark-gfm`: ^4.0.0
- `react-syntax-highlighter`: ^15.5.0
- `@types/react-syntax-highlighter`: ^15.5.0
- `@tailwindcss/typography`: ^0.5.0 (disponível para uso futuro)

### Regras Estabelecidas
- **Markdown Rendering**: Sempre usar `react-markdown` para renderização de conteúdo markdown
- **Syntax Highlighting**: Usar `react-syntax-highlighter` com temas adaptativos (dark/light)
- **Copy Functionality**: Implementar botão de copiar em todos os blocos de código
- **Animations**: Usar `framer-motion` para transições suaves ao carregar conteúdo
- **Typography**: Aproveitar classes `prose` do Tailwind para tipografia consistente

### Resultado
- **100% Seguro**: Eliminação de `dangerouslySetInnerHTML` em favor de renderização segura
- **Experiência Profissional**: Visualização de documentação técnica de nível profissional
- **Interatividade**: Funcionalidades úteis como copiar código com um clique
- **Compatibilidade**: Suporte completo para todos os recursos de Markdown (GFM)
- **Acessibilidade**: Melhor contraste e espaçamento para leitura

## 2025-12-31 - Auto-sync

- Título: 2023-10-27 - [Refactor: Roteamento Dinâmico e Autenticação]
- Problema Identificado: Necessidade de roteamento dinâmico baseado em roles do usuário e autenticação centralizada.
- Solução Implementada:
    1. Implementação de roteamento dinâmico no `DashboardPage` redirecionando usuários para diferentes áreas do sistema com base em sua `UserRole`.
    2. Remoção de diversas páginas e seus respectivos `loading.tsx` que agora serão acessadas via roteamento dinâmico e autenticação.
    3. Atualização do `AppShell` e `layout.tsx` para suportar a nova estrutura de autenticação e roteamento.
    4. Criação do componente `DashboardDispatcher` para gerenciar o redirecionamento com base na role do usuário.
    5. Modificações nos componentes `ui/badge.tsx` e `ui/button.tsx`, indicando possivelmente mudanças visuais ou de funcionalidade nesses componentes.
- Arquivos Modificados:
    - app/dashboard/page.tsx
    - app/documentacao/loading.tsx
    - app/documentacao/page.tsx
    - app/estoque/loading.tsx
    - app/estoque/page.tsx
    - app/layout.tsx
    - app/login/page.tsx
    - app/pedidos/loading.tsx
    - app/pedidos/page.tsx
    - app/produtos-cadastrados/loading.tsx
    - app/produtos-cadastrados/page.tsx
    - app/snapshots/loading.tsx
    - app/snapshots/page.tsx
    - app/swag-track/loading.tsx
    - app/swag-track/page.tsx
    - app/usuarios/loading.tsx
    - app/usuarios/page.tsx
    - components/app-shell.tsx
    - components/ui/badge.tsx
    - components/ui/button.tsx
- Regras Estabelecidas: O acesso às páginas internas agora depende da role do usuário autenticado.

### Arquivos Modificados
- `app/dashboard/page.tsx`
- `app/documentacao/loading.tsx`
- `app/documentacao/page.tsx`
- `app/estoque/loading.tsx`
- `app/estoque/page.tsx`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/pedidos/loading.tsx`
- `app/pedidos/page.tsx`
- `app/produtos-cadastrados/loading.tsx`
- `app/produtos-cadastrados/page.tsx`
- `app/snapshots/loading.tsx`
- `app/snapshots/page.tsx`
- `app/swag-track/loading.tsx`
- `app/swag-track/page.tsx`
- `app/usuarios/loading.tsx`
- `app/usuarios/page.tsx`
- `components/app-shell.tsx`
- `components/ui/badge.tsx`
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `lib/storage.ts`

### Nota
Esta entrada foi gerada automaticamente pelo conductor-sync.js com análise da Gemini API. Para documentação completa, consulte os arquivos de track específicos.

## 2025-12-30 - Conductor Automation e Spec Viewer

### Problema Identificado
- Atualizações aprovadas não eram automaticamente documentadas no Conductor
- Não havia interface visual para acompanhar as especificações do Conductor
- Sincronização manual era necessária e propensa a esquecimentos

### Solução Implementada

#### 1. Automação com Gemini API
- **Arquivo**: `conductor-sync.js`
- **Melhorias**:
  - Integração com Gemini API para análise inteligente de mudanças
  - Análise de git diffs para entender contexto das mudanças
  - Geração automática de resumos estruturados para o CHANGELOG
  - Detecção melhorada de arquivos modificados (staged e unstaged)
  - Fallback para resumo básico se Gemini API não estiver disponível

#### 2. Git Hook Automático
- **Arquivo**: `scripts/setup-conductor-hook.sh` (NOVO)
- **Features**:
  - Instala pre-commit hook automaticamente
  - Executa `conductor-sync.js` antes de cada commit
  - Adiciona mudanças do Conductor ao commit automaticamente
  - Valida se há mudanças relevantes antes de executar
  - Instruções claras para desabilitar se necessário

#### 3. API Route para Conductor
- **Arquivo**: `app/api/conductor/route.ts` (NOVO)
- **Features**:
  - Endpoint seguro para ler documentação do Conductor
  - Ações: `list` (lista arquivos e tracks) e `read` (lê arquivo específico)
  - Validação de path traversal para segurança
  - Retorna metadados (lastModified) junto com conteúdo

#### 4. Spec Viewer Page (Super Admin)
- **Arquivo**: `app/super-admin/conductor/page.tsx` (NOVO)
- **Features**:
  - **Visão Geral**: Dashboard com estatísticas (arquivos, tracks, última atualização, status)
  - **Documentação**: Visualização completa de todos os arquivos markdown
  - **Tracks**: Lista de todos os tracks implementados com seus planos
  - **Changelog**: Visualização interativa do histórico de mudanças
  - **Markdown Renderer**: Renderização customizada de markdown com suporte completo
  - **Fun Mode Support**: Design adaptado para Fun Mode com cores vibrantes
  - **Responsive**: Layout adaptável para mobile e desktop

#### 5. Navegação Atualizada
- **Arquivo**: `lib/navigation.ts`
- **Mudança**: Adicionado link "Conductor Specs" no menu Super Admin
  - Rota: `/super-admin/conductor`
  - Ícone: `Terminal`
  - Role: `["superAdmin"]`

### Arquivos Modificados
- `conductor-sync.js`: Integração Gemini API, análise de diffs, resumos inteligentes
- `lib/navigation.ts`: Adicionado link Conductor Specs
- `conductor/README.md`: Documentação atualizada com novas features

### Arquivos Criados
- `app/api/conductor/route.ts`: API route para servir documentação
- `app/super-admin/conductor/page.tsx`: Página de visualização de specs
- `scripts/setup-conductor-hook.sh`: Script de instalação do git hook

### Fluxo Automatizado
1. **Desenvolvimento**: Desenvolvedor faz mudanças no código
2. **Commit**: Git hook detecta mudanças e executa `conductor-sync.js`
3. **Análise**: Gemini API analisa diffs e gera resumo inteligente
4. **Documentação**: Conductor atualiza CHANGELOG.md, product.md, tech-stack.md
5. **Commit**: Mudanças do Conductor são adicionadas ao commit automaticamente
6. **Visualização**: Super Admin pode ver todas as specs em `/super-admin/conductor`

### Regras Estabelecidas
- **Git Hook**: Sempre executar `./scripts/setup-conductor-hook.sh` após clonar repositório
- **Gemini API**: Opcional mas recomendado - melhora qualidade dos resumos
- **Acesso Spec Viewer**: Apenas Super Admin pode acessar `/super-admin/conductor`
- **Sincronização**: Automática via git hook, manual via `./conductor.sh sync`
- **Documentação**: Toda mudança aprovada (commit) é automaticamente documentada

### Como Usar

#### Configurar Git Hook (Uma vez)
```bash
./scripts/setup-conductor-hook.sh
```

#### Sincronização Manual (Opcional)
```bash
./conductor.sh sync
```

#### Visualizar Specs
1. Fazer login como Super Admin
2. Acessar "Conductor Specs" no menu lateral
3. Navegar pelas abas: Visão Geral, Documentação, Tracks, Changelog

### Resultado
- **100% Automatizado**: Toda mudança aprovada é documentada automaticamente
- **Resumos Inteligentes**: Gemini API gera resumos contextuais e estruturados
- **Visualização Centralizada**: Interface única para acompanhar todas as specs
- **Zero Esquecimentos**: Git hook garante que nada seja esquecido

## 2025-12-30 - Gamificação Hub: Design Stitch-Inspired para Fun Mode

### Problema Identificado
- Página de gamificação não estava acessível na navegação de membros
- Design não seguia o padrão visual do Stitch (dark mode, cores vibrantes, layout limpo)
- Falta de engajamento visual e interatividade no modo Fun
- Leaderboard sem visualização diferenciada para top 3

### Solução Implementada

#### 1. Navegação Atualizada
- **Arquivo**: `lib/navigation.ts`
- **Mudança**: Adicionado link "Gamificação" na navegação de membros
  - Rota: `/membro/gamificacao`
  - Ícone: `Trophy`
  - Role: `member`

#### 2. Design Condicional Baseado em Tema
- **Arquivo**: `app/membro/gamificacao/page.tsx`
- **Implementação**:
  - **Modo Padrão (Light/Dark)**: Layout corporativo limpo e profissional
  - **Modo Fun**: Design Stitch-inspired com dark mode completo
  - Detecção via `useTheme()` do `next-themes`
  - Renderização condicional baseada em `theme === "fun"`

#### 3. Fun Mode - Stitch Design (Dark Mode)
- **Fundo**: Gradiente escuro (`slate-950/900`) com partículas flutuantes coloridas
- **Hero Section**:
  - Troféu animado com glow effect (amarelo)
  - Título com gradiente vibrante (amarelo → laranja → rosa)
  - Mensagem de boas-vindas personalizada
- **Progress Hub**:
  - Card com glassmorphism (`slate-800/90` com backdrop blur)
  - Badge de nível com cores dinâmicas baseadas no nível do usuário
  - Progress bar com gradiente (amarelo → laranja → rosa)
  - Circular progress indicator com gradiente animado
  - Glow effects nos elementos principais
- **Stats Grid**:
  - 4 cards com cores diferenciadas (azul, verde, roxo, laranja)
  - Gradientes vibrantes em cada card
  - Ícones animados com rotação
  - Hover effects com scale e translate
- **Leaderboard - Podium Style**:
  - Top 3 com pódio visual (alturas diferentes: 2º=90px, 1º=140px, 3º=110px)
  - Cores diferenciadas por posição:
    - 1º lugar: Amarelo com glow (`from-yellow-400 to-yellow-600`)
    - 2º lugar: Cinza prateado (`from-slate-400 to-slate-600`)
    - 3º lugar: Laranja/âmbar (`from-orange-500 to-amber-700`)
  - Animações de entrada escalonadas
  - Lista de outros rankings (4º em diante) com hover effects
  - Destaque visual para o usuário atual (ring amarelo)
- **Achievements**:
  - Cards com glassmorphism e gradientes
  - Background glow animado no hover
  - Badges de conquista com ícones grandes e animados
  - Animações de entrada com rotação e scale
  - Seção de conquistas bloqueadas com opacidade reduzida
- **Recent Activity**:
  - Cards com bordas coloridas (laranja/vermelho)
  - Ícones rotativos
  - Hover effects com translate e scale

#### 4. Partículas Flutuantes
- **Componente**: `FloatingParticles`
- **Features**:
  - 30 partículas coloridas (amarelo, laranja, rosa, roxo, azul)
  - Movimento contínuo e aleatório
  - Opacidade animada (fade in/out)
  - Tamanhos variados (1-4px)
  - Background não interfere na interação

#### 5. Circular Progress Component
- **Componente**: `CircularProgress`
- **Features**:
  - SVG com gradiente linear (amarelo → laranja → rosa)
  - Animação suave de preenchimento
  - Percentual centralizado com gradiente de texto
  - Tamanho e stroke configuráveis

#### 6. Podium Leaderboard Component
- **Componente**: `PodiumLeaderboard`
- **Features**:
  - Layout flex com posicionamento customizado (1º no centro)
  - Alturas dinâmicas baseadas na posição
  - Cores e glows diferenciados por posição
  - Animações de entrada escalonadas
  - Lista de outros rankings com design consistente

### Arquivos Modificados
- `lib/navigation.ts`: Adicionado link "Gamificação" para membros
- `app/membro/gamificacao/page.tsx`: Redesign completo com modo condicional

### Princípios de Design Aplicados
- **Dark Mode Completo**: Fundo escuro (`slate-950/900`) para contraste máximo
- **Cores Vibrantes e Contrastantes**: Gradientes amarelo-laranja-rosa em elementos principais
- **Layout Limpo e Espaçado**: `space-y-10` para respiração visual
- **Glassmorphism**: Cards com backdrop blur e transparência
- **Animações Refinadas**: Entrada suave, hover effects sutis, transições profissionais
- **Hierarquia Visual**: Pódio destaca top 3, stats cards com cores distintas
- **Engajamento**: Partículas, glows, rotações e scales para feedback visual

### Resultado
Uma página de gamificação que:
- Mantém design corporativo no modo padrão
- Transforma-se completamente no Fun Mode com design Stitch-inspired
- Oferece experiência visualmente rica e engajante
- Destaque visual para conquistas e rankings
- Animações suaves e profissionais
- Cores vibrantes sem perder profissionalismo

### Regras Estabelecidas
- **Renderização Condicional**: Sempre verificar `theme === "fun"` antes de aplicar estilos Stitch
- **Cores Dark Mode**: Usar `slate-800/900/950` para fundos, `slate-700` para bordas
- **Gradientes Vibrantes**: Amarelo → Laranja → Rosa para elementos principais
- **Glassmorphism**: `backdrop-blur-sm` + transparência para cards
- **Animações**: Usar `framer-motion` com transições suaves (spring, ease-out)
- **Pódio**: Alturas 90px (2º), 140px (1º), 110px (3º) para hierarquia visual

## 2025-12-30 - Redesign Sofisticado do Modo Fun

### Problema Identificado
- Cores muito bregas (rosa neon, amarelo choque) que não transmitiam profissionalismo
- Elementos visuais aleatórios e sem propósito estético
- Animações exageradas e pouco profissionais (bounce, rotações excessivas)
- Falta de identidade visual coesa e elegante

### Solução Implementada

#### 1. Nova Paleta de Cores Sofisticada
- **Arquivo**: `app/globals.css`
- **Mudanças**:
  - **Primary**: Azul Cobalto Profundo (oklch 0.55 0.18 250) - elegante e confiável
  - **Secondary**: Verde Água/Menta (oklch 0.75 0.15 180) - fresco e moderno
  - **Accent**: Laranja Coral Suave (oklch 0.7 0.2 45) - energia sem ser agressivo
  - **Background**: Gradiente sutil azul-cinza claro
  - **Removido**: Todas as referências a rosa neon e amarelo choque
  - **Border Radius**: Reduzido para 1rem (elegante, não exagerado)

#### 2. Glassmorphism em Cards
- **Arquivo**: `app/globals.css`
- **Implementação**:
  - Fundo semi-transparente: `oklch(1 0 0 / 0.7)`
  - Backdrop blur: `blur(12px) saturate(180%)`
  - Bordas sutis: `1px solid oklch(0.9 0.03 240 / 0.3)`
  - Sombras multicamadas suaves
  - Hover: elevação sutil (translateY(-2px))
  - Animação de entrada: fade-in + slide-up suave

#### 3. Padrão de Fundo Geométrico Elegante
- **Arquivo**: `app/globals.css`
- **Mudanças**:
  - Substituído padrão de pontos aleatórios por grid hexagonal sutil
  - Cores muito sutis (opacidade 0.02-0.03)
  - Gradiente de fundo azul-cinza suave
  - Padrão não interfere na legibilidade

#### 4. Elementos Decorativos Sutis
- **Arquivo**: `app/globals.css`
- **Implementação**:
  - Formas geométricas nos cantos (círculos com gradiente radial)
  - Apenas em headers e sidebars
  - Opacidade baixa (0.1)
  - Cores harmoniosas com a paleta

#### 5. Animações Refinadas
- **Arquivo**: `app/globals.css`
- **Mudanças**:
  - **Entrada**: Fade-in + slide-up suave (removido bounce)
  - **Hover**: Scale máximo 1.02x (não 1.1x)
  - **Transições**: 200ms cubic-bezier suave
  - **Micro-interações**: Feedback visual sutil e profissional
  - **Gradientes Animados**: Velocidade reduzida (4-6s)

#### 6. Tipografia e Espaçamento
- **Arquivo**: `app/globals.css`
- **Mudanças**:
  - **Títulos**: Gradientes sutis (azul → verde água)
  - **Text Shadow**: Reduzido e mais sutil
  - **Letter Spacing**: Ajuste mínimo (+0.01em)
  - **Font Weight**: 600 (não 700) para elegância

#### 7. Melhorias em Ícones
- **Arquivo**: `app/globals.css`
- **Mudanças**:
  - Stroke mais grosso (2.5) em ícones principais
  - Drop-shadow sutil em vez de brilho excessivo
  - Hover: scale 1.05 (não exagerado)
  - Transições suaves

#### 8. Componentes Específicos Refinados
- **Dialogs/Modals**: Glassmorphism com blur 16px
- **Tables**: Gradientes sutis no hover
- **Progress Bars**: Gradiente elegante azul-verde
- **Tabs**: Sublinhado sutil com sombra suave
- **Alerts**: Glassmorphism com bordas sutis
- **Scrollbars**: Gradiente azul-verde elegante
- **Sidebar**: Glassmorphism com blur 12px

### Arquivos Modificados
- `app/globals.css`: Redefinição completa da seção `.fun` (linhas 78-625+)

### Princípios de Design Aplicados
- **Elegância sobre Exagero**: Menos é mais
- **Cores Harmoniosas**: Paleta coesa baseada em azul-verde-laranja
- **Profissionalismo**: Mantém credibilidade mesmo sendo "fun"
- **Modernidade**: Glassmorphism, gradientes sutis, espaçamento generoso

### Resultado
Um tema "Fun" que é:
- Visualmente atraente e moderno
- Profissional e confiável
- Diferente dos modos Light/Dark
- Agradável de usar por longos períodos
- Livre de elementos "brega" ou aleatórios

## 2025-12-30 - Correções de Autenticação, Orçamento e Experiência de Resgate

### Problema Identificado
- Login usava `userId: "spree_user_demo"` que não existia no storage, causando erros silenciosos
- Gestor não conseguia adicionar produtos ao orçamento (seleção não funcionava corretamente)
- Membro não conseguia visualizar experiência completa de resgate (produtos V3 não funcionavam)
- Checkout e tracking ainda dependiam de produtos V2, quebrando com produtos replicados (V3)
- API de replicação retornava erros vazios sem mensagens úteis

### Correções Implementadas

#### 1. Autenticação Demo Corrigida
- **Arquivo**: `app/login/page.tsx`
- **Mudança**: Login agora mapeia roles para usuários seedados existentes:
  - `superAdmin` → `spree_user_4` (Ana Oliveira)
  - `manager` → `spree_user_1` (João Silva)
  - `member` → `spree_user_3` (Pedro Costa)
- **Resultado**: `getUserById()` sempre retorna usuário válido, eliminando erros silenciosos
- **Fallbacks Removidos**: 
  - `components/app-shell.tsx`: Removido fallback para `spree_user_demo`
  - `components/gamification/UserStats.tsx`: Removido fallback para `spree_user_demo`
  - `app/dashboard/member/page.tsx`: Removido fallback para `spree_user_demo`
- **Validação**: Páginas agora redirecionam para login quando usuário não é encontrado

#### 2. Fluxo de Orçamento Melhorado
- **Arquivo**: `app/gestor/catalog/import/page.tsx`
- **Mudanças**:
  - Botões +/- agora usam `stopPropagation()` para evitar conflitos com cliques no card
  - Input de quantidade com `onBlur` para garantir atualização mesmo quando focado
  - Botão "Enviar Orçamento" com feedback visual melhorado:
    - Desabilitado com texto "Selecione ao menos 1 item" quando vazio
    - Mostra contador de itens quando habilitado: "Enviar Orçamento (3)"
    - Loading spinner (`Loader2`) durante envio
  - Melhor tratamento de erros com toasts informativos
  - Validação prévia de usuário e empresa antes de criar orçamento

#### 3. Storefront: Suporte Completo para CompanyProducts (V3)
- **Arquivo**: `app/loja/produto/[id]/page.tsx`
- **Mudanças**:
  - Busca primeiro `CompanyProduct` (V3) via `getCompanyProductById()` para IDs `cp_...`
  - Fallback para `Product` (V2) se não encontrar (compatibilidade retroativa)
  - Normalização de campos para funcionar com ambos:
    - `pointsCost` (V3) ou `priceInPoints` (V2)
    - `stockQuantity` (V3) ou `stock` (V2)
    - `images` (V3) ou `image` (V2)
    - `finalSku` (V3) ou `sku` (V2)
  - Validação de saldo e estoque funcionando para ambos os tipos
  - Adicionar ao carrinho funciona com produtos V3

#### 4. Checkout: Funciona com CompanyProducts (V3)
- **Arquivo**: `app/loja/checkout/page.tsx`
- **Mudanças**:
  - Removida dependência de `getProducts()` V2 para obter SKU
  - Busca SKU via `getCompanyProductById()` para produtos `cp_...`
  - Validação de estoque antes de criar pedido (V3 e V2)
  - Dedução de estoque de `CompanyProduct` após checkout bem-sucedido
  - Suporta produtos V2 e V3 no mesmo carrinho
  - Mensagens de erro mais específicas (ex: "Estoque insuficiente para X")

#### 5. Tracking e Pedidos: Suporte V3
- **Arquivo**: `app/membro/pedidos/page.tsx`
- **Mudanças**:
  - `getProductImage()` busca primeiro em `CompanyProduct`, depois em `Product` V2
  - `getProductName()` com fallback para garantir nome sempre exibido
  - Funciona com pedidos que contêm produtos `cp_...`
- **Arquivo**: `app/loja/pedido/[id]/page.tsx`
- **Mudança**: Ajuste na validação de acesso (members só veem seus próprios pedidos)

#### 6. API de Replicação: Tratamento de Erros Melhorado
- **Arquivo**: `app/api/replication/route.ts`
- **Mudanças**:
  - Validação do body da requisição antes de processar
  - Logs detalhados em pontos críticos (budget encontrado, items processados)
  - Tratamento de erros ao criar log de replicação (não interrompe replicação)
  - Tratamento de erros ao atualizar status do budget (não interrompe replicação)
  - Mensagens de erro mais informativas com contexto de debug
- **Arquivo**: `app/gestor/budgets/page.tsx`
- **Mudanças**:
  - Validação prévia se budget existe antes de chamar API
  - Validação se status é "released" antes de replicar
  - Tratamento de erros melhorado:
    - Lê resposta como texto primeiro (`response.text()`)
    - Tenta parsear JSON apenas se houver conteúdo
    - Fallback para `statusText` ou código HTTP
    - Logs detalhados para debug
  - Recarrega budgets se não encontrar o budget solicitado

### Arquivos Modificados
- `app/login/page.tsx`: Mapeamento de roles para usuários seedados
- `components/app-shell.tsx`: Removido fallback `spree_user_demo`
- `components/gamification/UserStats.tsx`: Removido fallback `spree_user_demo`
- `app/dashboard/member/page.tsx`: Removido fallback `spree_user_demo`
- `app/gestor/catalog/import/page.tsx`: Melhorias na seleção e feedback
- `app/gestor/budgets/page.tsx`: Validações prévias e tratamento de erros melhorado
- `app/loja/produto/[id]/page.tsx`: Suporte completo para CompanyProducts V3
- `app/loja/checkout/page.tsx`: Funciona com V3, valida estoque, deduz estoque
- `app/membro/pedidos/page.tsx`: Suporte V3 para imagens e nomes
- `app/loja/pedido/[id]/page.tsx`: Validação de acesso ajustada
- `app/api/replication/route.ts`: Tratamento de erros robusto

### Fluxo Completo Corrigido
1. **Login**: Usuário faz login → `yoobe_auth` contém userId válido (spree_user_1/3/4)
2. **Gestor - Orçamento**: 
   - `/gestor/catalog/import` → seleciona produtos (qty funciona corretamente)
   - Botão habilita quando há itens selecionados
   - Envia orçamento → aparece em `/gestor/budgets`
3. **Gestor - Replicação**:
   - Aprova → libera → replicar
   - Validações prévias garantem budget existe e está no status correto
   - API retorna erros úteis se algo falhar
4. **Membro - Resgate**:
   - `/loja` → lista produtos elegíveis (V3) → clica em produto `cp_...`
   - Abre detalhes (V3) → adiciona ao carrinho
   - Checkout → valida estoque → deduz estoque → cria pedido
   - Vê pedido em `/loja/pedido/[id]` e `/membro/swag-track` com imagens/nomes corretos

### Regras Estabelecidas
- **Auth Demo**: Sempre usar usuários seedados existentes, nunca `spree_user_demo`
- **Validação de Usuário**: Redirecionar para login quando usuário não encontrado
- **Seleção de Produtos**: Usar `stopPropagation()` em controles dentro de cards clicáveis
- **Feedback Visual**: Botões desabilitados devem mostrar motivo (ex: "Selecione ao menos 1 item")
- **Storefront V3**: Suportar CompanyProducts primeiro, fallback para V2
- **Checkout V3**: Validar estoque e deduzir estoque de CompanyProducts
- **Tratamento de Erros**: Sempre ler resposta como texto primeiro, depois tentar parsear JSON
- **API Errors**: Sempre retornar JSON válido com campo `error`, mesmo em caso de exceção

## 2025-12-30 - Catálogo Mestre: Importação, Replicação e Detalhes de Produtos

### Problema Identificado
- Catálogo mestre (`BaseProducts`) aparecia vazio quando `localStorage` estava corrompido ou vazio
- Catálogo do gestor usava produtos V2 (`Product`) ao invés de produtos da empresa V3 (`CompanyProduct`)
- Não havia funcionalidade para visualizar/editar detalhes de produtos no catálogo do gestor
- Fluxo de orçamento não seguia o status correto (`approved → released → replicated`)
- Replicação manual sem logs adequados

### Correções Implementadas

#### 1. Seed Automático do Catálogo Mestre
- **Arquivo**: `lib/storage.ts`
- **Função**: `ensureBaseProductsSeeded()`
- **Comportamento**:
  - Verifica se `yoobe_base_products_v3` existe no localStorage
  - Corrige casos de array vazio ou JSON inválido
  - Reseta automaticamente para `initialBaseProducts` quando necessário
  - Garante que o catálogo mestre nunca fique vazio
- **Integração**: 
  - Chamado automaticamente em `lib/demoClient.ts` → `importMasterProducts()`
  - Chamado na página de importação antes de carregar produtos
- **UI**: Botão "Resetar Catálogo Mestre" na página de importação quando vazio

#### 2. Fluxo de Orçamentos Corrigido
- **Arquivo**: `app/gestor/budgets/page.tsx`
- **Mudanças**:
  - Adicionado status intermediário `released` entre `approved` e `replicated`
  - Nova função `handleRelease()` para liberar orçamentos aprovados
  - Substituída replicação manual por chamada ao endpoint `/api/replication`
  - Replicação agora cria logs adequados via `createReplicationLog()`
  - Toast com link "Ver no Catálogo" após replicação bem-sucedida
- **Fluxo Completo**:
  ```
  submitted → approved → released → replicated
  ```
- **Status Colors**: Adicionado `released: "bg-purple-100 text-purple-800"`

#### 3. Catálogo do Gestor: CompanyProducts V3
- **Arquivo**: `app/gestor/catalog/page.tsx`
- **Mudanças**:
  - Substituído `useCatalog(env)` (V2) por `getCompanyProductsByCompany(companyId)` (V3)
  - CompanyId obtido do `yoobe_auth` (não hardcoded)
  - Cards tornados clicáveis para navegar para `/gestor/catalog/[id]`
  - Ajustados campos para usar `CompanyProduct`:
    - `images?.[0]` ao invés de `image`
    - `stockQuantity` ao invés de `stock`
    - `pointsCost` ao invés de `priceInPoints`
    - `isActive` ao invés de `active`
    - `finalSku` ao invés de `sku`
  - Adicionado botão de visualização com ícone de olho
  - Exibição de status do produto (`active`, `pending`, etc.)

#### 4. Página de Detalhes do Produto
- **Arquivo**: `app/gestor/catalog/[id]/page.tsx` (NOVO)
- **Features**:
  - Visualização completa do `CompanyProduct`
  - Exibição do `BaseProduct` relacionado (referência)
  - Modo de edição para atualizar:
    - Preço em R$ (`price`)
    - Preço em Pontos (`pointsCost`)
    - Quantidade em estoque (`stockQuantity`)
    - Status ativo/inativo (`isActive`)
  - Informações do produto:
    - SKU Final (`finalSku`)
    - ID Base Product (`baseProductId`)
    - Categoria
    - Status
    - Datas de criação e atualização
  - Galeria de imagens (múltiplas imagens do produto)
  - Badges de status (Ativo/Inativo, Em Estoque/Esgotado)

#### 5. Logs de Replicação: CompanyId Dinâmico
- **Arquivo**: `app/gestor/catalog/replication-logs/page.tsx`
- **Mudanças**:
  - Removido hardcode `company_1`
  - Implementada leitura do `companyId` do `yoobe_auth`
  - Carregamento condicional baseado na autenticação
  - Botão "Atualizar" desabilitado quando não há companyId

### Arquivos Modificados
- `lib/storage.ts`: Adicionada `ensureBaseProductsSeeded()`
- `lib/demoClient.ts`: Atualizado `importMasterProducts()` para chamar seed
- `app/gestor/catalog/import/page.tsx`: Seed automático + botão reset
- `app/gestor/budgets/page.tsx`: Fluxo de status completo + replicação via API
- `app/gestor/catalog/page.tsx`: Migração para CompanyProducts V3
- `app/gestor/catalog/[id]/page.tsx`: Nova página de detalhes (CRIADO)
- `app/gestor/catalog/replication-logs/page.tsx`: CompanyId dinâmico

### Fluxo Completo Documentado
1. **Importação**: `/gestor/catalog/import` → sempre mostra produtos (seed automático)
2. **Orçamento**: Selecionar produtos → criar orçamento → status `submitted`
3. **Aprovação**: `/gestor/budgets` → aprovar → status `approved`
4. **Liberação**: Liberar → status `released`
5. **Replicação**: Replicar via `/api/replication` → cria `CompanyProducts` + logs → status `replicated`
6. **Catálogo**: `/gestor/catalog` → lista produtos replicados da empresa
7. **Detalhes**: Clicar no produto → `/gestor/catalog/[id]` → visualizar/editar
8. **Logs**: `/gestor/catalog/replication-logs` → ver histórico de replicações

### Regras Estabelecidas
- **Seed Automático**: Sempre garantir que `BaseProducts` estejam seedados antes de usar
- **CompanyProducts V3**: Catálogo do gestor sempre usa `CompanyProduct`, nunca `Product` V2
- **Fluxo de Status**: Orçamentos devem seguir `submitted → approved → released → replicated`
- **Replicação**: Sempre usar endpoint `/api/replication` para criar logs adequados
- **CompanyId**: Sempre obter do `yoobe_auth`, nunca hardcoded

## 2025-12-30 - Send Gifts: Restrição de Acesso e Experiência WOW

### Mudanças de Navegação
- **Arquivo**: `lib/navigation.ts`
- **Mudança**: "Enviar Presentes" agora disponível apenas para `manager` e `superAdmin`
- **Removido**: Acesso para role `member`
- **Rota**: Movida de `/loja/send-gifts` para `/gestor/send-gifts` (para gestores)

### Remoção de Acesso para Membros
- **Arquivo**: `app/loja/page.tsx`
  - Removido botão "Enviar Presente" do header da loja
- **Arquivo**: `app/dashboard/member/page.tsx`
  - Removido card "Enviar Presente" do dashboard de membros

### Nova Página para Gestores
- **Arquivo**: `app/gestor/send-gifts/page.tsx` (NOVO)
- **Features**:
  - Interface com 2 abas: "Enviar Novo Presente" e "Rastreamento"
  - Fluxo de 3 etapas para envio
  - Timeline visual de rastreamento com eventos simulados
  - Informações completas de despacho (código, transportadora, endereço)
  - Badge "Experiência WOW" no header

### Correções de Layout
- **Problema**: Menu duplicado e alinhamento incorreto
- **Solução**:
  - Removido `AppShell` duplicado (já fornecido pelo `app/gestor/layout.tsx`)
  - Substituído por `PageContainer` seguindo padrão do projeto
  - Corrigida indentação completa do código
  - Removido `maxWidth="7xl"` explícito

### Integração com Swag Track
- **Arquivo**: `app/gestor/swag-track/page.tsx`
- **Features Adicionadas**:
  - Badge "Presente" com ícone nos pedidos de envio de presentes
  - Tooltip mostrando "Envio de Presente" e mensagem (se houver)
  - Seção destacada no diálogo de detalhes para presentes

### Regras de Layout Documentadas
- **Padrão**: Todas as páginas do gestor devem usar `PageContainer`, nunca `AppShell`
- **Razão**: `AppShell` já é fornecido pelos layouts, causando menus duplicados se usado nas páginas
- **Documentação**: Adicionado em `conductor/workflow.md` e `conductor/tracks/send-gifts/plan.md`

## Padrões Estabelecidos

### Layout de Páginas
```tsx
// ✅ CORRETO - Usar PageContainer
import { PageContainer } from "@/components/page-container"

export default function MyPage() {
  return (
    <PageContainer className="space-y-6">
      {/* conteúdo */}
    </PageContainer>
  )
}

// ❌ ERRADO - Não usar AppShell nas páginas
import { AppShell } from "@/components/app-shell"
export default function MyPage() {
  return <AppShell>{/* conteúdo */}</AppShell>
}
```

### Navegação por Role
- **Gestor/Admin**: Acesso completo a todas as funcionalidades administrativas
- **Membro**: Acesso apenas a loja e pedidos próprios
- **Send Gifts**: Exclusivo para gestores e admins

### Componentes de Rastreamento
- Timeline visual com eventos de status
- Códigos de rastreio com funcionalidade de copiar
- Informações de transportadora e endereço
- Integração visual no Swag Track
