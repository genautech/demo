"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PageContainer } from "@/components/page-container"

// MUI Components
import Switch from '@mui/material/Switch'

import { 
  Heart, 
  Bell, 
  Mail, 
  ShoppingBag,
  Gift,
  Sparkles,
  CheckCircle2,
  User as UserIcon,
  MapPin,
  Save,
  Phone,
  Settings,
  Trophy,
  Star,
  Crown,
  ChevronRight,
  Shield,
} from "lucide-react"
import { getUserById, updateUser, getUserAddresses, type User, getCurrencyName, type SavedAddress } from "@/lib/storage"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Preferences {
  emailNotifications: boolean
  smsNotifications: boolean
  newProductsAlert: boolean
  orderUpdates: boolean
  promotions: boolean
  favoriteCategories: string[]
}

const CATEGORIES = [
  "Swag",
  "Acessórios",
  "Escritório",
  "Vestuário",
  "Tech",
  "Casa",
  "Esportes",
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export default function PreferenciasPage() {
  const [user, setUser] = useState<User | null>(null)
  const [balance, setBalance] = useState(0)
  const [companyId, setCompanyId] = useState("company_1")
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    smsNotifications: false,
    newProductsAlert: true,
    orderUpdates: true,
    promotions: true,
    favoriteCategories: [],
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      const auth = JSON.parse(authData)
      const currentUser = getUserById(auth.userId)
      if (auth.companyId) {
        setCompanyId(auth.companyId)
      }
      if (currentUser) {
        setUser(currentUser)
        setProfileData({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser.phone || "",
        })
        loadPreferences(currentUser.id)
        
        // Get balance from user object
        setBalance(currentUser.points || 0)
        
        // Load addresses from centralized storage
        const userAddresses = getUserAddresses(currentUser.id)
        setAddresses(userAddresses)
      }
    }
  }, [])

  const loadPreferences = (userId: string) => {
    const saved = localStorage.getItem(`yoobe_preferences_${userId}`)
    if (saved) {
      setPreferences(JSON.parse(saved))
    }
  }

  const savePreferences = (newPreferences: Preferences) => {
    if (!user) return
    setPreferences(newPreferences)
    localStorage.setItem(`yoobe_preferences_${user.id}`, JSON.stringify(newPreferences))
    toast.success("Preferências atualizadas!")
  }

  const handleSaveProfile = () => {
    if (!user) return
    try {
      updateUser(user.id, profileData)
      toast.success("Perfil atualizado com sucesso!")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar perfil")
    }
  }

  const toggleCategory = (category: string) => {
    const newCategories = preferences.favoriteCategories.includes(category)
      ? preferences.favoriteCategories.filter(c => c !== category)
      : [...preferences.favoriteCategories, category]
    
    savePreferences({
      ...preferences,
      favoriteCategories: newCategories,
    })
  }

  const currencyName = getCurrencyName(companyId, true)

  return (
    <PageContainer className="space-y-6">
      {/* Header with M3 styling */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--md-sys-color-primary-container)] shadow-md">
            <UserIcon className="h-7 w-7 text-[var(--md-sys-color-on-primary-container)]" />
          </div>
          <div>
            <h1 className="m3-headline-medium font-bold text-[var(--md-sys-color-on-surface)]">
              Meu Perfil
            </h1>
            <p className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)] mt-1">
              Gerencie suas informações e preferências
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile Summary Card with Gamification */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="m3-shape-extra-large bg-gradient-to-br from-[var(--md-sys-color-primary-container)] to-[var(--md-sys-color-secondary-container)] p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--md-sys-color-primary)]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--md-sys-color-tertiary)]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-[var(--md-sys-color-primary)] flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-[var(--md-sys-color-on-primary)]">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[var(--md-sys-color-tertiary)] flex items-center justify-center shadow-md">
              <Crown className="h-4 w-4 text-[var(--md-sys-color-on-tertiary)]" />
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h2 className="m3-headline-small font-bold text-[var(--md-sys-color-on-primary-container)]">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="m3-body-medium text-[var(--md-sys-color-on-primary-container)]/70">
              {profileData.email}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--md-sys-color-surface)]/80 backdrop-blur-sm">
                <Trophy className="h-4 w-4 text-[var(--md-sys-color-tertiary)]" />
                <span className="m3-label-large font-semibold text-[var(--md-sys-color-on-surface)]">
                  Membro Ativo
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--md-sys-color-tertiary-container)]">
                <Star className="h-4 w-4 text-[var(--md-sys-color-on-tertiary-container)]" />
                <span className="m3-label-large font-bold text-[var(--md-sys-color-on-tertiary-container)]">
                  {balance.toLocaleString("pt-BR")} {currencyName}
                </span>
              </div>
            </div>
          </div>
          
          <Sparkles className="h-6 w-6 text-[var(--md-sys-color-tertiary)] animate-pulse hidden sm:block" />
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Dados Pessoais */}
        <motion.div
          variants={cardVariants}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--md-sys-color-outline-variant)]/30 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--md-sys-color-primary-container)]">
              <UserIcon className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
            </div>
            <div>
              <h3 className="m3-title-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                Dados Pessoais
              </h3>
              <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                Suas informações básicas de identificação
              </p>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">Nome</Label>
                <Input
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="rounded-xl border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">Sobrenome</Label>
                <Input
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="rounded-xl border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="pl-10 rounded-xl border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="pl-10 rounded-xl border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleSaveProfile}
                className="rounded-full px-6 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:bg-[var(--md-sys-color-primary)]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Endereços Summary */}
        <motion.div
          variants={cardVariants}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--md-sys-color-outline-variant)]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--md-sys-color-secondary-container)]">
                <MapPin className="h-5 w-5 text-[var(--md-sys-color-on-secondary-container)]" />
              </div>
              <div>
                <h3 className="m3-title-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                  Meus Endereços
                </h3>
                <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                  Endereços de entrega cadastrados
                </p>
              </div>
            </div>
            <Link href="/membro/enderecos">
              <Button variant="outline" size="sm" className="rounded-full border-[var(--md-sys-color-outline)]">
                Gerenciar
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-5">
            {addresses.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-2xl border-2 border-dashed border-[var(--md-sys-color-outline-variant)]">
                <MapPin className="h-10 w-10 mx-auto mb-3 text-[var(--md-sys-color-on-surface-variant)]" />
                <p className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)] mb-4">
                  Nenhum endereço cadastrado
                </p>
                <Link href="/membro/enderecos">
                  <Button variant="outline" size="sm" className="rounded-full border-[var(--md-sys-color-outline)]">
                    Adicionar Endereço
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.slice(0, 2).map((addr) => (
                  <div 
                    key={addr.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-[var(--md-sys-color-surface-container)] border border-[var(--md-sys-color-outline-variant)]/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--md-sys-color-primary-container)]/50">
                        <MapPin className="h-5 w-5 text-[var(--md-sys-color-primary)]" />
                      </div>
                      <div>
                        <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">{addr.label}</p>
                        <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] truncate max-w-[200px] sm:max-w-[400px]">
                          {addr.address1}, {addr.city} - {addr.stateCode}
                        </p>
                      </div>
                    </div>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]">
                        <CheckCircle2 className="h-3 w-3" />
                        Padrão
                      </span>
                    )}
                  </div>
                ))}
                {addresses.length > 2 && (
                  <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] text-center pt-2">
                    + {addresses.length - 2} outro(s) endereço(s)
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          variants={cardVariants}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--md-sys-color-outline-variant)]/30 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--md-sys-color-tertiary-container)]">
              <Bell className="h-5 w-5 text-[var(--md-sys-color-on-tertiary-container)]" />
            </div>
            <div>
              <h3 className="m3-title-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                Notificações
              </h3>
              <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                Configure como deseja ser notificado
              </p>
            </div>
          </div>
          <div className="divide-y divide-[var(--md-sys-color-outline-variant)]/30">
            {/* Email Notifications */}
            <NotificationToggle
              icon={<Mail className="h-5 w-5" />}
              title="Notificações por Email"
              description="Receba atualizações importantes por email"
              checked={preferences.emailNotifications}
              onChange={(checked) => savePreferences({ ...preferences, emailNotifications: checked })}
            />
            {/* SMS Notifications */}
            <NotificationToggle
              icon={<Phone className="h-5 w-5" />}
              title="Notificações por SMS"
              description="Receba alertas importantes por SMS"
              checked={preferences.smsNotifications}
              onChange={(checked) => savePreferences({ ...preferences, smsNotifications: checked })}
            />
            {/* New Products */}
            <NotificationToggle
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Novos Produtos"
              description="Seja notificado quando novos produtos forem adicionados"
              checked={preferences.newProductsAlert}
              onChange={(checked) => savePreferences({ ...preferences, newProductsAlert: checked })}
            />
            {/* Order Updates */}
            <NotificationToggle
              icon={<Gift className="h-5 w-5" />}
              title="Atualizações de Pedidos"
              description="Receba notificações sobre o status dos seus pedidos"
              checked={preferences.orderUpdates}
              onChange={(checked) => savePreferences({ ...preferences, orderUpdates: checked })}
            />
            {/* Promotions */}
            <NotificationToggle
              icon={<Sparkles className="h-5 w-5" />}
              title="Promoções e Ofertas"
              description="Receba ofertas exclusivas e descontos especiais"
              checked={preferences.promotions}
              onChange={(checked) => savePreferences({ ...preferences, promotions: checked })}
            />
          </div>
        </motion.div>

        {/* Favorite Categories */}
        <motion.div
          variants={cardVariants}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--md-sys-color-outline-variant)]/30 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--md-sys-color-error-container)]">
              <Heart className="h-5 w-5 text-[var(--md-sys-color-on-error-container)]" />
            </div>
            <div>
              <h3 className="m3-title-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                Categorias Favoritas
              </h3>
              <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                Selecione categorias para recomendações personalizadas
              </p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = preferences.favoriteCategories.includes(category)
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
                      "m3-label-large font-medium",
                      isSelected 
                        ? "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-md" 
                        : "bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container-highest)]",
                      "border",
                      isSelected 
                        ? "border-[var(--md-sys-color-primary)]" 
                        : "border-[var(--md-sys-color-outline-variant)]"
                    )}
                  >
                    {isSelected && <CheckCircle2 className="h-4 w-4" />}
                    {category}
                  </button>
                )
              })}
            </div>
            {preferences.favoriteCategories.length > 0 && (
              <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)] mt-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-[var(--md-sys-color-tertiary)]" />
                {preferences.favoriteCategories.length} categoria(s) selecionada(s)
              </p>
            )}
          </div>
        </motion.div>

        {/* Account Security */}
        <motion.div
          variants={cardVariants}
          className="m3-shape-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--md-sys-color-surface-container-high)]">
                <Shield className="h-5 w-5 text-[var(--md-sys-color-on-surface-variant)]" />
              </div>
              <div>
                <h3 className="m3-title-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                  Segurança da Conta
                </h3>
                <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                  Sua conta está protegida
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="m3-label-medium text-green-600 font-medium">Verificado</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}

// Notification Toggle Component
function NotificationToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          checked 
            ? "bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]" 
            : "bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]"
        )}>
          {icon}
        </div>
        <div>
          <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">{title}</p>
          <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: 'var(--md-sys-color-primary)',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'var(--md-sys-color-primary)',
          },
        }}
      />
    </div>
  )
}
