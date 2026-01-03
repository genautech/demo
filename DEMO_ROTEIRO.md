# Roteiro de Demo - Yoobe Corporate Store

## Visão Geral

**Público-alvo:** Decisores de negócio (C-level, gestores de RH, líderes de produto)  
**Duração:** 30 minutos  
**Objetivo:** Demonstrar como a plataforma Yoobe resolve problemas de gestão de loja corporativa, gamificação e integrações

---

## Storyline Principal

### Persona
Você é um gestor de RH de uma empresa de médio/grande porte que precisa:
- Reduzir custos operacionais com gestão de swag corporativo
- Aumentar engajamento dos colaboradores
- Automatizar processos de reconhecimento e incentivos
- Integrar com sistemas existentes (ERP, RH, etc.)

### Problema
Atualmente, sua empresa gasta muito tempo e dinheiro com:
- Gestão manual de catálogo de produtos
- Processos manuais de aprovação de orçamentos
- Falta de visibilidade sobre uso de benefícios
- Dificuldade em personalizar produtos por departamento/função

### Solução Yoobe
Uma plataforma completa que automatiza todo o ciclo: desde a criação de orçamentos até a entrega, com gamificação integrada e APIs para integração.

---

## Timeline Detalhada (30 minutos)

### 1. Abertura e Contexto (2 minutos)

**Script:**
> "Boa tarde! Hoje vou mostrar como a Yoobe transforma a gestão de loja corporativa. Vamos usar dados de demonstração de uma empresa fictícia chamada '4unik Ltda'. A plataforma que você verá é 100% funcional - tudo que mostrarmos pode ser implementado na sua empresa."

**Pontos-chave:**
- Apresentar o problema que a Yoobe resolve
- Explicar que usaremos dados de demo
- Destacar que é uma plataforma real e funcional

**Links:**
- `/login` - Página de login
- `/onboarding` - Onboarding inicial (se necessário)

---

### 2. Setup e Onboarding (4 minutos)

**Script:**
> "Vamos começar pelo processo de setup. A Yoobe foi projetada para ser configurada rapidamente. Veja como é simples conectar sua empresa e começar a usar."

**Passos:**
1. Acessar `/gestor/setup` - Mostrar o wizard de setup
2. Destacar os 6 passos principais:
   - Dados da empresa, logo, perfil
   - Catalog produtos que gostaria de usar, mas  avisar que pode alterar depois(importação de produtos)
   - Test Order (pedido de teste)
   - Go-Live (produção)

**Script:**
> "O processo de setup é guiado e leva menos de 30 minutos. Cada etapa tem validação automática e feedback em tempo real. Vamos ver como funciona a importação de catálogo..."

**Links:**
- `/gestor/setup` - Wizard principal
- `/gestor/setup/1-connect` - Configuração de API
- `/gestor/setup/2-catalog` - Importação de catálogo
- `/gestor/setup/3-wallet` - Configuração de wallet

**Destaques:**
- Automação do processo
- Validação em tempo real
- Feedback visual claro

---

### 3. Gestão de Catálogo (5 minutos)

**Script:**
> "Agora vamos ver como gerenciar o catálogo de produtos. A Yoobe permite importar produtos de um catálogo base, personalizar preços e estoque por empresa, e controlar visibilidade por tags."

**Passos:**
1. Acessar `/gestor/catalog` - Mostrar lista de produtos
2. Demonstrar:
   - Visualização de produtos replicados
   - Filtros e busca
   - Status de estoque
   - Tags e categorias

**Script:**
> "Veja como é fácil encontrar produtos. Você pode filtrar por categoria, buscar por nome ou SKU, e ver o estoque em tempo real. Cada produto pode ter tags que controlam quem pode vê-lo na loja."

3. Mostrar a loja do cliente: `/loja`
   - Destacar produtos visíveis
   - Explicar sistema de tags
   - Mostrar personalização de marca

**Script:**
> "Aqui está a loja do ponto de vista do colaborador. Veja como os produtos aparecem com a marca da empresa. O sistema de tags garante que cada pessoa veja apenas os produtos relevantes para ela."

**Links:**
- `/gestor/catalog` - Gestão de catálogo
- `/loja` - Loja do cliente
- `/loja/produto/[id]` - Página de produto

**Destaques:**
- Replicação automática de produtos
- Controle de visibilidade por tags
- Personalização de marca
- Gestão de estoque centralizada

---

### 4. Fluxo de Pedido e Checkout (6 minutos)

**Script:**
> "Agora vamos simular um pedido completo. O colaborador escolhe produtos, adiciona ao carrinho e finaliza a compra usando Pontos - nossa moeda virtual de gamificação."

**Passos:**
1. Na loja (`/loja`), adicionar produtos ao carrinho
2. Mostrar carrinho e saldo de Pontos
3. Ir para checkout (`/loja/checkout`)
4. Preencher endereço de entrega
5. Revisar pedido
6. Finalizar compra

**Script:**
> "O checkout é simples e intuitivo. O sistema valida automaticamente o saldo de Pontos, verifica estoque e processa o pedido. Veja como é rápido!"

7. Mostrar pedido criado: `/loja/pedido/[id]`
8. Acessar visão do gestor: `/gestor/orders`
9. Mostrar detalhes do pedido: `/gestor/orders/[id]`

**Script:**
> "Do lado do gestor, você tem visibilidade completa de todos os pedidos. Pode ver status, rastrear entregas e gerenciar o ciclo completo."

**Links:**
- `/loja` - Loja do cliente
- `/loja/checkout` - Checkout
- `/loja/pedido/[id]` - Status do pedido
- `/gestor/orders` - Lista de pedidos (gestor)
- `/gestor/orders/[id]` - Detalhes do pedido

**Destaques:**
- Checkout simplificado
- Validação automática de saldo e estoque
- Visibilidade completa para gestores
- Rastreamento de pedidos

---

### 5. Wallet e Orçamentos (4 minutos)

**Script:**
> "A Yoobe tem um sistema completo de gestão financeira. Vamos ver como funciona o wallet e o processo de orçamentos."

**Passos:**
1. Acessar `/gestor/wallet` - Mostrar wallet e ledger
2. Explicar:
   - Saldo de Pontos por usuário
   - Histórico de transações
   - Créditos e débitos

**Script:**
> "O wallet centraliza todas as transações. Você pode ver exatamente quanto cada colaborador tem em Pontos, quando ganhou e como gastou."

3. Acessar `/gestor/budgets` - Mostrar orçamentos
4. Demonstrar fluxo:
   - Criar orçamento
   - Adicionar produtos
   - Enviar para aprovação
   - Aprovar
   - Liberar
   - Replicar ao estoque

**Script:**
> "O processo de orçamento é totalmente automatizado. Você cria um orçamento, adiciona produtos, envia para aprovação. Uma vez aprovado e liberado, pode replicar todos os produtos para o estoque com um clique."

**Links:**
- `/gestor/wallet` - Wallet e ledger
- `/gestor/budgets` - Gestão de orçamentos
- `/membro/pedidos` - Pedidos do colaborador

**Destaques:**
- Gestão centralizada de saldos
- Processo de aprovação automatizado
- Replicação em massa de produtos
- Auditoria completa de transações

---

### 6. Gamificação (3 minutos)

**Script:**
> "A gamificação é um diferencial da Yoobe. Colaboradores ganham Pontos por ações, desbloqueiam conquistas e competem em rankings."

**Passos:**
1. Acessar `/membro/gamificacao` - Mostrar dashboard de gamificação
2. Demonstrar:
   - Níveis (Bronze, Prata, Ouro, Platina, Diamante)
   - Progresso para próximo nível
   - Conquistas desbloqueadas
   - Ranking de Pontos
   - Estatísticas pessoais

**Script:**
> "Veja como a gamificação engaja os colaboradores. Eles ganham Pontos por compras, desbloqueiam conquistas e podem ver seu progresso em tempo real. Isso aumenta significativamente o engajamento com a loja."

**Links:**
- `/membro/gamificacao` - Dashboard de gamificação
- `/components/gamification` - Componentes de gamificação

**Destaques:**
- Sistema de níveis progressivo
- Conquistas desbloqueáveis
- Rankings competitivos
- Estatísticas detalhadas

---

### 7. Integrações e APIs (4 minutos)

**Script:**
> "A Yoobe foi construída pensando em integração. Você pode conectar com seus sistemas existentes via APIs e webhooks."

**Passos:**
1. Acessar `/gestor/integrations` - Mostrar página de integrações
2. Demonstrar:
   - API Keys (se existir página)
   - Webhooks (se existir página)
   - Logs de integração (se existir página)

**Script:**
> "A plataforma oferece APIs RESTful completas para integração. Você pode sincronizar produtos, criar pedidos, consultar saldos - tudo via API. Além disso, webhooks notificam seu sistema sobre eventos importantes como novos pedidos ou mudanças de status."

3. Mostrar exemplo de API: `/api/demo/ai/route.ts` (se relevante)
4. Explicar casos de uso:
   - Sincronização com ERP
   - Integração com sistema de RH
   - Webhooks para notificações

**Links:**
- `/gestor/integrations` - Página de integrações
- `/api/replication/route.ts` - API de replicação (exemplo)
- `/api/orders/route.ts` - API de pedidos (exemplo)

**Destaques:**
- APIs RESTful completas
- Webhooks para eventos
- Documentação técnica disponível
- Logs de integração

---

### 8. Encerramento e Próximos Passos (2 minutos)

**Script:**
> "Vimos hoje como a Yoobe transforma a gestão de loja corporativa. A plataforma automatiza processos, aumenta engajamento através de gamificação e oferece integrações flexíveis."

**Resumo dos benefícios:**
- Redução de custos operacionais
- Aumento de engajamento
- Automação de processos
- Integração com sistemas existentes

**Call-to-action:**
> "Gostaria de agendar uma conversa para entender melhor as necessidades da sua empresa? Podemos fazer uma prova de conceito personalizada ou responder qualquer dúvida técnica."

**Próximos passos sugeridos:**
1. Agendar reunião de descoberta
2. Enviar proposta comercial
3. Configurar ambiente de teste
4. Apresentar casos de sucesso

---

## Variantes do Roteiro

### Versão Rápida (15 minutos)
Para apresentações curtas, focar em:
1. Setup (2min) - Destacar velocidade
2. Catálogo (3min) - Mostrar replicação
3. Pedido (4min) - Fluxo completo
4. Wallet/Budgets (3min) - Automação
5. Integrações (2min) - APIs
6. Encerramento (1min)

**Pular:** Gamificação (pode ser mencionada rapidamente)

### Versão Técnica (45 minutos)
Para equipes técnicas, adicionar:
1. Arquitetura da plataforma
2. Detalhes de APIs e webhooks
3. Estrutura de dados
4. Segurança e autenticação
5. Escalabilidade
6. Casos de uso avançados

**Adicionar:** Demonstração de código, exemplos de integração, troubleshooting

### Versão Executiva (20 minutos)
Para C-level, focar em:
1. Problema e solução (3min)
2. ROI e métricas (5min)
3. Demonstração rápida (8min)
4. Casos de sucesso (2min)
5. Próximos passos (2min)

**Focar:** Business value, ROI, métricas de sucesso

---

## Scripts de Fala Detalhados

### Abertura
> "Boa tarde! Obrigado por reservar este tempo. Hoje vou apresentar a Yoobe, uma plataforma completa para gestão de loja corporativa que automatiza processos, aumenta engajamento e reduz custos operacionais.
> 
> Vamos usar dados de demonstração de uma empresa fictícia, mas tudo que você verá é 100% funcional e pode ser implementado na sua empresa.
> 
> A apresentação dura cerca de 30 minutos, e ao final teremos tempo para perguntas. Vamos começar?"

### Transição entre seções
> "Agora que vimos [seção anterior], vamos explorar [próxima seção]. Este é um dos diferenciais da Yoobe..."

### Destaque de features
> "Uma coisa importante aqui é [feature]. Isso resolve [problema] porque [benefício]..."

### Encerramento
> "Vimos hoje como a Yoobe pode transformar a gestão de loja corporativa na sua empresa. Temos automação de processos, gamificação para engajamento e integrações flexíveis.
> 
> Gostaria de agendar uma conversa para entender melhor suas necessidades específicas? Podemos fazer uma prova de conceito personalizada ou responder qualquer dúvida técnica."

---

## Troubleshooting

### Problema: Dados não aparecem
**Solução:**
1. Verificar se está logado corretamente
2. Verificar se há dados seedados (usar `/api/replication` se necessário)
3. Limpar cache do navegador
4. Recarregar página

### Problema: Página não carrega
**Solução:**
1. Verificar conexão com internet
2. Verificar se o servidor está rodando
3. Verificar console do navegador para erros
4. Tentar em modo anônimo

### Problema: Pedido não é criado
**Solução:**
1. Verificar saldo de Pontos do usuário
2. Verificar estoque do produto
3. Verificar se endereço está completo
4. Verificar logs no console

### Problema: Produtos não aparecem na loja
**Solução:**
1. Verificar se produtos foram replicados
2. Verificar tags do usuário vs tags do produto
3. Verificar se produtos estão ativos
4. Verificar estoque disponível

### Problema: Gamificação não atualiza
**Solução:**
1. Verificar se pedido foi completado
2. Verificar se eventos foram emitidos
3. Recarregar página de gamificação
4. Verificar localStorage para dados de demo

---

## FAQs

### P: Quanto tempo leva para implementar?
**R:** O setup básico leva menos de 30 minutos. A integração completa depende da complexidade dos sistemas existentes, mas geralmente leva de 1 a 4 semanas.

### P: Preciso de conhecimento técnico?
**R:** Não. A interface é intuitiva e o processo de setup é guiado. Para integrações avançadas, nossa equipe pode ajudar.

### P: Como funciona a integração com nosso ERP?
**R:** A Yoobe oferece APIs RESTful completas. Você pode sincronizar produtos, criar pedidos e consultar dados. Também oferecemos webhooks para notificações em tempo real.

### P: E se precisarmos de customizações?
**R:** A plataforma é flexível e permite customizações. Podemos discutir suas necessidades específicas e avaliar a melhor abordagem.

### P: Como é o suporte?
**R:** Oferecemos suporte técnico via email, chat e documentação completa. Para clientes enterprise, oferecemos suporte dedicado.

### P: Quais são os custos?
**R:** Os custos variam conforme o volume de transações e funcionalidades. Vamos agendar uma conversa para entender suas necessidades e apresentar uma proposta personalizada.

---

## Checklist Pré-Demo

### Antes da Demo
- [ ] Verificar se servidor está rodando
- [ ] Verificar se há dados seedados
- [ ] Testar login e navegação básica
- [ ] Verificar se todas as rotas estão funcionando
- [ ] Preparar ambiente de apresentação (tela compartilhada, áudio)
- [ ] Ter links prontos para acesso rápido
- [ ] Preparar exemplos de casos de uso relevantes para o cliente

### Durante a Demo
- [ ] Manter ritmo (30 minutos)
- [ ] Permitir perguntas ao final de cada seção
- [ ] Destacar benefícios de negócio, não apenas features técnicas
- [ ] Adaptar foco conforme interesse do cliente
- [ ] Anotar dúvidas e objeções

### Após a Demo
- [ ] Agendar follow-up
- [ ] Enviar materiais complementares
- [ ] Responder perguntas pendentes
- [ ] Enviar proposta comercial (se aplicável)

---

## Links Rápidos

### Setup e Onboarding
- `/gestor/setup` - Wizard de setup
- `/gestor/setup/1-connect` - Configuração de API
- `/gestor/setup/2-catalog` - Importação de catálogo
- `/gestor/setup/3-wallet` - Configuração de wallet
- `/gestor/setup/4-webhooks` - Configuração de webhooks
- `/gestor/setup/5-test-order` - Pedido de teste
- `/gestor/setup/6-go-live` - Go-live

### Gestão
- `/gestor/catalog` - Catálogo de produtos
- `/gestor/orders` - Pedidos
- `/gestor/budgets` - Orçamentos
- `/gestor/wallet` - Wallet e ledger
- `/gestor/usuarios` - Usuários
- `/gestor/estoque` - Estoque

### Cliente
- `/loja` - Loja do cliente
- `/loja/checkout` - Checkout
- `/loja/pedido/[id]` - Status do pedido
- `/membro/pedidos` - Pedidos do colaborador
- `/membro/gamificacao` - Gamificação

### Integrações
- `/gestor/integrations` - Página de integrações
- `/api/replication` - API de replicação
- `/api/orders` - API de pedidos
- `/api/products` - API de produtos

---

## Notas Finais

- Sempre adapte o roteiro ao perfil do cliente
- Destaque features relevantes para o caso de uso específico
- Mantenha foco em benefícios de negócio, não apenas tecnologia
- Esteja preparado para perguntas técnicas e de negócio
- Use dados de demo realistas e relevantes
- Mantenha energia e entusiasmo durante toda a apresentação
