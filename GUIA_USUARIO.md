# Guia do Usuário - Yoobe Corporate Store

Este guia explica como usar o sistema Yoobe para diferentes tipos de usuário.

## Acesso ao Sistema

### URL de Produção
🌐 Acesse: **https://demo.yoobe.co**

### Escolha sua Persona
Na tela inicial, escolha como deseja acessar:

| Persona | Descrição | Ideal Para |
|---------|-----------|------------|
| **Super Admin** | Administrador master do sistema | Configurar empresas e catálogo base |
| **Gestor** | Gerente de loja corporativa | Gerenciar produtos, pedidos e equipe |
| **Membro** | Colaborador da empresa | Explorar loja e resgatar produtos |

---

## Super Admin

### O que você pode fazer
- Gerenciar múltiplas empresas (tenants)
- Administrar o catálogo base de produtos
- Configurar usuários globais
- Gerenciar tags e categorias
- Visualizar documentação técnica (Conductor)
- Configurar Fun Mode

### Principais Rotas
| Rota | Função |
|------|--------|
| `/super-admin` | Dashboard principal |
| `/super-admin/companies` | Gestão de empresas |
| `/super-admin/catalogo-base` | Catálogo mestre |
| `/super-admin/users` | Usuários globais |
| `/super-admin/conductor` | Documentação técnica |
| `/super-admin/fun-mode` | Configuração do tema Fun |

### Fluxo Típico
1. Acesse como Super Admin
2. Vá em "Empresas" para ver/criar empresas
3. Configure o "Catálogo Base" com produtos
4. Gerencie "Tags Globais" para categorização
5. Use o "Conductor" para ver documentação

---

## Gestor (Manager)

### O que você pode fazer
- Gerenciar o catálogo da sua empresa
- Processar pedidos e aprovar resgates
- Gerenciar usuários/membros da equipe
- Enviar presentes para colaboradores
- Configurar gamificação e moeda
- Criar landing pages de campanhas
- Acompanhar métricas no dashboard

### Principais Rotas
| Rota | Função |
|------|--------|
| `/dashboard/manager` | Dashboard com gráficos |
| `/gestor/catalog` | Catálogo de produtos |
| `/gestor/catalog/import` | Importar do catálogo base |
| `/gestor/orders` | Gestão de pedidos |
| `/gestor/usuarios` | Gestão de membros |
| `/gestor/send-gifts` | Enviar presentes |
| `/gestor/budgets` | Orçamentos |
| `/gestor/store-settings` | Configurações da loja |

### Fluxo Típico
1. Acesse como Gestor
2. Vá em "Importar Catálogo" para trazer produtos do catálogo base
3. Configure preços e estoque em "Catálogo"
4. Gerencie sua equipe em "Usuários"
5. Acompanhe "Pedidos" e aprove resgates
6. Use "Enviar Presentes" para reconhecer colaboradores

### Importação de Produtos
1. Acesse `/gestor/catalog/import`
2. Selecione produtos do catálogo base
3. Defina quantidades
4. Clique em "Enviar Orçamento"
5. Vá em `/gestor/budgets` e aprove o orçamento
6. Libere e replique os produtos

---

## Membro (Colaborador)

### O que você pode fazer
- Navegar na loja e ver produtos
- Resgatar produtos usando seus pontos
- Acompanhar seus pedidos
- Ver conquistas e nível na gamificação
- Rastrear entregas (Swag Track)
- Gerenciar endereços

### Principais Rotas
| Rota | Função |
|------|--------|
| `/dashboard/member` | Seu dashboard pessoal |
| `/loja` | Loja de produtos |
| `/loja/produto/[id]` | Detalhes do produto |
| `/loja/checkout` | Finalizar resgate |
| `/membro/pedidos` | Meus pedidos |
| `/membro/gamificacao` | Minhas conquistas e nível |
| `/membro/swag-track` | Rastrear entregas |
| `/membro/enderecos` | Meus endereços |

### Fluxo Típico
1. Acesse como Membro
2. Veja seu saldo de pontos no dashboard
3. Navegue pela "Loja" e escolha produtos
4. Adicione ao carrinho e faça checkout
5. Acompanhe em "Meus Pedidos"
6. Veja seu progresso em "Gamificação"

### Resgatando um Produto
1. Acesse `/loja`
2. Clique em um produto
3. Verifique se tem pontos suficientes
4. Clique em "Adicionar ao Carrinho"
5. Vá para o carrinho e finalize
6. Acompanhe o pedido em "Meus Pedidos"

---

## Funcionalidades Especiais

### Fun Mode
O sistema possui um modo visual especial chamado "Fun Mode":
- Cores vibrantes e animações
- Glassmorphism e gradientes modernos
- Ative no seletor de tema (sol/lua/estrela)

### Gamificação
- Sistema de pontos e níveis
- Conquistas desbloqueáveis
- Leaderboard com ranking
- Moeda personalizável por empresa

### Temas
- **Light**: Tema claro padrão
- **Dark**: Tema escuro
- **Fun**: Tema moderno e animado

---

## Perguntas Frequentes (FAQ)

### Meus dados são salvos onde?
Seus dados são salvos no navegador (localStorage). Cada dispositivo/navegador tem dados independentes.

### Posso usar em outro dispositivo?
Sim, mas os dados não sincronizam entre dispositivos. Cada um começa do zero.

### O que acontece se limpar o cache?
Os dados serão resetados. O sistema criará novos dados de demonstração automaticamente.

### Posso testar sem medo?
Sim! Este é um ambiente de demonstração. Explore todas as funcionalidades.

### Como trocar de persona?
Saia do sistema (logout no menu lateral) e acesse novamente escolhendo outra persona.

---

## Suporte

### Documentação Técnica
Acesse `/documentacao` ou `/super-admin/conductor` para documentação completa.

### Sitemap
Veja todas as rotas em `/sitemap` (requer acesso Super Admin).

### Guia de Demo
Acesse `/demo-guide` para scripts e checklists de demonstração.

---

*Última atualização: 03 de Janeiro de 2026*
