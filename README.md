# 🎁 4yoonik Demo - Corporate Gifting Platform

Uma plataforma completa de corporate gifting e benefícios para colaboradores, construída com Next.js 16, React 19 e design system moderno.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🏪 Loja de Benefícios
- Catálogo de produtos físicos e digitais
- Sistema de pontos e saldo
- Carrinho de compras integrado
- Checkout com múltiplas formas de pagamento

### 🎯 Gamificação Corporativa
- Sistema de níveis e conquistas
- Moeda virtual corporativa
- Leaderboards e rankings
- Badges e recompensas

### 👥 Multi-role Dashboard
- **Super Admin**: Gerenciamento completo da plataforma
- **Gestor**: Administração de empresa e equipe
- **Membro**: Acesso à loja e benefícios

### 🎁 Envio de Presentes
- Envio individual e em massa
- Templates de mensagens
- Rastreamento de entregas
- Workflow de aprovação

### 📊 Analytics & Métricas
- Dashboard com KPIs em tempo real
- Relatórios de uso
- Métricas de engajamento
- Exportação de dados

### 🎨 Design System
- UI moderna inspirada em v0/Vercel
- Suporte a temas claro/escuro
- Componentes responsivos
- Animações fluidas com Framer Motion

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm, yarn ou pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/genautech/demo.git
cd demo

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
demo/
├── app/                    # App Router (Next.js 16)
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboards por role
│   ├── gestor/           # Área do gestor
│   ├── loja/             # Loja de produtos
│   ├── membro/           # Área do membro
│   ├── onboarding/       # Fluxo de onboarding
│   └── super-admin/      # Área administrativa
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── demo/             # Componentes de demonstração
│   ├── landing/          # Componentes de landing pages
│   └── modals/           # Modais e dialogs
├── lib/                   # Utilitários e lógica
│   ├── storage.ts        # Gerenciamento de estado
│   ├── navigation.ts     # Navegação por role
│   └── gamification/     # Lógica de gamificação
├── hooks/                 # React Hooks customizados
├── public/               # Assets estáticos
└── conductor/            # Documentação do projeto
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Iniciar produção
npm run lint     # Verificar código
```

## 🎭 Modo Demo

A plataforma inclui um modo de demonstração completo:

1. Acesse `/demo-guide` para o roteiro guiado
2. Use credenciais de teste:
   - **Super Admin**: admin@4yoonik.com
   - **Gestor**: gestor@empresa.com
   - **Membro**: membro@empresa.com

## 🛠 Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TailwindCSS 4 |
| Components | shadcn/ui, Radix UI |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | SWR, React Context |
| Analytics | Vercel Analytics |

## 📱 Páginas Principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Autenticação |
| `/onboarding` | Wizard de onboarding |
| `/dashboard` | Dashboard por role |
| `/loja` | Catálogo de produtos |
| `/gestor/*` | Área do gestor |
| `/membro/*` | Área do membro |
| `/super-admin/*` | Administração |

## 🚀 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/genautech/demo)

### Manual

```bash
npm run build
npm run start
```

## 📄 Documentação

- [Guia do Usuário](./GUIA_USUARIO.md)
- [Roteiro de Demo](./DEMO_ROTEIRO.md)
- [Design System](./GEMINI.md)
- [Implementações](./IMPLEMENTACOES_COMPLETAS.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 License

Este projeto é proprietário da GenauTech / 4yoonik.

---

Desenvolvido com ❤️ por [GenauTech](https://genautech.com)
