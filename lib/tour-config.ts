/**
 * Configuração de Tours Guiados Interativos
 * Tours educativos que explicam cada funcionalidade da plataforma em profundidade
 */

export interface TourStep {
  element: string // Seletor CSS ou ID do elemento
  popover: {
    title: string
    description: string
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
  }
  media?: {
    type: "image" | "gif" | "video"
    url: string
    alt?: string
  }
}

export interface TourConfig {
  id: string
  name: string
  description: string
  role: "manager" | "member" | "all"
  route: string // Rota onde o tour deve ser ativado
  steps: TourStep[]
}

export const TOUR_CONFIGS: TourConfig[] = [
  // ===========================================
  // TOUR DO GESTOR - DASHBOARD (EXPANDIDO)
  // ===========================================
  {
    id: "manager-dashboard",
    name: "Tour do Dashboard",
    description: "Conheça o painel de controle do gestor em detalhes",
    role: "manager",
    route: "/dashboard/manager",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🎯 Bem-vindo ao Dashboard do Gestor!",
          description: "Este é o seu <strong>centro de comando</strong>! Aqui você tem uma visão 360° de toda a operação da sua loja corporativa. Acompanhe métricas em tempo real, acesse atalhos rápidos e tome decisões baseadas em dados.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='shortcuts'], .grid",
        popover: {
          title: "⚡ Atalhos Rápidos - Produtividade Máxima",
          description: "<strong>Ações do dia-a-dia em 1 clique:</strong><br/><br/>• <strong>Landing Pages</strong>: Crie páginas de campanha<br/>• <strong>Catálogo</strong>: Importe novos produtos<br/>• <strong>Pedidos</strong>: Veja pendências<br/>• <strong>Usuários</strong>: Gerencie colaboradores<br/><br/>💡 <em>Dica: Os números mostram quantidades pendentes!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='metrics'], .stats, [class*='stat'], [class*='metric']",
        popover: {
          title: "📊 Métricas em Tempo Real",
          description: "<strong>KPIs essenciais da sua operação:</strong><br/><br/>• <strong>Total de Pedidos</strong>: Histórico completo<br/>• <strong>Produtos no Catálogo</strong>: Seu mix atual<br/>• <strong>Usuários Ativos</strong>: Engajamento da base<br/>• <strong>Valor Movimentado</strong>: GMV em pontos<br/><br/>🔄 <em>Atualização automática a cada minuto!</em>",
          side: "top",
        },
      },
      {
        element: "aside, [data-tour='sidebar'], nav[class*='sidebar']",
        popover: {
          title: "🧭 Menu de Navegação Completo",
          description: "<strong>Todas as áreas da plataforma:</strong><br/><br/>📦 <strong>Catálogo</strong> - Produtos e estoque<br/>🛒 <strong>Pedidos</strong> - Gestão de vendas<br/>👥 <strong>Usuários</strong> - Colaboradores<br/>💰 <strong>Orçamentos</strong> - Bulk orders<br/>🎨 <strong>Landing Pages</strong> - Campanhas<br/>⚙️ <strong>Configurações</strong> - Personalização<br/><br/>💡 <em>Navegue pela lateral para acessar cada área!</em>",
          side: "right",
        },
      },
      {
        element: "header, [data-tour='header']",
        popover: {
          title: "🔔 Barra Superior - Acesso Rápido",
          description: "<strong>Funcionalidades sempre visíveis:</strong><br/><br/>• <strong>Busca global</strong>: Encontre qualquer coisa<br/>• <strong>Notificações</strong>: Alertas importantes<br/>• <strong>Perfil</strong>: Suas configurações<br/>• <strong>Ajuda (✨)</strong>: Central de suporte<br/><br/>🎯 <em>O botão de ajuda te traz de volta a este tour!</em>",
          side: "bottom",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - CATÁLOGO (EXPANDIDO)
  // ===========================================
  {
    id: "manager-catalog",
    name: "Tour do Catálogo",
    description: "Domine a gestão de produtos da sua loja",
    role: "manager",
    route: "/gestor/catalog",
    steps: [
      {
        element: "h1",
        popover: {
          title: "📦 Catálogo Master - Fonte de Produtos",
          description: "Aqui você encontra <strong>TODOS os produtos disponíveis</strong> para importar para sua loja. Este é o catálogo global mantido pela plataforma com milhares de itens de fornecedores homologados.",
          side: "bottom",
        },
      },
      {
        element: "input[type='search'], input[placeholder*='Buscar'], [data-tour='search']",
        popover: {
          title: "🔍 Busca Inteligente de Produtos",
          description: "<strong>Encontre produtos rapidamente:</strong><br/><br/>• Digite o <strong>nome</strong> do produto<br/>• Use o <strong>SKU</strong> (código único)<br/>• Busque por <strong>categoria</strong><br/>• Filtre por <strong>marca</strong><br/><br/>⚡ <em>A busca é em tempo real - resultados aparecem enquanto você digita!</em>",
          side: "bottom",
        },
      },
      {
        element: "table, .grid, [data-tour='products']",
        popover: {
          title: "🛍️ Lista de Produtos Disponíveis",
          description: "<strong>Cada produto mostra:</strong><br/><br/>📷 <strong>Imagem</strong>: Foto do item<br/>📝 <strong>Nome</strong>: Título do produto<br/>🏷️ <strong>SKU</strong>: Código único de identificação<br/>📁 <strong>Categoria</strong>: Classificação<br/>💰 <strong>Preço sugerido</strong>: Valor base em R$<br/><br/>✅ <em>Selecione os produtos que deseja importar!</em>",
          side: "top",
        },
      },
      {
        element: "button[class*='primary'], [data-tour='import-button'], button:has(svg)",
        popover: {
          title: "✨ Importar para Sua Loja",
          description: "<strong>Após selecionar produtos:</strong><br/><br/>1️⃣ Clique em <strong>Importar</strong><br/>2️⃣ Defina o <strong>preço em Pontos</strong><br/>3️⃣ Configure o <strong>estoque inicial</strong><br/>4️⃣ Aplique <strong>tags de visibilidade</strong><br/><br/>🎯 <em>Produtos importados vão para 'Meu Catálogo' e ficam visíveis na loja!</em>",
          side: "left",
        },
      },
      {
        element: "[data-tour='filters'], aside, [class*='filter']",
        popover: {
          title: "🏷️ Filtros Avançados",
          description: "<strong>Refine sua busca:</strong><br/><br/>• <strong>Por categoria</strong>: Eletrônicos, Vestuário, etc.<br/>• <strong>Por faixa de preço</strong>: Defina min/max<br/>• <strong>Por disponibilidade</strong>: Em estoque<br/>• <strong>Por fornecedor</strong>: Escolha parceiros<br/><br/>💡 <em>Combine filtros para encontrar produtos perfeitos!</em>",
          side: "right",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - PRODUTOS CADASTRADOS
  // ===========================================
  {
    id: "manager-my-catalog",
    name: "Tour do Meu Catálogo",
    description: "Gerencie os produtos da sua loja",
    role: "manager",
    route: "/gestor/produtos-cadastrados",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🏪 Meu Catálogo - Seus Produtos",
          description: "Aqui estão <strong>TODOS os produtos que você importou</strong> para sua loja. Diferente do Catálogo Master, estes já estão configurados com seus preços e prontos para venda!",
          side: "bottom",
        },
      },
      {
        element: "table, .grid",
        popover: {
          title: "📋 Seus Produtos Configurados",
          description: "<strong>Informações de cada produto:</strong><br/><br/>💰 <strong>Preço em Pontos</strong>: Valor que o colaborador paga<br/>📦 <strong>Estoque</strong>: Quantidade disponível<br/>🏷️ <strong>Tags</strong>: Quem pode ver este produto<br/>✅ <strong>Status</strong>: Ativo ou inativo<br/><br/>🔧 <em>Clique em qualquer produto para editar!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='add-product'], button",
        popover: {
          title: "➕ Adicionar Mais Produtos",
          description: "Precisa de mais produtos? Clique aqui para voltar ao <strong>Catálogo Master</strong> e importar novos itens!<br/><br/>💡 <em>Você também pode criar produtos personalizados exclusivos da sua loja.</em>",
          side: "bottom",
        },
      },
      {
        element: "main",
        popover: {
          title: "💡 Dicas de Gestão do Catálogo",
          description: "<strong>Boas práticas:</strong><br/><br/>✅ Mantenha o <strong>estoque atualizado</strong><br/>✅ Revise <strong>preços periodicamente</strong><br/>✅ Use <strong>tags</strong> para segmentar produtos<br/>✅ Desative itens <strong>fora de estoque</strong><br/><br/>🎯 <em>Um catálogo bem curado aumenta a conversão!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - PEDIDOS (EXPANDIDO)
  // ===========================================
  {
    id: "manager-orders",
    name: "Tour de Pedidos",
    description: "Gerencie todos os pedidos da sua loja",
    role: "manager",
    route: "/gestor/orders",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🛒 Central de Pedidos",
          description: "Aqui você gerencia <strong>TODOS os pedidos</strong> feitos na sua loja! Acompanhe desde a compra até a entrega, com visibilidade total do processo.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='status-filter'], [class*='tab'], [class*='status']",
        popover: {
          title: "📊 Filtros por Status",
          description: "<strong>Estados do pedido:</strong><br/><br/>🟡 <strong>Pendente</strong>: Aguardando processamento<br/>🟠 <strong>Processando</strong>: Em preparação<br/>🔵 <strong>Enviado</strong>: Em trânsito<br/>🟢 <strong>Entregue</strong>: Concluído com sucesso<br/>🔴 <strong>Cancelado</strong>: Não processado<br/><br/>📌 <em>Clique nos filtros para ver cada grupo!</em>",
          side: "bottom",
        },
      },
      {
        element: "table, .space-y-4, [data-tour='orders-list']",
        popover: {
          title: "📋 Lista de Pedidos",
          description: "<strong>Informações de cada pedido:</strong><br/><br/>🆔 <strong>Número</strong>: YOO-XXXX (identificador único)<br/>👤 <strong>Cliente</strong>: Nome do colaborador<br/>📅 <strong>Data</strong>: Quando foi feito<br/>💰 <strong>Valor</strong>: Total em Pontos<br/>📦 <strong>Itens</strong>: Quantidade de produtos<br/><br/>🔍 <em>Clique em um pedido para ver detalhes!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='export'], button[class*='export']",
        popover: {
          title: "📤 Exportar Pedidos",
          description: "<strong>Exporte dados para:</strong><br/><br/>📊 <strong>Excel/CSV</strong>: Análise em planilhas<br/>📧 <strong>Relatórios</strong>: Envio por e-mail<br/>🔄 <strong>Integração</strong>: Sistemas externos<br/><br/>💡 <em>Útil para prestação de contas e análises!</em>",
          side: "left",
        },
      },
      {
        element: "main",
        popover: {
          title: "🚀 Fluxo de um Pedido",
          description: "<strong>Ciclo de vida do pedido:</strong><br/><br/>1️⃣ Colaborador compra na loja<br/>2️⃣ Pedido entra como <strong>Pendente</strong><br/>3️⃣ Você processa e envia ao fornecedor<br/>4️⃣ Fornecedor separa e despacha<br/>5️⃣ Código de rastreio é informado<br/>6️⃣ Colaborador acompanha a entrega<br/><br/>✅ <em>Todo o processo é rastreado aqui!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - USUÁRIOS
  // ===========================================
  {
    id: "manager-users",
    name: "Tour de Usuários",
    description: "Gerencie os colaboradores da sua empresa",
    role: "manager",
    route: "/gestor/usuarios",
    steps: [
      {
        element: "h1",
        popover: {
          title: "👥 Gestão de Usuários",
          description: "Aqui você gerencia <strong>todos os colaboradores</strong> que têm acesso à loja. Adicione novos membros, configure saldos e controle permissões!",
          side: "bottom",
        },
      },
      {
        element: "table, .grid, [data-tour='users-list']",
        popover: {
          title: "📋 Lista de Colaboradores",
          description: "<strong>Informações de cada usuário:</strong><br/><br/>👤 <strong>Nome</strong>: Identificação completa<br/>📧 <strong>E-mail</strong>: Contato e login<br/>💰 <strong>Saldo</strong>: Pontos disponíveis<br/>🏆 <strong>Nível</strong>: Gamificação<br/>📅 <strong>Última compra</strong>: Engajamento<br/><br/>📊 <em>Ordene e filtre como preferir!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='add-user'], button[class*='primary']",
        popover: {
          title: "➕ Adicionar Colaborador",
          description: "<strong>Formas de adicionar:</strong><br/><br/>👤 <strong>Individual</strong>: Um por vez com formulário<br/>📊 <strong>Importação em massa</strong>: Via planilha Excel<br/>🔗 <strong>SSO/LDAP</strong>: Integração com AD<br/><br/>💡 <em>Na importação você pode definir saldo inicial!</em>",
          side: "left",
        },
      },
      {
        element: "[data-tour='user-actions'], [class*='dropdown']",
        popover: {
          title: "⚡ Ações em Lote",
          description: "<strong>Operações massivas:</strong><br/><br/>💰 <strong>Creditar pontos</strong>: Adicionar saldo<br/>🏷️ <strong>Aplicar tags</strong>: Segmentar grupos<br/>📧 <strong>Enviar comunicado</strong>: Notificações<br/>🚫 <strong>Desativar</strong>: Remover acesso<br/><br/>✅ <em>Selecione vários usuários e aplique ações!</em>",
          side: "bottom",
        },
      },
      {
        element: "main",
        popover: {
          title: "🏷️ Sistema de Tags",
          description: "<strong>Tags controlam visibilidade:</strong><br/><br/>Exemplos de uso:<br/>• <strong>'Diretoria'</strong>: Produtos premium<br/>• <strong>'Vendas'</strong>: Kit comercial<br/>• <strong>'Novos'</strong>: Kit onboarding<br/><br/>🎯 <em>Combine tags com produtos para criar experiências personalizadas!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - LANDING PAGES (EXPANDIDO)
  // ===========================================
  {
    id: "manager-landing-pages",
    name: "Tour de Landing Pages",
    description: "Crie páginas incríveis para campanhas e onboarding",
    role: "manager",
    route: "/gestor/landing-pages",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🎨 Landing Pages - Páginas Especiais",
          description: "Landing pages são <strong>páginas personalizadas</strong> que você cria para momentos especiais! Use para dar boas-vindas, promover campanhas ou criar experiências únicas.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='new-lp'], button[class*='primary'], button:first-of-type",
        popover: {
          title: "➕ Criar Nova Landing Page",
          description: "<strong>O wizard guiado te ajuda:</strong><br/><br/>1️⃣ <strong>Identidade</strong>: Nome, slug, descrição<br/>2️⃣ <strong>Design</strong>: Cores, logo, banner<br/>3️⃣ <strong>Conteúdo</strong>: Textos e mídia<br/>4️⃣ <strong>Produtos</strong>: Seleção específica<br/>5️⃣ <strong>Publicação</strong>: URL e validade<br/><br/>🎯 <em>Em 5 minutos você cria uma página profissional!</em>",
          side: "left",
        },
      },
      {
        element: "table, .grid, main",
        popover: {
          title: "📋 Suas Landing Pages",
          description: "<strong>Cada página mostra:</strong><br/><br/>📝 <strong>Título</strong>: Nome da campanha<br/>🏷️ <strong>Tipo</strong>: Onboarding ou Campanha<br/>✅ <strong>Status</strong>: Ativa, Agendada, Expirada<br/>🔗 <strong>URL</strong>: Link para compartilhar<br/>📊 <strong>Visitas</strong>: Quantas pessoas acessaram<br/><br/>🔧 <em>Clique para editar ou ver estatísticas!</em>",
          side: "top",
        },
      },
      {
        element: "main",
        popover: {
          title: "🎁 Tipos de Landing Page",
          description: "<strong>Onboarding:</strong><br/>• Para novos colaboradores<br/>• Kit de boas-vindas<br/>• Produtos pré-selecionados<br/>• Limite de itens por pessoa<br/><br/><strong>Campanha:</strong><br/>• Promoções sazonais<br/>• Eventos corporativos<br/>• Ações de marketing<br/>• Validade configurável",
          side: "top",
        },
      },
      {
        element: "aside, nav",
        popover: {
          title: "💡 Casos de Uso Populares",
          description: "<strong>Ideias para suas páginas:</strong><br/><br/>🎄 <strong>Natal</strong>: Campanha de fim de ano<br/>🎂 <strong>Aniversário</strong>: Presente especial<br/>👋 <strong>Onboarding</strong>: Boas-vindas novatos<br/>🏆 <strong>Premiação</strong>: Top performers<br/>📣 <strong>Lançamento</strong>: Novos produtos<br/><br/>🚀 <em>A criatividade é o limite!</em>",
          side: "right",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - ORÇAMENTOS
  // ===========================================
  {
    id: "manager-budgets",
    name: "Tour de Orçamentos",
    description: "Gerencie pedidos em grande escala",
    role: "manager",
    route: "/gestor/budgets",
    steps: [
      {
        element: "h1",
        popover: {
          title: "💰 Orçamentos - Bulk Orders",
          description: "Orçamentos são <strong>pedidos em grande escala</strong>! Use para comprar muitos itens de uma vez, negociar preços especiais e gerenciar grandes ações.",
          side: "bottom",
        },
      },
      {
        element: "table, .grid, main",
        popover: {
          title: "📋 Lista de Orçamentos",
          description: "<strong>Status do orçamento:</strong><br/><br/>📝 <strong>Rascunho</strong>: Em elaboração<br/>⏳ <strong>Aguardando aprovação</strong>: Pendente<br/>✅ <strong>Aprovado</strong>: Pronto para executar<br/>🚚 <strong>Em processamento</strong>: Sendo preparado<br/>✓ <strong>Concluído</strong>: Entregue<br/><br/>💼 <em>Ideal para ações corporativas!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='new-budget'], button",
        popover: {
          title: "➕ Criar Novo Orçamento",
          description: "<strong>Passo a passo:</strong><br/><br/>1️⃣ Selecione os <strong>produtos</strong><br/>2️⃣ Defina <strong>quantidades</strong><br/>3️⃣ Escolha <strong>destinatários</strong><br/>4️⃣ Adicione <strong>endereço de entrega</strong><br/>5️⃣ Envie para <strong>aprovação</strong><br/><br/>💰 <em>Negocie descontos para grandes volumes!</em>",
          side: "left",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - CONFIGURAÇÕES DA LOJA
  // ===========================================
  {
    id: "manager-store-settings",
    name: "Tour de Configurações",
    description: "Personalize sua loja corporativa",
    role: "manager",
    route: "/gestor/store-settings",
    steps: [
      {
        element: "h1",
        popover: {
          title: "⚙️ Configurações da Loja",
          description: "Personalize <strong>cada detalhe</strong> da sua loja! Desde cores e logos até regras de negócio e integrações.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='branding'], [class*='brand'], main",
        popover: {
          title: "🎨 Identidade Visual",
          description: "<strong>Personalize o visual:</strong><br/><br/>🖼️ <strong>Logo</strong>: Sua marca na loja<br/>🎨 <strong>Cores</strong>: Paleta da empresa<br/>📝 <strong>Nome</strong>: Título da loja<br/>📣 <strong>Slogan</strong>: Frase de impacto<br/><br/>✨ <em>A loja fica com a cara da sua empresa!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='rules'], [class*='rules']",
        popover: {
          title: "📋 Regras de Negócio",
          description: "<strong>Configure políticas:</strong><br/><br/>💰 <strong>Limite de pontos por pedido</strong><br/>📦 <strong>Máximo de itens no carrinho</strong><br/>📅 <strong>Período de validade dos pontos</strong><br/>🔒 <strong>Aprovação obrigatória</strong><br/><br/>⚖️ <em>Defina as regras da sua operação!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO GESTOR - INTEGRAÇÕES
  // ===========================================
  {
    id: "manager-integrations",
    name: "Tour de Integrações",
    description: "Conecte a loja a sistemas externos",
    role: "manager",
    route: "/gestor/integrations",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🔌 Integrações",
          description: "Conecte sua loja a <strong>sistemas externos</strong>! ERPs, HRs, fornecedores e muito mais. Automatize processos e sincronize dados.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='webhooks'], a[href*='webhook'], main",
        popover: {
          title: "🔔 Webhooks - Eventos em Tempo Real",
          description: "<strong>Receba notificações de:</strong><br/><br/>🛒 <strong>Novo pedido</strong>: Quando alguém compra<br/>📦 <strong>Pedido enviado</strong>: Despacho<br/>✅ <strong>Pedido entregue</strong>: Conclusão<br/>👤 <strong>Novo usuário</strong>: Cadastro<br/><br/>🔗 <em>Configure URLs que recebem esses eventos!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='api-keys'], a[href*='api']",
        popover: {
          title: "🔑 API Keys",
          description: "<strong>Acesso programático:</strong><br/><br/>Crie chaves de API para:<br/>• Integrar com seu ERP<br/>• Automatizar importação de usuários<br/>• Sincronizar catálogo<br/>• Consultar pedidos<br/><br/>📚 <em>Documentação completa disponível!</em>",
          side: "bottom",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DA LOJA (MEMBRO) - EXPANDIDO
  // ===========================================
  {
    id: "member-store",
    name: "Tour da Loja",
    description: "Aprenda a navegar e resgatar produtos",
    role: "member",
    route: "/loja",
    steps: [
      {
        element: "h1, [data-tour='store-title']",
        popover: {
          title: "🛒 Bem-vindo à Sua Loja de Benefícios!",
          description: "Esta é a sua <strong>loja exclusiva</strong>! Aqui você troca seus Pontos por produtos incríveis. Navegue pelas categorias, encontre ofertas e aproveite seus benefícios!",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='balance'], [class*='balance'], [class*='saldo'], header",
        popover: {
          title: "💰 Seu Saldo de Pontos",
          description: "<strong>Informações do seu saldo:</strong><br/><br/>🎯 <strong>Pontos disponíveis</strong>: Quanto você tem<br/>📅 <strong>Validade</strong>: Quando expiram<br/>📈 <strong>Histórico</strong>: De onde vieram<br/><br/>💡 <em>Clique para ver o extrato completo!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='search'], input[type='search'], input[placeholder*='Buscar']",
        popover: {
          title: "🔍 Busca de Produtos",
          description: "Procurando algo específico?<br/><br/>Digite aqui:<br/>• <strong>Nome</strong> do produto<br/>• <strong>Marca</strong> preferida<br/>• <strong>Categoria</strong> desejada<br/><br/>⚡ <em>Resultados aparecem instantaneamente!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='filters'], aside, [class*='filter'], [class*='sidebar']",
        popover: {
          title: "🏷️ Filtros e Categorias",
          description: "<strong>Refine sua busca:</strong><br/><br/>📁 <strong>Categoria</strong>: Eletrônicos, Casa, etc.<br/>💰 <strong>Faixa de preço</strong>: Dentro do seu saldo<br/>⭐ <strong>Mais populares</strong>: Top vendidos<br/>🆕 <strong>Novidades</strong>: Recém chegados<br/><br/>🎯 <em>Combine filtros para achar o produto perfeito!</em>",
          side: "left",
        },
      },
      {
        element: "[data-tour='product-card'], .grid > div, [class*='product-card']",
        popover: {
          title: "🎁 Cards de Produtos",
          description: "<strong>Cada card mostra:</strong><br/><br/>📷 <strong>Foto</strong>: Imagem real do produto<br/>📝 <strong>Nome</strong>: Título e descrição<br/>💰 <strong>Preço</strong>: Valor em Pontos<br/>📦 <strong>Estoque</strong>: Disponibilidade<br/><br/>👆 <em>Clique para ver detalhes ou adicione ao carrinho!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='cart'], [class*='cart'], button[aria-label*='cart']",
        popover: {
          title: "🛒 Seu Carrinho de Compras",
          description: "<strong>Gerenciar seu carrinho:</strong><br/><br/>➕ <strong>Adicione</strong> produtos à vontade<br/>✏️ <strong>Altere</strong> quantidades<br/>🗑️ <strong>Remova</strong> itens<br/>💰 <strong>Veja o total</strong> em Pontos<br/><br/>💾 <em>O carrinho fica salvo - continue depois!</em>",
          side: "left",
        },
      },
      {
        element: "main",
        popover: {
          title: "🎉 Dica: Finalizar Compra",
          description: "<strong>Quando estiver pronto:</strong><br/><br/>1️⃣ Clique no <strong>carrinho</strong><br/>2️⃣ Revise os <strong>itens</strong><br/>3️⃣ Confirme o <strong>endereço</strong><br/>4️⃣ Finalize a <strong>compra</strong>!<br/><br/>📦 <em>Você receberá atualizações por e-mail!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DOS PEDIDOS (MEMBRO) - EXPANDIDO
  // ===========================================
  {
    id: "member-orders",
    name: "Tour dos Pedidos",
    description: "Acompanhe seus pedidos e entregas",
    role: "member",
    route: "/membro/pedidos",
    steps: [
      {
        element: "[data-tour='orders'], h1",
        popover: {
          title: "📦 Meus Pedidos",
          description: "Aqui você acompanha <strong>todos os seus pedidos</strong>! Desde o momento da compra até a entrega na sua casa.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='status-tabs'], [class*='tab'], [class*='status']",
        popover: {
          title: "📊 Status dos Pedidos",
          description: "<strong>Entenda cada status:</strong><br/><br/>🟡 <strong>Pendente</strong>: Recebemos seu pedido<br/>🟠 <strong>Processando</strong>: Sendo preparado<br/>🔵 <strong>Enviado</strong>: A caminho!<br/>🟢 <strong>Entregue</strong>: Chegou!<br/><br/>📧 <em>Você recebe e-mail a cada mudança de status!</em>",
          side: "bottom",
        },
      },
      {
        element: "table, .space-y-4, [data-tour='orders-list']",
        popover: {
          title: "📋 Histórico de Pedidos",
          description: "<strong>Cada pedido mostra:</strong><br/><br/>🆔 <strong>Número</strong>: YOO-XXXX<br/>📅 <strong>Data</strong>: Quando você comprou<br/>📦 <strong>Itens</strong>: O que você pediu<br/>💰 <strong>Valor</strong>: Quanto custou<br/><br/>🔍 <em>Clique para ver detalhes e rastrear!</em>",
          side: "top",
        },
      },
      {
        element: "main",
        popover: {
          title: "🚚 Rastreamento de Entrega",
          description: "Quando seu pedido for <strong>enviado</strong>:<br/><br/>📬 Você recebe o <strong>código de rastreio</strong><br/>🔗 Link para acompanhar nos <strong>Correios/Transportadora</strong><br/>📍 Veja onde está seu pacote em <strong>tempo real</strong><br/><br/>📧 <em>Notificamos você quando sair para entrega!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DA GAMIFICAÇÃO (MEMBRO) - EXPANDIDO
  // ===========================================
  {
    id: "member-gamification",
    name: "Tour da Gamificação",
    description: "Entenda o sistema de níveis e conquistas",
    role: "member",
    route: "/membro/gamificacao",
    steps: [
      {
        element: "[data-tour='gamification'], h1",
        popover: {
          title: "🎮 Gamificação - Quanto Mais Usa, Mais Ganha!",
          description: "O sistema de <strong>gamificação</strong> recompensa sua participação! Suba de nível, desbloqueie conquistas e ganhe mais benefícios.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='level'], [class*='level'], main",
        popover: {
          title: "🏆 Seu Nível Atual",
          description: "<strong>Os 5 níveis:</strong><br/><br/>🥉 <strong>Bronze</strong>: Multiplicador 1.0x<br/>🥈 <strong>Prata</strong>: Multiplicador 1.2x<br/>🥇 <strong>Ouro</strong>: Multiplicador 1.5x<br/>💎 <strong>Platina</strong>: Multiplicador 2.0x<br/>👑 <strong>Diamante</strong>: Multiplicador 3.0x<br/><br/>📈 <em>O multiplicador aumenta seu cashback!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='progress'], [class*='progress']",
        popover: {
          title: "📊 Progresso para o Próximo Nível",
          description: "<strong>Como subir de nível:</strong><br/><br/>🛒 <strong>Faça compras</strong> na loja<br/>📅 <strong>Acesse</strong> regularmente<br/>🎯 <strong>Complete</strong> conquistas<br/>👥 <strong>Indique</strong> colegas<br/><br/>💪 <em>Cada ação aproxima você do próximo nível!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='achievements'], [class*='achievement']",
        popover: {
          title: "🏅 Conquistas Especiais",
          description: "<strong>Desbloqueie medalhas:</strong><br/><br/>🎉 <strong>Primeira compra</strong><br/>🔥 <strong>5 pedidos seguidos</strong><br/>💎 <strong>Gastou 10.000 pontos</strong><br/>⭐ <strong>Avaliou 10 produtos</strong><br/><br/>🎁 <em>Cada conquista dá recompensas extras!</em>",
          side: "bottom",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DOS ENDEREÇOS (MEMBRO) - EXPANDIDO
  // ===========================================
  {
    id: "member-addresses",
    name: "Tour dos Endereços",
    description: "Gerencie seus endereços de entrega",
    role: "member",
    route: "/membro/enderecos",
    steps: [
      {
        element: "[data-tour='addresses'], h1",
        popover: {
          title: "🏠 Meus Endereços de Entrega",
          description: "Cadastre e gerencie seus <strong>endereços de entrega</strong>! Você pode ter vários: casa, trabalho, ou qualquer outro lugar.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='add-address'], button[class*='primary'], button",
        popover: {
          title: "➕ Adicionar Novo Endereço",
          description: "<strong>Informações necessárias:</strong><br/><br/>📍 <strong>CEP</strong>: Preenchimento automático!<br/>🏠 <strong>Rua e número</strong><br/>🏢 <strong>Complemento</strong>: Apto, bloco...<br/>📱 <strong>Telefone</strong>: Para contato<br/><br/>💡 <em>Digite o CEP e os campos preenchem sozinhos!</em>",
          side: "left",
        },
      },
      {
        element: "[data-tour='address-list'], main, .grid, .space-y-4",
        popover: {
          title: "📋 Seus Endereços",
          description: "<strong>Gerenciar endereços:</strong><br/><br/>⭐ <strong>Definir padrão</strong>: Pré-selecionado no checkout<br/>✏️ <strong>Editar</strong>: Atualizar informações<br/>🗑️ <strong>Excluir</strong>: Remover antigos<br/><br/>🏷️ <em>Dê apelidos: 'Casa', 'Trabalho', etc.</em>",
          side: "top",
        },
      },
      {
        element: "main",
        popover: {
          title: "💡 Dica de Entrega",
          description: "<strong>Para entregas sem problemas:</strong><br/><br/>✅ Mantenha o <strong>CEP atualizado</strong><br/>✅ Adicione <strong>complemento detalhado</strong><br/>✅ Informe <strong>referências</strong> se necessário<br/>✅ Mantenha <strong>telefone atualizado</strong><br/><br/>📦 <em>Assim seu pedido chega mais rápido!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO CHECKOUT
  // ===========================================
  {
    id: "member-checkout",
    name: "Tour do Checkout",
    description: "Finalize suas compras com facilidade",
    role: "member",
    route: "/loja/checkout",
    steps: [
      {
        element: "h1, [data-tour='checkout-title']",
        popover: {
          title: "🛒 Finalizando sua Compra",
          description: "Você está quase lá! Revise seu pedido, confirme o endereço e <strong>finalize a compra</strong> para receber seus produtos.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='cart-items'], [class*='cart-items'], main",
        popover: {
          title: "📦 Revisão do Carrinho",
          description: "<strong>Confira seus itens:</strong><br/><br/>📷 <strong>Produtos</strong> selecionados<br/>🔢 <strong>Quantidades</strong> de cada<br/>💰 <strong>Preço unitário</strong> em Pontos<br/>📊 <strong>Subtotal</strong> de cada item<br/><br/>✏️ <em>Ainda dá tempo de alterar quantidades!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='address-selection'], [class*='address']",
        popover: {
          title: "📍 Endereço de Entrega",
          description: "Selecione onde quer <strong>receber seu pedido</strong>:<br/><br/>⭐ Seu endereço <strong>padrão</strong> já vem selecionado<br/>🔄 Clique para <strong>trocar</strong> se necessário<br/>➕ Ou <strong>adicione um novo</strong><br/><br/>✅ <em>Confirme que está tudo certo!</em>",
          side: "right",
        },
      },
      {
        element: "[data-tour='order-summary'], [class*='summary'], [class*='total']",
        popover: {
          title: "💰 Resumo do Pedido",
          description: "<strong>Total da sua compra:</strong><br/><br/>📦 <strong>Subtotal</strong>: Soma dos produtos<br/>🚚 <strong>Frete</strong>: Custo de envio<br/>💰 <strong>Total</strong>: Valor final em Pontos<br/>💳 <strong>Seu saldo</strong>: Pontos disponíveis<br/><br/>✅ <em>Verifique se tem saldo suficiente!</em>",
          side: "left",
        },
      },
      {
        element: "[data-tour='confirm-button'], button[class*='primary'], button[type='submit']",
        popover: {
          title: "✅ Confirmar Compra",
          description: "Tudo certo? Clique para <strong>finalizar</strong>!<br/><br/>Após confirmar:<br/>📧 Você recebe um <strong>e-mail</strong> de confirmação<br/>🆔 Recebe o <strong>número do pedido</strong><br/>📦 Acompanha o <strong>status</strong> na área de pedidos<br/><br/>🎉 <em>Parabéns pela compra!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO SUPER ADMIN - CATÁLOGO BASE
  // ===========================================
  {
    id: "super-admin-base-catalog",
    name: "Catálogo Base Global",
    description: "Gerencie os produtos mestres do sistema",
    role: "manager",
    route: "/super-admin/catalogo-base",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🌎 Catálogo Base Global",
          description: "Este é o catálogo <strong>MESTRE</strong> da plataforma! Os produtos aqui são a 'fonte da verdade' que todas as empresas podem importar.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='add-base-product'], button[class*='primary']",
        popover: {
          title: "➕ Adicionar Produto Base",
          description: "<strong>Criar novo produto:</strong><br/><br/>📝 <strong>Nome e descrição</strong><br/>🆔 <strong>SKU único</strong><br/>📁 <strong>Categoria</strong><br/>💰 <strong>Preço sugerido</strong><br/>📷 <strong>Imagens</strong><br/><br/>🏢 <em>Fica disponível para todas as empresas!</em>",
          side: "left",
        },
      },
      {
        element: "table, .grid",
        popover: {
          title: "📦 Produtos do Catálogo Base",
          description: "<strong>Gerenciamento:</strong><br/><br/>✏️ <strong>Editar</strong> detalhes e preços<br/>📸 <strong>Atualizar</strong> imagens<br/>🔒 <strong>Ativar/Desativar</strong> produtos<br/>🗑️ <strong>Remover</strong> descontinuados<br/><br/>🔄 <em>Alterações refletem nas lojas!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DO SUPER ADMIN - EMPRESAS
  // ===========================================
  {
    id: "super-admin-companies",
    name: "Gestão de Empresas",
    description: "Administre as empresas da plataforma",
    role: "manager",
    route: "/super-admin/companies",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🏢 Gestão de Empresas",
          description: "Aqui você administra <strong>todas as empresas</strong> que usam a plataforma! Cada empresa tem sua própria loja e configurações.",
          side: "bottom",
        },
      },
      {
        element: "table, .grid, main",
        popover: {
          title: "📋 Lista de Empresas",
          description: "<strong>Informações de cada empresa:</strong><br/><br/>🏢 <strong>Nome</strong> da empresa<br/>🆔 <strong>CNPJ</strong><br/>👥 <strong>Total de usuários</strong><br/>📦 <strong>Pedidos realizados</strong><br/>✅ <strong>Status</strong>: Ativa/Inativa<br/><br/>⚙️ <em>Clique para gerenciar!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='add-company'], button",
        popover: {
          title: "➕ Adicionar Nova Empresa",
          description: "<strong>Onboarding de empresa:</strong><br/><br/>1️⃣ Dados <strong>cadastrais</strong><br/>2️⃣ Configurar <strong>gestor</strong> inicial<br/>3️⃣ Definir <strong>plano</strong> e limites<br/>4️⃣ Ativar <strong>funcionalidades</strong><br/><br/>🚀 <em>Em minutos a empresa está operando!</em>",
          side: "left",
        },
      },
    ],
  },

  // ===========================================
  // TOUR GERAL - DASHBOARD DO MEMBRO
  // ===========================================
  {
    id: "member-dashboard",
    name: "Tour do Meu Dashboard",
    description: "Conheça sua área de membro",
    role: "member",
    route: "/dashboard/member",
    steps: [
      {
        element: "h1",
        popover: {
          title: "👋 Bem-vindo ao Seu Dashboard!",
          description: "Este é o seu <strong>painel pessoal</strong>! Aqui você vê seu saldo, pedidos recentes e acessa todas as funcionalidades da loja.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='balance'], [class*='balance'], [class*='saldo']",
        popover: {
          title: "💰 Seu Saldo de Pontos",
          description: "<strong>Seus pontos:</strong><br/><br/>🎯 <strong>Disponível</strong>: Para usar agora<br/>⏳ <strong>Pendente</strong>: Em processamento<br/>📅 <strong>Expirando</strong>: Use logo!<br/><br/>💡 <em>Clique para ver o extrato completo!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='recent-orders'], [class*='orders']",
        popover: {
          title: "📦 Pedidos Recentes",
          description: "Seus <strong>últimos pedidos</strong> aparecem aqui! Veja status, rastreie entregas e acompanhe o histórico completo.",
          side: "top",
        },
      },
      {
        element: "[data-tour='quick-actions'], .grid, main",
        popover: {
          title: "⚡ Ações Rápidas",
          description: "<strong>Acesso direto:</strong><br/><br/>🛒 <strong>Ir para a loja</strong><br/>📦 <strong>Ver todos os pedidos</strong><br/>🏆 <strong>Minha gamificação</strong><br/>📍 <strong>Meus endereços</strong><br/><br/>🚀 <em>Tudo que você precisa em um lugar!</em>",
          side: "top",
        },
      },
    ],
  },
  // ===========================================
  // TOUR DO MEMBRO - PERFIL
  // ===========================================
  {
    id: "member-profile",
    name: "Tour do Meu Perfil",
    description: "Gerencie suas informações pessoais",
    role: "member",
    route: "/membro/preferencias",
    steps: [
      {
        element: "h1",
        popover: {
          title: "👤 Meu Perfil",
          description: "Aqui você gerencia suas <strong>informações pessoais</strong>! Mantenha seus dados atualizados para uma melhor experiência.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='personal-info'], form, main",
        popover: {
          title: "📝 Dados Pessoais",
          description: "<strong>Informações que você pode editar:</strong><br/><br/>👤 <strong>Nome completo</strong><br/>📧 <strong>E-mail</strong> (para notificações)<br/>📱 <strong>Telefone</strong> (para contato)<br/>📅 <strong>Data de nascimento</strong><br/><br/>✏️ <em>Clique para editar seus dados!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='preferences'], [class*='preference']",
        popover: {
          title: "⚙️ Preferências",
          description: "<strong>Personalize sua experiência:</strong><br/><br/>🔔 <strong>Notificações</strong>: E-mail e push<br/>🌙 <strong>Tema</strong>: Claro ou escuro<br/>🌐 <strong>Idioma</strong>: Português<br/><br/>💡 <em>Ajuste do seu jeito!</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='password'], [class*='password'], [class*='security']",
        popover: {
          title: "🔐 Segurança",
          description: "<strong>Proteja sua conta:</strong><br/><br/>🔑 <strong>Alterar senha</strong><br/>📱 <strong>Autenticação 2FA</strong><br/>📋 <strong>Histórico de acessos</strong><br/><br/>🛡️ <em>Mantenha sua conta segura!</em>",
          side: "top",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DA DEMO COMERCIAL
  // ===========================================
  {
    id: "demo-complete",
    name: "Tour Completo da Demo",
    description: "Roteiro para apresentação comercial",
    role: "manager",
    route: "/demo-guide",
    steps: [
      {
        element: "h1",
        popover: {
          title: "🎯 Guia da Demo Comercial",
          description: "Este é o seu <strong>roteiro completo</strong> para apresentar a plataforma! Siga os passos para uma demo impressionante.",
          side: "bottom",
        },
      },
      {
        element: "main",
        popover: {
          title: "📋 Estrutura da Apresentação",
          description: "<strong>Roteiro sugerido:</strong><br/><br/>1️⃣ <strong>Visão geral</strong> (5 min)<br/>2️⃣ <strong>Área do Gestor</strong> (10 min)<br/>3️⃣ <strong>Área do Membro</strong> (10 min)<br/>4️⃣ <strong>Integrações</strong> (5 min)<br/>5️⃣ <strong>Q&A</strong> (10 min)<br/><br/>⏱️ <em>Total: ~40 minutos</em>",
          side: "top",
        },
      },
      {
        element: "[data-tour='tips'], aside",
        popover: {
          title: "💡 Dicas de Ouro",
          description: "<strong>Para uma demo de sucesso:</strong><br/><br/>✨ Use o <strong>Assistente (✨)</strong> para tirar dúvidas<br/>📦 Faça um <strong>pedido ao vivo</strong><br/>🎨 Mostre a <strong>personalização</strong> de marca<br/>📊 Apresente os <strong>relatórios</strong><br/><br/>🎯 <em>Deixe o cliente interagir!</em>",
          side: "left",
        },
      },
    ],
  },

  // ===========================================
  // TOUR DA DOCUMENTAÇÃO
  // ===========================================
  {
    id: "member-documentation",
    name: "Tour da Documentação",
    description: "Explore a central de documentação",
    role: "member",
    route: "/membro/documentacao",
    steps: [
      {
        element: "h1",
        popover: {
          title: "📚 Central de Documentação",
          description: "Aqui você encontra <strong>toda a documentação</strong> da plataforma! Guias, tutoriais, FAQs e muito mais.",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='search'], input",
        popover: {
          title: "🔍 Busca na Documentação",
          description: "Procure por qualquer assunto:<br/><br/>• <strong>Como fazer X</strong><br/>• <strong>O que é Y</strong><br/>• <strong>Erro Z</strong><br/><br/>⚡ <em>Resultados instantâneos!</em>",
          side: "bottom",
        },
      },
      {
        element: "[data-tour='categories'], aside, nav",
        popover: {
          title: "📁 Categorias",
          description: "<strong>Organize por tema:</strong><br/><br/>📦 <strong>Pedidos</strong>: Comprar e rastrear<br/>💰 <strong>Pontos</strong>: Saldo e extrato<br/>🏆 <strong>Gamificação</strong>: Níveis e conquistas<br/>⚙️ <strong>Conta</strong>: Perfil e segurança<br/><br/>📖 <em>Navegue pelas categorias!</em>",
          side: "right",
        },
      },
      {
        element: "main",
        popover: {
          title: "💬 Precisa de Mais Ajuda?",
          description: "Se não encontrou o que procura:<br/><br/>✨ Use o <strong>Assistente da Demo</strong><br/>📧 Entre em <strong>contato</strong> com suporte<br/>💬 Acesse o <strong>chat</strong> ao vivo<br/><br/>🤝 <em>Estamos aqui para ajudar!</em>",
          side: "top",
        },
      },
    ],
  },
]

/**
 * Obtém a configuração de tour para uma rota e role específicos
 */
export function getTourForRoute(route: string, role: "manager" | "member" | "superAdmin"): TourConfig | null {
  const normalizedRoute = route.split("?")[0] // Remove query params
  
  // Mapear role para o formato do tour
  const tourRole = role === "superAdmin" ? "manager" : role
  
  // Encontrar tour que corresponde à rota exata primeiro
  let tour = TOUR_CONFIGS.find(
    (t) => t.route === normalizedRoute && (t.role === tourRole || t.role === "all")
  )
  
  // Se não encontrar, tentar correspondência parcial (para rotas como /dashboard/manager quando tour está em /dashboard)
  if (!tour) {
    tour = TOUR_CONFIGS.find(
      (t) => normalizedRoute.startsWith(t.route + "/") && (t.role === tourRole || t.role === "all")
    )
  }
  
  return tour || null
}

/**
 * Obtém todos os tours disponíveis para um role
 */
export function getToursForRole(role: "manager" | "member" | "superAdmin"): TourConfig[] {
  const tourRole = role === "superAdmin" ? "manager" : role
  return TOUR_CONFIGS.filter((t) => t.role === tourRole || t.role === "all")
}
