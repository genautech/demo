# UI Extensions Reference Guide

Este documento consolida todos os componentes de extensão UI disponíveis no projeto, com exemplos de código prontos para uso.

## Resumo de Extensões

| Extensão | Componente Principal | Localização |
|----------|---------------------|-------------|
| Gráficos | recharts | `components/ui/chart.tsx` |
| Modais | ResponsiveModal | `components/ui/responsive-modal.tsx` |
| Avatares | Avatar | `components/ui/avatar.tsx` |
| Badges | Badge | `components/ui/badge.tsx` |
| Mockups de Produtos | BrandedProductImage | `components/demo/branded-product-image.tsx` |
| Gamificação | UserStats, AchievementBadge | `components/gamification/` |
| Material Design 3 | M3Button, M3Card | `components/ui/m3-*.tsx` |

---

## 1. Gráficos (Charts)

### Biblioteca: `recharts` v2.15.4

### Importação Base

```tsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
```

### Exemplo: Line Chart (Pedidos ao Longo do Tempo)

```tsx
const data = [
  { name: "Seg", pedidos: 12 },
  { name: "Ter", pedidos: 19 },
  { name: "Qua", pedidos: 15 },
  { name: "Qui", pedidos: 22 },
  { name: "Sex", pedidos: 18 },
]

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="pedidos" stroke="#10b981" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

### Exemplo: Area Chart (Evolução de Pontos)

```tsx
const data = [
  { dia: "Seg", pontos: 100 },
  { dia: "Ter", pontos: 150 },
  { dia: "Qua", pontos: 200 },
]

<ResponsiveContainer width="100%" height={250}>
  <AreaChart data={data}>
    <defs>
      <linearGradient id="colorPontos" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="dia" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="pontos" stroke="#10b981" fillOpacity={1} fill="url(#colorPontos)" />
  </AreaChart>
</ResponsiveContainer>
```

### Exemplo: Pie Chart (Distribuição por Nível)

```tsx
const COLORS = ["#CD7F32", "#C0C0C0", "#FFD700", "#E5E4E2", "#B9F2FF"]
const data = [
  { name: "Bronze", value: 30 },
  { name: "Prata", value: 25 },
  { name: "Ouro", value: 20 },
]

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, value }) => `${name}: ${value}`}
      outerRadius={100}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### Exemplo: Bar Chart (Top Produtos)

```tsx
const data = [
  { name: "Mochila", vendas: 50 },
  { name: "Garrafa", vendas: 35 },
  { name: "Camiseta", vendas: 28 },
]

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="vendas" fill="#10b981" />
  </BarChart>
</ResponsiveContainer>
```

---

## 2. Modais (Modals/Dialogs)

### Componente: `ResponsiveModal`

Automaticamente usa `Dialog` no desktop e `Drawer` no mobile.

### Importação

```tsx
import { ResponsiveModal } from "@/components/ui/responsive-modal"
```

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `open` | boolean | - | Controla se o modal está aberto |
| `onOpenChange` | (open: boolean) => void | - | Callback quando o estado muda |
| `title` | ReactNode | - | Título do modal |
| `description` | ReactNode | - | Descrição opcional |
| `children` | ReactNode | - | Conteúdo do modal |
| `footer` | ReactNode | - | Rodapé opcional |
| `maxWidth` | 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' | 'lg' | Largura máxima |
| `className` | string | - | Classes para o conteúdo |
| `contentClassName` | string | - | Classes para o container |

### Exemplo Básico

```tsx
const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>

<ResponsiveModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Título do Modal"
  description="Descrição opcional do modal"
  maxWidth="lg"
  footer={
    <>
      <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
      <Button onClick={handleSubmit}>Confirmar</Button>
    </>
  }
>
  <div className="space-y-4">
    {/* Conteúdo do modal */}
  </div>
</ResponsiveModal>
```

### Dialog Nativo

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Conteúdo */}
    </div>
    <DialogFooter>
      <Button>Ação</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 3. Avatares

### Componente: `Avatar`

### Importação

```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
```

### Exemplo Básico

```tsx
<Avatar>
  <AvatarImage src={user.avatar} alt={user.firstName} />
  <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
</Avatar>
```

### Tamanhos Customizados

```tsx
// Pequeno (24px)
<Avatar className="h-6 w-6">
  <AvatarImage src={src} />
  <AvatarFallback className="text-xs">JS</AvatarFallback>
</Avatar>

// Médio (32px) - padrão
<Avatar className="h-8 w-8">
  <AvatarImage src={src} />
  <AvatarFallback>JS</AvatarFallback>
</Avatar>

// Grande (48px)
<Avatar className="h-12 w-12">
  <AvatarImage src={src} />
  <AvatarFallback className="text-lg">JS</AvatarFallback>
</Avatar>

// Extra Grande (64px)
<Avatar className="h-16 w-16">
  <AvatarImage src={src} />
  <AvatarFallback className="text-xl">JS</AvatarFallback>
</Avatar>
```

### Avatar com Borda e Status

```tsx
<div className="relative">
  <Avatar className="h-12 w-12 ring-2 ring-primary/50">
    <AvatarImage src={src} />
    <AvatarFallback>JS</AvatarFallback>
  </Avatar>
  {/* Indicador de status online */}
  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
</div>
```

---

## 4. Badges

### Componente: `Badge`

### Importação

```tsx
import { Badge } from "@/components/ui/badge"
```

### Variantes

```tsx
<Badge variant="default">Padrão</Badge>
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Destrutivo</Badge>
<Badge variant="outline">Outline</Badge>
```

### Com Ícones

```tsx
import { CheckCircle2, Clock, XCircle } from "lucide-react"

<Badge variant="secondary" className="bg-green-100 text-green-700">
  <CheckCircle2 className="h-3 w-3 mr-1" />
  Aprovado
</Badge>

<Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
  <Clock className="h-3 w-3 mr-1" />
  Pendente
</Badge>

<Badge variant="secondary" className="bg-red-100 text-red-700">
  <XCircle className="h-3 w-3 mr-1" />
  Rejeitado
</Badge>
```

### Badges de Nível (Gamificação)

```tsx
const LEVEL_COLORS = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  platinum: "#E5E4E2",
  diamond: "#B9F2FF",
}

<Badge 
  variant="outline" 
  className="border-primary/30 bg-primary/10 text-primary"
>
  <Trophy className="h-3 w-3 mr-1" />
  Ouro
</Badge>
```

---

## 5. Achievement Badges (Gamificação)

### Componente: `AchievementBadge`

### Importação

```tsx
import { AchievementBadge, AchievementList } from "@/components/gamification/AchievementBadge"
```

### Exemplo Básico

```tsx
const achievement = {
  id: "first_purchase",
  name: "Primeira Compra",
  description: "Realizou sua primeira compra na loja",
  icon: "🛒",
  earnedAt: "2024-01-15T10:30:00Z",
}

<AchievementBadge 
  achievement={achievement} 
  size="md" // sm | md | lg
  showTooltip={true}
/>
```

### Lista de Achievements

```tsx
<AchievementList 
  achievements={userAchievements} 
  maxVisible={5} 
  size="md" 
/>
```

### Corporate Achievement Badge

```tsx
import { CorporateAchievementBadge } from "@/components/gamification/CorporateAchievementBadge"

<CorporateAchievementBadge
  achievement={{
    id: "leader_2024",
    name: "Líder de Equipe",
    description: "Liderou projetos de sucesso",
    icon: "👑",
    category: "leadership", // leadership | innovation | performance | service | teamwork
    corporateLevel: "gold",
    earnedAt: "2024-06-01",
  }}
  size="lg"
  showProgress={true}
  progress={75}
/>
```

---

## 6. Mockups de Produtos

### Componente: `BrandedProductImage`

### Importação

```tsx
import { BrandedProductImage } from "@/components/demo/branded-product-image"
```

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `productImage` | string | - | URL da imagem do produto |
| `companyId` | string | - | ID da empresa para buscar logo |
| `className` | string | - | Classes CSS |
| `logoSize` | 'sm' \| 'md' \| 'lg' | 'md' | Tamanho do logo |
| `logoPosition` | 'center' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' | 'center' | Posição do logo |

### Exemplo Básico

```tsx
<BrandedProductImage
  productImage={product.images?.[0] || "/placeholder.jpg"}
  companyId={company?.id}
  className="w-full h-64"
  logoSize="md"
  logoPosition="bottom-right"
/>
```

### Em Card de Produto

```tsx
<Card className="overflow-hidden">
  <div className="aspect-square">
    <BrandedProductImage
      productImage={product.images[0]}
      companyId={companyId}
      className="w-full h-full"
      logoSize="sm"
      logoPosition="bottom-right"
    />
  </div>
  <CardContent className="p-4">
    <h3 className="font-semibold">{product.name}</h3>
    <p className="text-muted-foreground">{product.price} pontos</p>
  </CardContent>
</Card>
```

### AR Preview

```tsx
import { ARPreview } from "@/components/loja/ARPreview"

<ARPreview
  productId={product.id}
  productName={product.name}
  productImages={product.images}
/>
```

---

## 7. User Stats (Gamificação)

### Componente: `UserStats`

### Importação

```tsx
import { UserStats } from "@/components/gamification/UserStats"
```

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `userId` | string | - | ID do usuário (opcional, usa auth) |
| `compact` | boolean | false | Versão compacta |
| `showCorporate` | boolean | false | Mostra métricas corporativas |

### Exemplos

```tsx
// Versão padrão
<UserStats userId={userId} />

// Versão compacta (para sidebar)
<UserStats userId={userId} compact={true} />

// Com métricas corporativas
<UserStats userId={userId} showCorporate={true} />
```

---

## 8. Material Design 3 (M3)

### Biblioteca: `@material/web` v2.4.1

### M3 Button

```tsx
import { M3Button } from "@/components/ui/m3-button"

// Variantes
<M3Button variant="filled">Preenchido</M3Button>
<M3Button variant="outlined">Com Borda</M3Button>
<M3Button variant="text">Texto</M3Button>
<M3Button variant="elevated">Elevado</M3Button>
<M3Button variant="tonal">Tonal</M3Button>
<M3Button variant="fab" size="fab"><Plus /></M3Button>

// Tamanhos
<M3Button size="sm">Pequeno</M3Button>
<M3Button size="md">Médio</M3Button>
<M3Button size="lg">Grande</M3Button>

// Com loading
<M3Button loading={isLoading}>Salvando...</M3Button>

// Com ícones
<M3Button icon={<Save />}>Salvar</M3Button>
<M3Button icon={<Download />} trailingIcon={<ArrowDown />}>
  Download
</M3Button>
```

### M3 Card

```tsx
import {
  M3Card,
  M3CardHeader,
  M3CardTitle,
  M3CardDescription,
  M3CardContent,
  M3CardFooter,
  M3CardMedia,
} from "@/components/ui/m3-card"

// Variantes
<M3Card variant="elevated">Elevado (padrão)</M3Card>
<M3Card variant="filled">Preenchido</M3Card>
<M3Card variant="outlined">Com Borda</M3Card>

// Interativo
<M3Card variant="elevated" interactive onClick={handleClick}>
  <M3CardContent>Card clicável</M3CardContent>
</M3Card>

// Estrutura completa
<M3Card variant="elevated">
  <M3CardMedia src="/product.jpg" alt="Produto" />
  <M3CardHeader>
    <M3CardTitle>Título do Card</M3CardTitle>
    <M3CardDescription>Descrição do card</M3CardDescription>
  </M3CardHeader>
  <M3CardContent>
    Conteúdo principal do card
  </M3CardContent>
  <M3CardFooter>
    <M3Button variant="text">Cancelar</M3Button>
    <M3Button variant="filled">Confirmar</M3Button>
  </M3CardFooter>
</M3Card>
```

### Classes CSS M3

```tsx
// Elevação
<div className="m3-elevation-0">Sem sombra</div>
<div className="m3-elevation-1">Sombra nível 1</div>
<div className="m3-elevation-2">Sombra nível 2</div>
<div className="m3-elevation-3">Sombra nível 3</div>
<div className="m3-elevation-4">Sombra nível 4</div>
<div className="m3-elevation-5">Sombra nível 5</div>

// Formas
<div className="m3-shape-none">Sem raio</div>
<div className="m3-shape-extra-small">4px</div>
<div className="m3-shape-small">8px</div>
<div className="m3-shape-medium">12px</div>
<div className="m3-shape-large">16px</div>
<div className="m3-shape-extra-large">28px</div>
<div className="m3-shape-full">Pill</div>

// Tipografia
<h1 className="m3-display-large">Display Large</h1>
<h2 className="m3-headline-large">Headline Large</h2>
<h3 className="m3-title-large">Title Large</h3>
<p className="m3-body-large">Body Large</p>
<span className="m3-label-large">Label Large</span>
```

### Tokens M3 (TypeScript)

```tsx
import { m3Colors, m3Typography, m3Elevation, m3Shape, m3Motion } from "@/lib/material-theme"

// Cores M3
<div style={{ backgroundColor: m3Colors.primary }}>
  <span style={{ color: m3Colors.onPrimary }}>Texto</span>
</div>

// Tipografia M3
<h1 style={m3Typography.headlineLarge}>Título</h1>
<p style={m3Typography.bodyMedium}>Corpo do texto</p>

// Sombras M3
<div style={{ boxShadow: m3Elevation.level2 }}>Card com sombra</div>

// Formas M3
<div style={{ borderRadius: m3Shape.medium }}>12px de raio</div>

// Motion M3
<div style={{ 
  transition: `all ${m3Motion.duration.medium2} ${m3Motion.easing.standard}` 
}}>
  Animação suave
</div>
```

---

## Padrões de Tema

### Verificando Fun Mode

```tsx
import { useTheme } from "next-themes"

function MyComponent() {
  const { theme } = useTheme()
  const isFunMode = theme === "fun"

  return (
    <div className={cn(
      "base-classes",
      isFunMode && "fun-mode-classes"
    )}>
      {/* Conteúdo */}
    </div>
  )
}
```

### Animações com Framer Motion

```tsx
import { motion } from "framer-motion"

// Entrada com fade e slide
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Conteúdo */}
</motion.div>

// Hover com scale (Fun Mode)
<motion.div
  whileHover={isFunMode ? { scale: 1.05, rotate: 2 } : { scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  {/* Conteúdo */}
</motion.div>

// Animação infinita
<motion.div
  animate={{
    y: [0, -5, 0],
    scale: [1, 1.05, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  {/* Conteúdo */}
</motion.div>
```

---

## Referências Rápidas

### Arquivos de Componentes

| Categoria | Arquivo |
|-----------|---------|
| Charts Base | `components/ui/chart.tsx` |
| Currency Chart | `components/currency/currency-chart.tsx` |
| Dialog | `components/ui/dialog.tsx` |
| Responsive Modal | `components/ui/responsive-modal.tsx` |
| **Order Detail Modal** | `components/modals/OrderDetailModal.tsx` |
| **User Detail Modal** | `components/modals/UserDetailModal.tsx` |
| **Product Detail Modal** | `components/modals/ProductDetailModal.tsx` |
| Avatar | `components/ui/avatar.tsx` |
| Badge | `components/ui/badge.tsx` |
| Achievement Badge | `components/gamification/AchievementBadge.tsx` |
| Corporate Badge | `components/gamification/CorporateAchievementBadge.tsx` |
| User Stats | `components/gamification/UserStats.tsx` |
| Branded Image | `components/demo/branded-product-image.tsx` |
| AR Preview | `components/loja/ARPreview.tsx` |
| M3 Button | `components/ui/m3-button.tsx` |
| M3 Card | `components/ui/m3-card.tsx` |
| Material Theme | `lib/material-theme.ts` |
| M3 CSS Tokens | `app/globals.css` (linha 356+) |

### Documentação do Conductor

| Documento | Descrição |
|-----------|-----------|
| `conductor/product.md` | Contexto do produto e features |
| `conductor/workflow.md` | Regras de desenvolvimento |
| `conductor/tech-stack.md` | Stack técnico |
| `conductor/tracks/gamification-hub-stitch-design/plan.md` | Gamificação completa |
| `conductor/tracks/design-system-modernization/plan.md` | Sistema de design |
| `conductor/tracks/fun-mode-sophisticated-redesign/plan.md` | Fun Mode |

---

---

## 9. Modais de Detalhes

### Componentes Disponíveis

Os modais de detalhes são componentes reutilizáveis para exibir informações detalhadas de entidades.

### Importação

```tsx
import { OrderDetailModal, UserDetailModal, ProductDetailModal } from "@/components/modals"
```

### OrderDetailModal

Exibe detalhes completos de um pedido com timeline, itens e informações de entrega.

```tsx
const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

<OrderDetailModal
  order={selectedOrder}
  open={!!selectedOrder}
  onOpenChange={(open) => !open && setSelectedOrder(null)}
  companyId={companyId}
/>
```

### UserDetailModal

Exibe perfil completo do usuário com estatísticas, conquistas e transações.

```tsx
const [selectedUser, setSelectedUser] = useState<User | null>(null)
const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

<UserDetailModal
  user={selectedUser}
  open={isViewDetailsOpen}
  onOpenChange={setIsViewDetailsOpen}
  companyId={companyId}
  onEdit={(user) => { /* editar usuário */ }}
  onAddPoints={(user) => { /* adicionar pontos */ }}
  onViewHistory={(user) => { /* ver histórico */ }}
/>
```

### ProductDetailModal

Exibe detalhes do produto com galeria de imagens, estoque e tags.

```tsx
const [selectedProduct, setSelectedProduct] = useState<CompanyProduct | null>(null)
const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

<ProductDetailModal
  product={selectedProduct}
  open={isViewDetailsOpen}
  onOpenChange={setIsViewDetailsOpen}
  companyId={companyId}
  onEdit={(product) => { /* editar produto */ }}
  onDelete={(product) => { /* excluir produto */ }}
  onAddToCart={(product) => { /* adicionar ao carrinho */ }}
/>
```

### Características dos Modais

- **Animações**: Todos usam `framer-motion` para transições suaves
- **Responsivo**: Adapta automaticamente para mobile/desktop
- **Tema**: Compatível com Light/Dark/Fun Mode
- **Actions**: Callbacks opcionais para ações (edit, delete, etc.)
- **Estatísticas**: Exibem métricas relevantes com cards visuais
- **Progress Bars**: Indicadores de progresso/status

---

## Changelog

- **2025-01-02**: Documento criado com todas as extensões UI
- Gráficos (recharts), Modais, Avatares, Badges
- Mockups de Produtos, Gamificação
- Material Design 3 (M3 Button, M3 Card)
- Classes CSS M3 e tokens TypeScript
- **2025-01-02**: Adicionados modais de detalhes
  - OrderDetailModal - detalhes de pedidos
  - UserDetailModal - detalhes de usuários
  - ProductDetailModal - detalhes de produtos
