# Sitemap do Sistema Yoobe

Este documento mapeia todas as rotas principais e auxiliares do sistema, organizadas por perfil de acesso e funcionalidade.

## 🔑 Perfis de Acesso
- **Super Admin**: Acesso total ao sistema e configurações globais.
- **Gestor**: Administração da empresa, catálogo, pedidos e membros.
- **Membro**: Usuário final da loja, resgates e acompanhamento.

---

## 🛠️ Super Admin (Master)
| Rota | Descrição |
|------|-----------|
| `/super-admin` | Dashboard Admin Geral |
| `/super-admin/companies` | Gestão de Empresas (Tenants) |
| `/super-admin/catalogo-base` | Catálogo Mestre de Produtos |
| `/super-admin/users` | Gestão de Usuários Globais |
| `/super-admin/tags` | Gestão de Tags Globais |
| `/super-admin/comunicacao` | Banners e Alertas do Sistema |
| `/super-admin/conductor` | Especificações e Sync do Conductor |
| `/super-admin/aprovacoes` | Aprovações Globais do Sistema |
| `/super-admin/perfil` | Perfil do Super Admin |

## 💼 Gestor (Empresa)
### Administração e Operações
| Rota | Descrição |
|------|-----------|
| `/dashboard/manager` | Painel de Indicadores do Gestor |
| `/gestor/catalog` | Gestão de Produtos da Empresa |
| `/gestor/catalog/import` | Importação do Catálogo Base |
| `/gestor/catalog/[id]` | Edição de Produto Específico |
| `/gestor/catalog/replication-logs` | Histórico de Sincronização |
| `/gestor/produtos-cadastrados` | Lista Simplificada de Produtos |
| `/gestor/orders` | Gestão de Pedidos e Resgates |
| `/gestor/orders/[id]` | Detalhes do Pedido |
| `/gestor/usuarios` | Gestão de Membros da Equipe |
| `/gestor/estoque` | Controle de Inventário |
| `/gestor/send-gifts` | Fluxo de Envio de Brindes |
| `/gestor/swag-track` | Rastreamento Logístico |
| `/gestor/aprovacoes` | Workflow de Aprovações |
| `/gestor/aprovacoes/regras` | Configuração de Regras de Aprovação |
| `/gestor/achievements` | Gestão de Conquistas e Badges |

### Gestão Financeira e Gamificação
| Rota | Descrição |
|------|-----------|
| `/gestor/wallet` | Gestão de Verbas (Budgets) entre Times |
| `/gestor/budgets` | Orçamentos e Alocações |
| `/gestor/currency` | Customização da Moeda Gamificada |
| `/gestor/currency-dashboard` | Dashboard "Bolsa de Valores" |

### Configurações e Branding
| Rota | Descrição |
|------|-----------|
| `/gestor/appearance` | Editor de Aparência e Temas |
| `/gestor/landing-pages` | Gestão de Landing Pages de Campanha |
| `/gestor/store-settings` | Configurações da Loja Virtual |
| `/gestor/integrations` | Conexões, APIs e Webhooks |
| `/gestor/setup` | Guia de Configuração Inicial |
| `/gestor/settings` | Preferências de Conta |
| `/gestor/perfil` | Perfil do Gestor |

## 👤 Membro (Colaborador)
| Rota | Descrição |
|------|-----------|
| `/dashboard/member` | Painel do Colaborador |
| `/loja` | Vitrine de Produtos Principal |
| `/loja/produto/[id]` | Detalhes e Resgate de Produto |
| `/loja/checkout` | Carrinho e Finalização |
| `/membro/pedidos` | Meus Pedidos e Histórico |
| `/membro/gamificacao` | Minhas Conquistas e Níveis |
| `/membro/enderecos` | Gestão de Endereços |
| `/membro/preferencias` | Configurações de Perfil |
| `/membro/swag-track` | Rastreamento de meus itens |
| `/membro/documentacao` | Central de Ajuda |

## 💡 Soluções e Produtos (Público)
| Rota | Descrição |
|------|-----------|
| `/solucoes` | Landing Page Institucional - Reconhecimento e Recompensas |
| `/solucoes/planos` | Página de Planos, Preços e Como Funciona |
| `/solucoes/gamificacao` | Redireciona para /solucoes |
| `/solucoes/corporativo` | Redireciona para /solucoes/planos |

## 🚀 Campanhas e Onboarding
| Rota | Descrição |
|------|-----------|
| `/campanha/loja` | Loja Exclusiva de Campanha |
| `/campanha/checkout` | Finalização de Campanha |
| `/campanha/pedido/[id]` | Status de Pedido de Campanha |
| `/landing/[slug]` | Landing Pages Dinâmicas |
| `/onboarding` | Fluxo de Boas-vindas com IA |

## 🤖 Inteligência Artificial (APIs)
| Rota | Descrição |
|------|-----------|
| `/api/demo/ai-enhanced` | Geração Avançada com Grok/Gemini |
| `/api/demo/grok-chat` | Chat Interativo com Grok AI |
| `/api/demo/grok-insights` | Insights de Time com IA |
| `/api/demo/grok-dashboard-insights` | Analytics com IA para Dashboard |
| `/api/gifts/recommend-enhanced` | Recomendações Inteligentes de Produtos |

## 🌍 Públicas / Sistema
| Rota | Descrição |
|------|-----------|
| `/` | Redirecionamento Inicial |
| `/login` | Acesso ao Sistema |
| `/sitemap` | Mapa do Site (este documento visual) |
| `/demo-guide` | Guia de Demonstração Interativo |
| `/sandbox/store` | Ambiente de Teste de Loja |
| `/documentacao` | Documentação Técnica do Sistema |

## 🔧 Setup e Configuração
| Rota | Descrição |
|------|-----------|
| `/gestor/setup` | Wizard de Setup Inicial (6 etapas) |
| `/gestor/setup/1-connect` | Etapa 1: Configurar Chaves de API |
| `/gestor/setup/2-catalog` | Etapa 2: Importar Catálogo |
| `/gestor/setup/3-wallet` | Etapa 3: Configurar Wallet |
| `/gestor/setup/4-webhooks` | Etapa 4: Configurar Webhooks |
| `/gestor/setup/5-test-order` | Etapa 5: Testar Pedido |
| `/gestor/setup/6-go-live` | Etapa 6: Go-Live (Produção) |

## 📊 Dashboards e Analytics
| Rota | Descrição |
|------|-----------|
| `/dashboard` | Dashboard Principal (redireciona por role) |
| `/dashboard/manager` | Dashboard do Gestor com gráficos |
| `/dashboard/member` | Dashboard do Membro com gamificação |
| `/dashboard/admin/executive-kpi` | KPIs Executivos (Admin) |
| `/dashboard/admin/grok-integration` | Integração Grok AI (Admin) |

## 🎨 Aparência e Branding
| Rota | Descrição |
|------|-----------|
| `/gestor/appearance` | Editor de Aparência e Temas |
| `/super-admin/fun-mode` | Configuração do Fun Mode |

## 🔐 Segurança e Integrações
| Rota | Descrição |
|------|-----------|
| `/gestor/seguranca` | Configurações de Segurança |
| `/gestor/integrations` | Integrações e APIs |
| `/gestor/integrations/api-keys` | Gestão de Chaves de API |
| `/gestor/integrations/webhooks` | Configuração de Webhooks |
| `/gestor/integrations/logs` | Logs de Integrações |

## 🛠️ Ferramentas de Desenvolvimento
| Rota | Descrição |
|------|-----------|
| `/gestor/devtools` | Ferramentas de Desenvolvimento |
| `/sandbox/store` | Ambiente de Teste de Loja |
| `/demos` | Gestão de Demos |
| `/demo/[id]` | Demo Específica |
| `/demo-guide` | Guia de Demonstração Interativo |

## 📦 Gestão de Fornecedores (Super Admin)
| Rota | Descrição |
|------|-----------|
| `/super-admin/fornecedores` | Gestão de Fornecedores |
| `/super-admin/fornecedores/logs` | Logs de Sincronização de Fornecedores |

## 👥 Gestão de Compradores
| Rota | Descrição |
|------|-----------|
| `/gestor/compradores` | Gestão de Compradores |

## 📄 Documentação e Ajuda
| Rota | Descrição |
|------|-----------|
| `/documentacao` | Documentação Técnica Completa |
| `/membro/documentacao` | Documentação para Membros |

## 🎯 Landing Pages Dinâmicas
| Rota | Descrição |
|------|-----------|
| `/landing/[slug]` | Landing Pages Dinâmicas por Slug |
| `/gestor/landing-pages` | Gestão de Landing Pages |
| `/gestor/landing-pages/new` | Criar Nova Landing Page |
| `/gestor/landing-pages/[id]/edit` | Editar Landing Page |

## 📸 Snapshots e Histórico
| Rota | Descrição |
|------|-----------|
| `/membro/snapshots` | Snapshots do Membro |
| `/membro/estoque` | Estoque do Membro (Visualização) |

---
*Atualizado em: 03 de Janeiro de 2026 - Preparação para Deploy em Produção*
