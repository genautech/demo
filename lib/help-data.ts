export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  role: "manager" | "member" | "all";
  category: "features" | "models" | "fields" | "technical";
  media?: {
    type: "image" | "gif" | "video";
    url: string;
  };
  tourId?: string; // ID do tour relacionado se houver
  keywords?: string[]; // Palavras-chave para busca
}

export const HELP_TOPICS: HelpTopic[] = [
  // ===========================================
  // GESTOR - FEATURES (Dashboard & Métricas)
  // ===========================================
  {
    id: "manager-dashboard",
    title: "Dashboard & Métricas",
    description: "Visão panorâmica do seu negócio em tempo real.",
    content: `O Dashboard do Gestor é o coração da plataforma. Aqui você acompanha:

• Volume de pedidos (novos, em processamento, entregues)
• Status do estoque (produtos com baixo estoque, mais vendidos)
• Saúde financeira da carteira de Pontos
• Engajamento dos colaboradores (níveis, conquistas)
• Gráficos de tendência de vendas

Use as métricas para tomar decisões baseadas em dados sobre quais produtos estão performando melhor e onde investir em estoque.`,
    role: "manager",
    category: "features",
    media: {
      type: "image",
      url: "/tour/dashboard-metrics.svg"
    },
    tourId: "manager-dashboard",
    keywords: ["dashboard", "métricas", "relatórios", "kpis", "indicadores"]
  },

  // ===========================================
  // GESTOR - Landing Pages
  // ===========================================
  {
    id: "landing-pages",
    title: "Landing Pages & Wizard",
    description: "Crie páginas de campanha e onboarding em minutos.",
    content: `Com o Wizard de Landing Pages, você cria experiências personalizadas em 4 passos simples:

**Passo 1 - Identidade:**
• Título e slug (URL amigável)
• Tipo: Onboarding ou Campanha
• Banner e cores da marca

**Passo 2 - Conteúdo:**
• Mensagem de boas-vindas
• Texto do botão CTA (Call-to-Action)

**Passo 3 - Produtos:**
• Seleção manual ou com ajuda da IA
• Destaque de itens especiais

**Passo 4 - Tags & Compartilhamento:**
• Tags automáticas para segmentação
• URL pronta para compartilhar

Casos de uso: Kit de boas-vindas, campanhas sazonais, hotsites de eventos.`,
    role: "manager",
    category: "features",
    media: {
      type: "image",
      url: "/tour/landing-page-overview.svg"
    },
    tourId: "manager-landing-pages",
    keywords: ["landing", "página", "onboarding", "campanha", "hotsite", "wizard"]
  },

  // ===========================================
  // GESTOR - Catálogo
  // ===========================================
  {
    id: "catalog-management",
    title: "Gestão de Catálogo",
    description: "Importe e personalize produtos do Catálogo Master.",
    content: `Você não precisa criar produtos do zero. O fluxo é:

1. **Catálogo Master** → Base de produtos disponíveis globalmente
2. **Importação** → Escolha quais produtos deseja na sua loja
3. **Personalização** → Ajuste preços em Pontos, estoque e tags

Campos importantes de cada produto:
• Nome e descrição
• SKU (código único)
• Preço em moeda e em Pontos
• Estoque disponível
• Categoria e tags de visibilidade
• Imagens (até 5 por produto)

Dica: Use tags para criar catálogos segmentados (ex: "Diretoria", "Vendas", "Tech").`,
    role: "manager",
    category: "features",
    media: {
      type: "gif",
      url: "/tour/catalog-management.svg"
    },
    tourId: "manager-catalog",
    keywords: ["catálogo", "produtos", "importar", "master", "estoque"]
  },

  // ===========================================
  // GESTOR - Orçamentos
  // ===========================================
  {
    id: "budget-workflow",
    title: "Fluxo de Orçamentos",
    description: "Aprovação e controle de pedidos corporativos.",
    content: `O sistema de orçamentos permite planejar compras em larga escala com um fluxo de aprovação:

**Estados do Orçamento:**
1. **Draft** → Rascunho em criação
2. **Submitted** → Enviado para aprovação
3. **Reviewed** → Em análise pelo aprovador
4. **Approved** → Aprovado, aguardando liberação
5. **Released** → Liberado para execução
6. **Replicated** → Produtos adicionados ao estoque

**Campos do Orçamento:**
• Nome e descrição
• Lista de produtos e quantidades
• Valor total estimado
• Responsável e aprovador
• Data de validade

Ideal para: compras de kits sazonais, reposição planejada, eventos corporativos.`,
    role: "manager",
    category: "features",
    keywords: ["orçamento", "budget", "aprovação", "workflow", "compras"]
  },

  // ===========================================
  // GESTOR - Gestão de Usuários
  // ===========================================
  {
    id: "user-management",
    title: "Gestão de Usuários",
    description: "Cadastre e gerencie colaboradores da empresa.",
    content: `A área de usuários permite gerenciar todos os colaboradores:

**Campos do Usuário:**
• Nome e e-mail (login)
• Telefone e endereço
• Tags de segmentação
• Saldo de Pontos
• Nível de gamificação
• Histórico de pedidos

**Ações disponíveis:**
• Adicionar/remover tags
• Creditar Pontos manualmente
• Visualizar histórico de transações
• Exportar lista para CSV
• Importar usuários em lote

Dica: Use tags para criar grupos (ex: "Aniversariantes", "Alta Performance").`,
    role: "manager",
    category: "features",
    keywords: ["usuários", "colaboradores", "membros", "cadastro", "tags"]
  },

  // ===========================================
  // GESTOR - Wallet & Ledger
  // ===========================================
  {
    id: "wallet-ledger",
    title: "Wallet & Ledger",
    description: "Controle financeiro de Pontos e transações.",
    content: `O Wallet centraliza todas as movimentações financeiras de pontos:

**Funcionalidades:**
• Saldo total de Pontos na empresa
• Saldo individual por usuário
• Histórico completo de transações (ledger)
• Créditos e débitos detalhados

**Tipos de Transação:**
• Crédito manual (bônus, premiação)
• Crédito automático (cashback de compra)
• Débito (uso no checkout)
• Estorno (cancelamento de pedido)

Cada transação registra: data/hora, valor, descrição, referência do pedido (se houver).`,
    role: "manager",
    category: "features",
    keywords: ["wallet", "carteira", "ledger", "transações", "saldo", "pontos"]
  },

  // ===========================================
  // GESTOR - Pedidos
  // ===========================================
  {
    id: "order-management",
    title: "Gestão de Pedidos",
    description: "Acompanhe e processe pedidos dos colaboradores.",
    content: `A área de pedidos oferece visão completa do ciclo de vida:

**Estados do Pedido:**
• cart → Em criação (carrinho)
• payment → Aguardando pagamento
• complete → Finalizado
• shipped → Enviado
• delivered → Entregue
• canceled → Cancelado

**Informações do Pedido:**
• Número único (YOO-XXXX)
• Data de criação
• Usuário e endereço de entrega
• Itens e quantidades
• Valor total e Pontos utilizados
• Código de rastreio (quando enviado)

Ações: Atualizar status, adicionar rastreio, cancelar, reembolsar Pontos.`,
    role: "manager",
    category: "features",
    keywords: ["pedidos", "orders", "status", "rastreio", "entrega"]
  },

  // ===========================================
  // GESTOR - Envio de Presentes
  // ===========================================
  {
    id: "gift-sending",
    title: "Envio de Presentes",
    description: "Agende presentes para colaboradores especiais.",
    content: `Surpreenda colaboradores com presentes personalizados:

**Funcionalidades:**
• Seleção de destinatários (individual ou grupo por tag)
• Escolha de produtos do catálogo
• Mensagem personalizada
• Agendamento para data futura
• Recomendações de IA baseadas no perfil

**Casos de Uso:**
• Aniversários
• Tempo de casa (1 ano, 5 anos, etc.)
• Metas atingidas
• Datas comemorativas

O sistema pode sugerir presentes baseado no histórico e preferências do colaborador.`,
    role: "manager",
    category: "features",
    keywords: ["presentes", "gifts", "aniversário", "reconhecimento", "premiação"]
  },

  // ===========================================
  // GESTOR - Configurações
  // ===========================================
  {
    id: "company-settings",
    title: "Configurações da Empresa",
    description: "Personalize a experiência da sua loja corporativa.",
    content: `Nas configurações você define a identidade da sua loja:

**Identidade Visual:**
• Nome da empresa
• Logo (PNG/SVG)
• Cor primária e secundária
• Banner da loja

**Configurações de Pontos:**
• Nome da moeda (padrão: Pontos)
• Taxa de conversão (R$ → Pontos)
• Multiplicadores por nível

**Funcionalidades:**
• Habilitar/desabilitar gamificação
• Ativar tours guiados
• Configurar integrações (API)

Mudanças são aplicadas instantaneamente em toda a plataforma.`,
    role: "manager",
    category: "features",
    keywords: ["configurações", "settings", "empresa", "logo", "cores", "personalização"]
  },

  // ===========================================
  // MEMBRO - FEATURES
  // ===========================================
  {
    id: "member-store",
    title: "Loja de Swag",
    description: "Navegue e resgate produtos incríveis.",
    content: `A loja é onde você escolhe seus produtos:

**Navegação:**
• Busca por nome ou SKU
• Filtros por categoria
• Ordenação por preço ou popularidade
• Grid ou lista de visualização

**Card do Produto:**
• Foto principal
• Nome e descrição curta
• Preço em Pontos
• Estoque disponível
• Botão "Adicionar ao Carrinho"

**Página do Produto:**
• Galeria de imagens
• Descrição completa
• Seleção de variantes (tamanho, cor)
• Produtos relacionados

Dica: Produtos com a tag "destaque" aparecem no topo!`,
    role: "member",
    category: "features",
    media: {
      type: "image",
      url: "/tour/member-store.svg"
    },
    tourId: "member-store",
    keywords: ["loja", "store", "produtos", "comprar", "carrinho"]
  },

  // ===========================================
  // MEMBRO - Checkout
  // ===========================================
  {
    id: "member-checkout",
    title: "Checkout & Pagamento",
    description: "Finalize seu pedido de forma rápida e segura.",
    content: `O checkout é simples e direto:

**Etapas:**
1. **Carrinho** → Revise os itens selecionados
2. **Endereço** → Confirme ou adicione endereço de entrega
3. **Pagamento** → Use seus Pontos (parcial ou total)
4. **Confirmação** → Pedido criado com sucesso!

**Validações Automáticas:**
• Saldo de Pontos suficiente
• Estoque disponível
• Endereço completo

Após a compra, você recebe um número de pedido (YOO-XXXX) para acompanhamento.`,
    role: "member",
    category: "features",
    keywords: ["checkout", "pagamento", "carrinho", "compra", "pedido"]
  },

  // ===========================================
  // MEMBRO - Meus Pedidos
  // ===========================================
  {
    id: "member-orders",
    title: "Meus Pedidos",
    description: "Acompanhe o status das suas compras.",
    content: `Visualize todo o histórico de pedidos:

**Informações Exibidas:**
• Número do pedido
• Data da compra
• Status atual (ícone colorido)
• Valor total em Pontos
• Itens comprados

**Status Possíveis:**
• 🟡 Processando → Pedido recebido
• 🔵 Enviado → Em trânsito
• 🟢 Entregue → Recebido com sucesso
• 🔴 Cancelado → Pedido cancelado

Clique no pedido para ver detalhes completos e código de rastreio.`,
    role: "member",
    category: "features",
    keywords: ["pedidos", "histórico", "rastreio", "status", "entrega"]
  },

  // ===========================================
  // MEMBRO - Gamificação
  // ===========================================
  {
    id: "gamification-levels",
    title: "Níveis & Cashback",
    description: "Suba de nível e ganhe mais Pontos.",
    content: `Nosso sistema de gamificação recompensa seu engajamento:

**Níveis (e multiplicadores de cashback):**
• 🥉 Bronze (1.0x) → 0+ Pontos acumulados
• 🥈 Prata (1.1x) → 1.000+ Pontos acumulados
• 🥇 Ouro (1.25x) → 5.000+ Pontos acumulados
• 💎 Platina (1.5x) → 15.000+ Pontos acumulados
• 👑 Diamante (2.0x) → 50.000+ Pontos acumulados

**Como funciona o cashback:**
A cada 1 em moeda gasto, você ganha 10 Pontos base, multiplicado pelo seu nível. Ex: Nível Ouro ganha 12.5 Pontos por unidade.

**Conquistas:**
Desbloqueie badges por ações especiais (primeira compra, 10 pedidos, etc.).`,
    role: "member",
    category: "features",
    media: {
      type: "gif",
      url: "/tour/member-gamification.svg"
    },
    tourId: "member-profile",
    keywords: ["gamificação", "níveis", "cashback", "conquistas", "badges"]
  },

  // ===========================================
  // MEMBRO - Perfil
  // ===========================================
  {
    id: "member-profile",
    title: "Meu Perfil",
    description: "Gerencie suas informações pessoais.",
    content: `Seu perfil centraliza todas as suas informações:

**Dados Pessoais:**
• Nome completo
• E-mail (login)
• Telefone
• Foto de perfil

**Endereços:**
• Adicione múltiplos endereços
• Defina endereço padrão
• Edite ou exclua quando necessário

**Estatísticas:**
• Saldo atual de Pontos
• Nível de gamificação
• Total de pedidos realizados
• Conquistas desbloqueadas

Mantenha seus dados atualizados para receber suas encomendas sem problemas!`,
    role: "member",
    category: "features",
    keywords: ["perfil", "dados", "endereço", "configurações", "conta"]
  },

  // ===========================================
  // MODELOS DE CLIENTE
  // ===========================================
  {
    id: "model-onboarding",
    title: "Modelo: Onboarding Contínuo",
    description: "Foco em dar as boas-vindas a novos talentos.",
    content: `Ideal para empresas que contratam recorrentemente:

**Como funciona:**
1. Gestor cria uma Landing Page de Onboarding
2. Define o "Kit de Boas-Vindas" com produtos padrão
3. RH envia o link para novos colaboradores
4. Colaborador acessa, escolhe tamanhos e confirma
5. Pedido é criado automaticamente

**Benefícios:**
• Processo automatizado e escalável
• Experiência personalizada desde o dia 1
• Redução de trabalho manual do RH
• Registro de todas as entregas

Produtos sugeridos: camiseta, caderno, caneca, mochila.`,
    role: "all",
    category: "models",
    keywords: ["onboarding", "boas-vindas", "novos", "kit", "rh"]
  },
  {
    id: "model-loyalty",
    title: "Modelo: Recompensa & Performance",
    description: "Foco em engajamento e metas atingidas.",
    content: `Utiliza intensamente o sistema de Pontos e Gamificação:

**Como funciona:**
1. Gestores definem metas (vendas, entregas, etc.)
2. Ao atingir metas, colaborador recebe Pontos
3. Colaborador usa Pontos para "comprar" prêmios na loja
4. Sistema de níveis incentiva engajamento contínuo

**Tipos de Premiação:**
• Metas de vendas batidas
• Tempo de casa (aniversário na empresa)
• Indicação de novos colaboradores
• Reconhecimento por pares

**Benefícios:**
• Engajamento mensurável
• Autonomia do colaborador na escolha do prêmio
• Cultura de meritocracia`,
    role: "all",
    category: "models",
    keywords: ["loyalty", "recompensa", "metas", "performance", "premiação"]
  },
  {
    id: "model-corporate-kits",
    title: "Modelo: Kits Corporativos",
    description: "Distribuição de kits para eventos e campanhas.",
    content: `Perfeito para eventos e campanhas sazonais:

**Casos de Uso:**
• Kit de Natal
• Kit de Aniversário da Empresa
• Brindes para eventos
• Uniformes e equipamentos

**Como funciona:**
1. Gestor cria orçamento com os itens do kit
2. Orçamento é aprovado
3. Produtos são adicionados ao estoque
4. Distribuição via Landing Page ou pedido direto

**Vantagens:**
• Controle de orçamento antes da compra
• Visibilidade do estoque em tempo real
• Histórico completo de distribuições`,
    role: "all",
    category: "models",
    keywords: ["kits", "eventos", "campanhas", "natal", "corporativo"]
  },

  // ===========================================
  // CAMPOS E CONCEITOS
  // ===========================================
  {
    id: "field-sku",
    title: "SKU (Stock Keeping Unit)",
    description: "O DNA do seu produto.",
    content: `O SKU é um código identificador único para cada item:

**Para que serve:**
• Identificação única no sistema e ERP
• Controle de variantes (cor, tamanho)
• Rastreabilidade de estoque
• Integração com fornecedores

**Boas Práticas:**
• Use padrões consistentes (ex: CAM-AZU-M = Camiseta Azul M)
• Inclua categoria, atributos e variante
• Evite caracteres especiais
• Mantenha comprimento padronizado

**Exemplo:**
MOCH-EXE-PRETA-001 = Mochila Executiva Preta, lote 001`,
    role: "all",
    category: "fields",
    keywords: ["sku", "código", "identificador", "produto", "estoque"]
  },
  {
    id: "concept-pontos",
    title: "Pontos",
    description: "A moeda oficial do engajamento.",
    content: `Pontos são os pontos virtuais da plataforma:

**Características:**
• Moeda interna configurável por empresa
• Nome personalizável (pode ser "Coins", "Stars", etc.)
• Taxa de conversão definida pelo gestor

**Como Ganhar:**
• Cashback em compras (automático)
• Crédito manual pelo gestor (premiação)
• Conquistas e metas atingidas

**Como Usar:**
• Desconto parcial no checkout
• Pagamento total de produtos
• Saldo nunca expira (configurável)

**Regra Base:**
1 em moeda = 10 Pontos (multiplicado pelo nível do usuário)`,
    role: "all",
    category: "fields",
    keywords: ["pontos", "moeda", "saldo", "cashback"]
  },
  {
    id: "field-tags",
    title: "Tags de Visibilidade",
    description: "Segmentação inteligente de produtos.",
    content: `Tags são palavras-chave para segmentação:

**Como Funcionam:**
• Produtos têm tags (ex: "Diretoria", "Vendas")
• Usuários têm tags (ex: "Diretoria", "SP")
• Produto só aparece se usuário tiver a mesma tag

**Casos de Uso:**
• Catálogo exclusivo para diretoria
• Produtos regionais (SP, RJ, etc.)
• Campanhas temporárias ("Natal2024")
• Grupos de trabalho específicos

**Dica:**
Se um produto não tiver nenhuma tag, ele fica visível para todos.`,
    role: "manager",
    category: "fields",
    keywords: ["tags", "segmentação", "visibilidade", "grupos", "filtros"]
  },
  {
    id: "field-company-id",
    title: "Company ID",
    description: "O identificador único da sua empresa.",
    content: `Cada empresa na plataforma tem um Company ID:

**Para que serve:**
• Isolamento completo de dados (multi-tenant)
• Separação de catálogo, usuários e pedidos
• Personalização de configurações

**Onde é usado:**
• Todas as requisições de API
• Identificação no banco de dados
• Logs e auditoria

O Company ID é gerado automaticamente no cadastro e nunca muda.`,
    role: "all",
    category: "fields",
    keywords: ["company", "empresa", "tenant", "identificador"]
  },
  {
    id: "field-order-states",
    title: "Estados do Pedido",
    description: "Entenda cada etapa do ciclo de vida.",
    content: `Um pedido passa por vários estados:

**Estados Principais:**
• **cart** → Carrinho em montagem
• **payment** → Aguardando pagamento/confirmação
• **complete** → Pedido finalizado e pago
• **shipped** → Enviado para entrega
• **delivered** → Entregue ao destinatário
• **canceled** → Cancelado (estorno de Pontos)

**Transições Permitidas:**
cart → payment → complete → shipped → delivered
(canceled pode ocorrer em qualquer ponto antes de delivered)

Cada mudança de estado gera um registro no histórico.`,
    role: "all",
    category: "fields",
    keywords: ["pedido", "status", "estados", "workflow", "ciclo"]
  },

  // ===========================================
  // TÉCNICO / NOTEBOOK
  // ===========================================
  {
    id: "tech-architecture",
    title: "Arquitetura Multi-Tenant",
    description: "Como isolamos e gerenciamos múltiplas empresas.",
    content: `Nossa arquitetura garante isolamento total entre clientes:

**Princípios:**
• Cada empresa tem um CompanyID único
• Todas as tabelas são particionadas por CompanyID
• Requisições são validadas no middleware

**Stack Técnica:**
• Frontend: Next.js 14 (App Router)
• UI: shadcn/ui + Tailwind CSS
• Estado: LocalStorage (demo) / API (produção)
• E-commerce: Spree Commerce 5
• ERP: Tiny ERP

**Benefícios:**
• Dados nunca se misturam entre clientes
• Escalabilidade horizontal
• Customização por tenant`,
    role: "all",
    category: "technical",
    keywords: ["arquitetura", "multi-tenant", "stack", "tecnologia"]
  },
  {
    id: "tech-integrations",
    title: "Integração Spree & Tiny",
    description: "O fluxo de dados entre e-commerce e ERP.",
    content: `A Yoobe orquestra múltiplos sistemas:

**Fluxo de Dados:**
1. **Yoobe (Frontend)** → Interface do usuário
2. **Spree Commerce** → Motor de e-commerce, catálogo, pedidos
3. **Tiny ERP** → Faturamento, estoque, logística

**Sincronizações:**
• Produtos: Spree ← → Yoobe
• Pedidos: Yoobe → Spree → Tiny
• Estoque: Tiny → Spree → Yoobe
• Rastreio: Tiny → Yoobe

**Webhooks:**
Eventos são propagados em tempo real via webhooks (ordem criada, estoque atualizado, etc.).`,
    role: "manager",
    category: "technical",
    keywords: ["spree", "tiny", "erp", "integração", "api", "webhook"]
  },
  {
    id: "tech-api-endpoints",
    title: "Endpoints da API",
    description: "Referência técnica para desenvolvedores.",
    content: `Principais endpoints disponíveis:

**Produtos:**
• GET /api/products → Lista produtos
• PATCH /api/products/[id] → Atualiza produto

**Pedidos:**
• GET /api/orders → Lista pedidos
• PATCH /api/orders → Atualiza status

**Orçamentos:**
• GET /api/budgets → Lista orçamentos
• POST /api/budgets → Cria orçamento
• PATCH /api/budgets → Atualiza orçamento

**Empresas:**
• GET /api/companies → Lista/busca empresas
• POST /api/companies → Cria empresa

**Autenticação:**
Todas as requisições requerem token no header Authorization.`,
    role: "manager",
    category: "technical",
    keywords: ["api", "endpoints", "rest", "integração", "developer"]
  },
  {
    id: "tech-data-models",
    title: "Modelos de Dados",
    description: "Estrutura das principais entidades.",
    content: `Principais interfaces TypeScript:

**Product:**
• id, name, description, sku
• price, priceInPoints
• images[], stock, category
• tags[], active, available

**Order:**
• id, number, state
• userId, email
• lineItems[], shipAddress
• trackingNumber, paidWithPoints

**User:**
• id, email, firstName, lastName
• points, level, achievements[]
• tags[], totalPurchases

**Company:**
• id, name, logo
• primaryColor, secondaryColor
• currencyName, pointsConversionRate`,
    role: "manager",
    category: "technical",
    keywords: ["modelos", "dados", "typescript", "interface", "schema"]
  },

  // ===========================================
  // ROLES E PERMISSÕES (DETALHADO)
  // ===========================================
  {
    id: "role-gestor-detailed",
    title: "Papel do Gestor (Manager)",
    description: "Todas as responsabilidades e poderes do administrador da loja.",
    content: `O **Gestor** (ou Manager) é o administrador da loja corporativa. Suas responsabilidades incluem:

**Gestão de Catálogo:**
• Importar produtos do Catálogo Master
• Definir preços em Pontos para cada produto
• Controlar estoque e disponibilidade
• Criar categorias e aplicar tags de visibilidade
• Ativar/desativar produtos

**Gestão de Usuários:**
• Cadastrar e remover colaboradores
• Atribuir tags de segmentação (Diretoria, Vendas, etc.)
• Creditar ou debitar Pontos manualmente
• Visualizar histórico de transações por usuário
• Importar/exportar listas de usuários

**Gestão de Orçamentos:**
• Criar orçamentos para compras em lote
• Aprovar ou rejeitar orçamentos de terceiros
• Liberar orçamentos aprovados para execução
• Acompanhar o ciclo Draft → Replicated

**Gestão de Pedidos:**
• Visualizar todos os pedidos da empresa
• Atualizar status (enviado, entregue, etc.)
• Adicionar códigos de rastreio
• Cancelar pedidos e processar estornos

**Configurações:**
• Personalizar identidade visual (logo, cores)
• Configurar nome da moeda e conversão
• Habilitar/desabilitar funcionalidades
• Gerenciar integrações com sistemas externos

**Acesso:**
O Gestor acessa a plataforma via /gestor e tem acesso completo ao painel administrativo.`,
    role: "all",
    category: "features",
    keywords: ["gestor", "manager", "administrador", "papel", "responsabilidades", "permissões"]
  },
  {
    id: "role-membro-detailed",
    title: "Papel do Membro (Colaborador)",
    description: "A experiência completa do usuário final na plataforma.",
    content: `O **Membro** (ou Colaborador) é o usuário final que utiliza a loja para resgatar produtos. Sua jornada inclui:

**Navegação na Loja:**
• Visualizar produtos disponíveis (filtrados por suas tags)
• Buscar por nome, categoria ou SKU
• Ver detalhes, fotos e descrições dos produtos
• Adicionar itens ao carrinho

**Processo de Compra:**
• Revisar carrinho com itens selecionados
• Confirmar ou adicionar endereço de entrega
• Pagar usando Pontos (total ou parcial)
• Receber confirmação com número do pedido

**Acompanhamento:**
• Visualizar histórico de pedidos
• Acompanhar status em tempo real
• Receber notificações de envio
• Acessar código de rastreio

**Gamificação:**
• Acumular Pontos com compras (cashback)
• Subir de nível (Bronze → Diamante)
• Desbloquear conquistas especiais
• Competir no ranking da empresa

**Perfil:**
• Gerenciar dados pessoais
• Adicionar múltiplos endereços
• Ver saldo de Pontos
• Consultar conquistas e nível

**Acesso:**
O Membro acessa a plataforma via /membro e vê apenas as funcionalidades de consumo.`,
    role: "all",
    category: "features",
    keywords: ["membro", "colaborador", "usuário", "papel", "experiência", "consumidor"]
  },

  // ===========================================
  // CENTRO DE CUSTO & FINANCIAL
  // ===========================================
  {
    id: "cost-center-explained",
    title: "Centro de Custo",
    description: "Organização financeira por departamento ou projeto.",
    content: `O **Centro de Custo** permite organizar os gastos por área da empresa:

**O que é:**
Um Centro de Custo é uma divisão lógica para controle financeiro. Exemplos:
• RH - Recursos Humanos
• MKT - Marketing
• TECH - Tecnologia
• VENDAS - Equipe Comercial

**Como funciona na Yoobe:**
1. **Criação** → Gestor define os centros de custo
2. **Atribuição** → Orçamentos são vinculados a um centro
3. **Rastreamento** → Todos os gastos são categorizados
4. **Relatórios** → Visão consolidada por centro

**Campos do Centro de Custo:**
• Código (ex: CC-001)
• Nome (ex: "Marketing Digital")
• Responsável (gestor do departamento)
• Limite de orçamento mensal/anual
• Status (ativo/inativo)

**Benefícios:**
• Controle de gastos por departamento
• Responsabilização clara
• Relatórios segmentados
• Planejamento orçamentário

**Exemplo de Uso:**
O RH cria um orçamento de R$ 50.000 para kits de onboarding, vinculado ao Centro de Custo "RH". Ao final do período, o relatório mostra quanto foi gasto apenas pelo RH.`,
    role: "manager",
    category: "features",
    keywords: ["centro de custo", "cost center", "financeiro", "departamento", "orçamento", "controle"]
  },
  {
    id: "budget-request-detailed",
    title: "Pedidos de Budget (Orçamento)",
    description: "Fluxo completo de solicitação e aprovação de orçamentos.",
    content: `Os **Pedidos de Budget** são solicitações formais para aquisição de produtos em lote.

**Fluxo Completo:**

**1. DRAFT (Rascunho)**
O solicitante inicia o orçamento:
• Define nome e descrição
• Seleciona produtos do catálogo
• Especifica quantidades
• Sistema calcula valor estimado

**2. SUBMITTED (Enviado)**
O solicitante envia para aprovação:
• Orçamento é bloqueado para edição
• Notificação enviada ao aprovador
• Status visível no painel

**3. REVIEWED (Em Análise)**
O aprovador analisa:
• Verifica itens e quantidades
• Confere disponibilidade de estoque
• Valida alinhamento com budget disponível
• Pode solicitar ajustes (volta para Draft)

**4. APPROVED (Aprovado)**
O aprovador aprova:
• Orçamento aguarda liberação
• Pode ser liberado imediatamente ou em data futura
• Notificação enviada ao solicitante

**5. RELEASED (Liberado)**
O gestor libera para execução:
• Produtos são reservados no estoque
• Processo de compra/reposição inicia
• Integração com ERP pode ser acionada

**6. REPLICATED (Replicado)**
Produtos chegam ao estoque:
• Itens são adicionados ao catálogo da empresa
• Disponíveis para distribuição
• Ciclo completo finalizado

**Campos do Orçamento:**
• ID único
• Nome e descrição
• Centro de custo vinculado
• Lista de itens (produto, quantidade, preço unitário)
• Valor total
• Solicitante e aprovador
• Datas (criação, submissão, aprovação)
• Status atual

**Dicas:**
• Planeje orçamentos com antecedência
• Agrupe itens semelhantes
• Considere sazonalidade (Natal, Páscoa)`,
    role: "manager",
    category: "features",
    keywords: ["budget", "orçamento", "aprovação", "solicitação", "workflow", "compras"]
  },

  // ===========================================
  // WORKFLOWS DETALHADOS
  // ===========================================
  {
    id: "workflow-onboarding",
    title: "Experiência de Onboarding",
    description: "Guia completo para configurar uma empresa do zero.",
    content: `A **Experiência de Onboarding** guia novos clientes na configuração inicial:

**Passo 1: Criação da Empresa**
• Nome da empresa
• Logo (upload ou URL)
• Cores primária e secundária
• Setor de atuação

**Passo 2: Configuração de Pontos**
• Nome da moeda (Pontos, Coins, Stars, etc.)
• Taxa de conversão (ex: R$ 1 = 10 Pontos)
• Multiplicadores por nível (gamificação)

**Passo 3: Importação de Catálogo**
• Seleção de produtos do Catálogo Master
• Ajuste de preços em Pontos
• Definição de estoque inicial
• Categorização e tags

**Passo 4: Cadastro de Usuários**
• Importação via CSV ou cadastro manual
• Atribuição de tags
• Crédito inicial de Pontos (opcional)

**Passo 5: Primeira Landing Page**
• Criação do kit de boas-vindas
• URL para compartilhar com novos colaboradores

**Passo 6: Revisão e Lançamento**
• Preview da loja
• Verificação de configurações
• Ativação da plataforma

**Tempo estimado:** 15-30 minutos

**Dica:** Use o Assistente da Demo para gerar produtos automaticamente baseados no perfil da empresa!`,
    role: "all",
    category: "models",
    keywords: ["onboarding", "configuração", "setup", "início", "wizard", "primeira vez"]
  },
  {
    id: "workflow-redemption",
    title: "Resgate & Meios de Pagamento",
    description: "Como colaboradores resgatam produtos usando Pontos.",
    content: `O **processo de resgate** é simples e intuitivo:

**Jornada do Colaborador:**

**1. Descoberta**
• Colaborador acessa a loja (/membro)
• Navega por categorias ou busca
• Visualiza produtos disponíveis (filtrados por suas tags)

**2. Seleção**
• Clica no produto desejado
• Vê fotos, descrição e preço em Pontos
• Seleciona variantes (tamanho, cor)
• Adiciona ao carrinho

**3. Carrinho**
• Revisa itens selecionados
• Ajusta quantidades
• Vê total em Pontos
• Verifica se tem saldo suficiente

**4. Checkout**
• Confirma endereço de entrega
• Escolhe forma de pagamento:
  - **100% Pontos** → Usa apenas saldo de Pontos
  - **Parcial** → Parte Pontos, parte outros meios (se habilitado)
• Confirma pedido

**5. Confirmação**
• Recebe número do pedido (YOO-XXXX)
• Pontos são debitados automaticamente
• Cashback é calculado e creditado

**Meios de Pagamento:**
• **Pontos** → Padrão, sempre disponível
• **Pix** → Opcional, configurável pelo gestor
• **Cartão** → Opcional, para pagamentos complementares

**Validações Automáticas:**
• Saldo de Pontos suficiente
• Estoque disponível
• Endereço válido e completo
• Limite de itens por pedido (se configurado)`,
    role: "all",
    category: "features",
    keywords: ["resgate", "pagamento", "checkout", "pontos", "compra", "carrinho"]
  },
  {
    id: "workflow-product-replication",
    title: "Replicação de Produtos",
    description: "Como o Catálogo Master popula lojas individuais.",
    content: `A **Replicação de Produtos** é o processo de trazer itens do Catálogo Master para uma loja específica:

**Conceito:**
• **Catálogo Master** → Base global com todos os produtos disponíveis
• **Catálogo da Empresa** → Produtos específicos de cada tenant
• **Replicação** → Cópia controlada do Master para a Empresa

**Fluxo de Replicação:**

**1. Navegação no Master**
• Gestor acessa Catálogo Master
• Visualiza todos os produtos disponíveis
• Filtra por categoria, preço ou disponibilidade

**2. Seleção**
• Marca produtos desejados
• Define quantidade inicial de estoque
• Ajusta preço em Pontos (pode ser diferente do sugerido)

**3. Personalização**
• Aplica tags de visibilidade
• Define categoria na loja
• Adiciona descrição personalizada (opcional)

**4. Importação**
• Clica em "Importar Selecionados"
• Sistema cria cópias no catálogo da empresa
• Produtos ficam imediatamente disponíveis

**Características:**
• Produtos replicados são independentes
• Alterações no Master não afetam cópias
• Cada empresa pode ter preços diferentes
• Estoque é controlado separadamente

**Casos de Uso:**
• Nova empresa: importa kit inicial
• Campanha sazonal: adiciona produtos temáticos
• Expansão: inclui novas categorias

**Dica:** Use a IA para sugerir produtos baseados no perfil da empresa!`,
    role: "manager",
    category: "features",
    keywords: ["replicação", "catálogo master", "importar", "produtos", "cópia"]
  },
  {
    id: "workflow-user-points-management",
    title: "Gestão de Usuários e Pontos",
    description: "Como gerenciar colaboradores e seus saldos.",
    content: `A **Gestão de Usuários e Pontos** permite controle total sobre colaboradores:

**Cadastro de Usuários:**

**Individual:**
• Nome completo
• E-mail (usado como login)
• Telefone
• Tags de segmentação

**Em Lote (CSV):**
• Upload de planilha
• Campos: email, nome, telefone, tags
• Validação automática de e-mails duplicados
• Relatório de importação

**Gestão de Pontos:**

**Creditar Pontos:**
• Selecione o usuário
• Informe o valor a creditar
• Adicione uma descrição (ex: "Bônus aniversário")
• Confirme a operação
• Transação registrada no ledger

**Debitar Pontos:**
• Selecione o usuário
• Informe o valor a debitar
• Adicione uma justificativa
• Confirme a operação
• Usado para correções ou penalizações

**Creditar em Lote:**
• Selecione múltiplos usuários (ou use tags)
• Defina valor igual para todos
• Útil para campanhas ou bônus coletivos

**Segmentação com Tags:**

**O que são Tags:**
Palavras-chave para agrupar usuários.

**Exemplos:**
• Departamento: "RH", "Vendas", "Tech"
• Cargo: "Diretoria", "Analista", "Estagiário"
• Região: "SP", "RJ", "Nacional"
• Especial: "Aniversariantes", "Top Performers"

**Como usar:**
1. Atribua tags aos usuários
2. Atribua as mesmas tags aos produtos
3. Usuário só vê produtos com tags compatíveis

**Relatórios:**
• Saldo total por usuário
• Histórico de transações
• Exportação para CSV/Excel`,
    role: "manager",
    category: "features",
    keywords: ["usuários", "pontos", "creditar", "debitar", "tags", "segmentação", "gestão"]
  },
  {
    id: "workflow-product-management",
    title: "Gestão de Produtos",
    description: "SKU, categorias, estoque e visibilidade.",
    content: `A **Gestão de Produtos** cobre todo o ciclo de vida dos itens:

**Estrutura do Produto:**

**Identificação:**
• Nome (ex: "Camiseta Básica Azul M")
• SKU (ex: "CAM-BAS-AZU-M")
• Descrição curta (exibida no card)
• Descrição longa (página do produto)

**Precificação:**
• Preço em moeda (R$) → referência
• Preço em Pontos → valor para resgate
• Custo (opcional) → para cálculo de margem

**Estoque:**
• Quantidade disponível
• Alerta de estoque baixo
• Reserva para orçamentos

**Mídia:**
• Até 5 imagens por produto
• Imagem principal (thumbnail)
• Ordem de exibição

**Categorização:**
• Categoria (Vestuário, Tecnologia, etc.)
• Tags de visibilidade
• Status (ativo/inativo)

**Padrão de SKU Recomendado:**
[CATEGORIA]-[ATRIBUTO]-[VARIANTE]-[LOTE]

Exemplos:
• MOCH-EXE-PRETA-001 → Mochila Executiva Preta
• CAM-POL-VER-GG → Camiseta Polo Verde GG
• CAN-TER-350ML → Caneca Térmica 350ml

**Variantes:**
Produtos com múltiplas opções (tamanho, cor) podem ser:
• SKUs separados (recomendado)
• Ou agrupados com seletor de variante

**Visibilidade:**
• Sem tags = visível para todos
• Com tags = visível apenas para usuários com as mesmas tags
• Inativo = não aparece na loja

**Ações em Lote:**
• Atualizar preços
• Aplicar tags
• Ativar/desativar
• Ajustar estoque`,
    role: "manager",
    category: "features",
    keywords: ["produtos", "sku", "estoque", "categorias", "gestão", "catálogo"]
  },

  // ===========================================
  // ROTEIRO DA DEMO
  // ===========================================
  {
    id: "demo-script",
    title: "Roteiro da Demo Completo",
    description: "Guia passo a passo para apresentar a plataforma.",
    content: `O **Roteiro da Demo** orienta apresentações comerciais:

**ABERTURA (2 min)**
"Vou mostrar como a Yoobe transforma a gestão de benefícios e reconhecimento da sua empresa."

**PERSONALIZAÇÃO (3 min)**
1. Clique em "Customizar Demo" na sidebar
2. Aplique o logo do cliente
3. Ajuste as cores da marca
4. Mostre a transformação instantânea

**VISÃO DO GESTOR (10 min)**

*Dashboard:*
"Aqui o gestor vê tudo em tempo real: pedidos, estoque, engajamento."

*Catálogo:*
"Produtos são importados do Catálogo Master. Ajustamos preços e disponibilidade."

*Usuários:*
"Colaboradores são segmentados por tags. Podemos creditar pontos a qualquer momento."

*Orçamentos:*
"Para compras em lote, usamos o fluxo de aprovação: Draft → Approved → Replicated."

**VISÃO DO COLABORADOR (5 min)**

*Troque para perspectiva Membro*

*Loja:*
"O colaborador vê apenas produtos para seu perfil. Interface simples e intuitiva."

*Checkout:*
"Pagamento 100% com Pontos. Confirma endereço e pronto!"

*Gamificação:*
"A cada compra, ganha cashback. Sobe de nível e ganha multiplicadores."

**FECHAMENTO (3 min)**
"A Yoobe reduz trabalho operacional, aumenta engajamento e dá autonomia aos colaboradores."

**DICAS:**
• Use o Assistente da Demo (✨) para tirar dúvidas
• Simule pedidos para mostrar o sistema "vivo"
• Prepare dados fictícios relevantes para o cliente`,
    role: "manager",
    category: "features",
    tourId: "demo-complete",
    keywords: ["demo", "roteiro", "apresentação", "vendas", "comercial", "script"]
  },

  // ===========================================
  // SIMULAÇÕES DE DEMO
  // ===========================================
  {
    id: "demo-simulate-order",
    title: "Simular Pedido em Massa",
    description: "Como mostrar o sistema processando múltiplos pedidos.",
    content: `Para uma demo de impacto, use o Yoobe AI Assistant:

**Como usar:**
1. Clique no ícone do robô (canto inferior direito)
2. Digite: "Simule 5 novos pedidos"
3. O sistema gera transações fictícias automaticamente

**O que acontece:**
• Pedidos são criados com produtos aleatórios
• Estoque é decrementado
• Métricas do dashboard são atualizadas
• Transações aparecem no ledger

Perfeito para mostrar a plataforma "viva" durante apresentações.`,
    role: "manager",
    category: "features",
    keywords: ["demo", "simular", "pedidos", "assistente", "ai"]
  },
  {
    id: "demo-custom-branding",
    title: "Personalização ao Vivo",
    description: "Troque a marca da plataforma durante a apresentação.",
    content: `Use o botão 'Customizar Demo' na sidebar:

**O que você pode alterar:**
• Nome da empresa
• Logo (upload ou URL)
• Cor primária
• Cor secundária

**Aplicação:**
• Mudanças são instantâneas
• Não recarrega a página
• Afeta toda a interface

**Dica para Demo:**
Antes da apresentação, prepare o logo do cliente. Durante a demo, aplique ao vivo para causar impacto!`,
    role: "manager",
    category: "features",
    keywords: ["demo", "personalização", "branding", "logo", "cores", "customizar"]
  },
  {
    id: "demo-perspective-switcher",
    title: "Trocar Perspectiva",
    description: "Veja a plataforma como Gestor ou Membro.",
    content: `O seletor de perspectiva permite alternar rapidamente:

**Como usar:**
• No header, clique no ícone de usuário/swap
• Escolha: Gestor, Membro ou Super Admin

**Para que serve:**
• Mostrar a visão do colaborador durante a demo
• Comparar funcionalidades entre perfis
• Demonstrar o controle de acesso

A troca é instantânea e mantém você logado.`,
    role: "manager",
    category: "features",
    keywords: ["demo", "perspectiva", "perfil", "gestor", "membro", "trocar"]
  }
];

/**
 * Busca tópicos de ajuda por texto
 */
export function searchHelpTopics(query: string, role?: "manager" | "member" | "all"): HelpTopic[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return HELP_TOPICS.filter(t => !role || t.role === role || t.role === "all");
  }

  return HELP_TOPICS.filter(topic => {
    // Filtrar por role se especificado
    if (role && topic.role !== role && topic.role !== "all") {
      return false;
    }

    // Buscar em título, descrição, conteúdo e keywords
    const searchableText = [
      topic.title,
      topic.description,
      topic.content,
      ...(topic.keywords || [])
    ].join(" ").toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

/**
 * Obtém tópicos por categoria
 */
export function getHelpTopicsByCategory(category: HelpTopic["category"], role?: "manager" | "member" | "all"): HelpTopic[] {
  return HELP_TOPICS.filter(topic => {
    if (topic.category !== category) return false;
    if (role && topic.role !== role && topic.role !== "all") return false;
    return true;
  });
}
