"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageContainer } from "@/components/page-container"

// MUI Components
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2,
  Home,
  Building2,
  X,
  Sparkles,
  Star,
  Navigation,
} from "lucide-react"
import { 
  getUserById, 
  getUserAddresses, 
  saveUserAddress, 
  deleteUserAddress, 
  setDefaultAddress, 
  type User, 
  type SavedAddress 
} from "@/lib/storage"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
}

export default function EnderecosPage() {
  const [user, setUser] = useState<User | null>(null)
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)
  const [formData, setFormData] = useState<Omit<SavedAddress, "id" | "country">>({
    label: "Casa",
    address1: "",
    address2: "",
    city: "",
    stateCode: "",
    zipcode: "",
    phone: "",
    isDefault: false,
  })

  useEffect(() => {
    const authData = localStorage.getItem("yoobe_auth")
    if (authData) {
      const auth = JSON.parse(authData)
      const currentUser = getUserById(auth.userId)
      if (currentUser) {
        setUser(currentUser)
        loadAddresses(currentUser.id)
      }
    }
  }, [])

  const loadAddresses = (userId: string) => {
    const userAddresses = getUserAddresses(userId)
    setAddresses(userAddresses)
  }

  const handleOpenDialog = (address?: SavedAddress) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        label: address.label,
        address1: address.address1,
        address2: address.address2 || "",
        city: address.city,
        stateCode: address.stateCode,
        zipcode: address.zipcode,
        phone: address.phone || "",
        isDefault: address.isDefault || false,
      })
    } else {
      setEditingAddress(null)
      setFormData({
        label: "Casa",
        address1: "",
        address2: "",
        city: "",
        stateCode: "",
        zipcode: "",
        phone: "",
        isDefault: addresses.length === 0,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveAddress = () => {
    if (!formData.address1 || !formData.city || !formData.stateCode || !formData.zipcode) {
      toast.error("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    if (!user) return

    try {
      const savedAddress = saveUserAddress(user.id, {
        ...formData,
        id: editingAddress?.id,
        country: "BR",
      })
      
      if (savedAddress) {
        // Reload addresses from centralized storage
        loadAddresses(user.id)
        toast.success(editingAddress ? "Endereço atualizado com sucesso!" : "Endereço adicionado com sucesso!")
        setIsDialogOpen(false)
        setEditingAddress(null)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar endereço")
    }
  }

  const handleDeleteAddress = (id: string) => {
    if (!user) return
    
    const success = deleteUserAddress(user.id, id)
    if (success) {
      loadAddresses(user.id)
      toast.success("Endereço removido com sucesso")
    } else {
      toast.error("Erro ao remover endereço")
    }
  }

  const handleSetDefault = (id: string) => {
    if (!user) return
    
    try {
      const updatedAddress = setDefaultAddress(user.id, id)
      if (updatedAddress) {
        loadAddresses(user.id)
        toast.success("Endereço padrão atualizado!")
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar endereço padrão")
    }
  }

  return (
    <PageContainer className="space-y-6">
      {/* Header with M3 styling */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div data-tour="addresses" className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--md-sys-color-secondary-container)] shadow-md">
            <MapPin className="h-7 w-7 text-[var(--md-sys-color-on-secondary-container)]" />
          </div>
          <div>
            <h1 className="m3-headline-medium font-bold text-[var(--md-sys-color-on-surface)]">
              Meus Endereços
            </h1>
            <p className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)] mt-1">
              Gerencie seus endereços de entrega
            </p>
          </div>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="rounded-full px-6 py-3 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:bg-[var(--md-sys-color-primary)]/90 shadow-md transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Endereço
        </Button>
      </motion.div>

      {/* Gamification hint */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--md-sys-color-tertiary-container)]/50 border border-[var(--md-sys-color-tertiary-container)]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--md-sys-color-tertiary-container)]">
          <Sparkles className="h-5 w-5 text-[var(--md-sys-color-on-tertiary-container)]" />
        </div>
        <div className="flex-1">
          <p className="m3-label-large text-[var(--md-sys-color-on-tertiary-container)]">
            Dica de Gamificação
          </p>
          <p className="m3-body-small text-[var(--md-sys-color-on-tertiary-container)]/80">
            Mantenha seu endereço atualizado para receber seus prêmios mais rápido!
          </p>
        </div>
        <Star className="h-6 w-6 text-[var(--md-sys-color-tertiary)] animate-pulse" />
      </motion.div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="m3-shape-extra-large bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)]/30 p-12 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--md-sys-color-surface-container-high)] mx-auto mb-4">
            <Navigation className="h-10 w-10 text-[var(--md-sys-color-on-surface-variant)]" />
          </div>
          <h3 className="m3-title-large text-[var(--md-sys-color-on-surface)] mb-2">
            Nenhum endereço cadastrado
          </h3>
          <p className="m3-body-medium text-[var(--md-sys-color-on-surface-variant)] mb-6">
            Adicione um endereço para facilitar suas compras e receber seus prêmios
          </p>
          <Button 
            onClick={() => handleOpenDialog()}
            className="rounded-full px-6 py-3 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:bg-[var(--md-sys-color-primary)]/90 shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Primeiro Endereço
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardVariants}
                layout
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative m3-shape-large overflow-hidden transition-all duration-300",
                  "bg-[var(--md-sys-color-surface-container-low)]",
                  "border-2",
                  address.isDefault 
                    ? "border-[var(--md-sys-color-primary)] shadow-lg ring-2 ring-[var(--md-sys-color-primary)]/20" 
                    : "border-[var(--md-sys-color-outline-variant)]/30 hover:border-[var(--md-sys-color-outline)]/50 hover:shadow-md"
                )}
              >
                {/* Default badge with glow effect */}
                {address.isDefault && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--md-sys-color-primary)] via-[var(--md-sys-color-tertiary)] to-[var(--md-sys-color-primary)]" />
                )}

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                        address.isDefault 
                          ? "bg-[var(--md-sys-color-primary-container)] shadow-md" 
                          : "bg-[var(--md-sys-color-surface-container-high)]"
                      )}>
                        {address.label.toLowerCase().includes("casa") || address.label.toLowerCase().includes("home") ? (
                          <Home className={cn(
                            "h-6 w-6",
                            address.isDefault 
                              ? "text-[var(--md-sys-color-on-primary-container)]" 
                              : "text-[var(--md-sys-color-on-surface-variant)]"
                          )} />
                        ) : (
                          <Building2 className={cn(
                            "h-6 w-6",
                            address.isDefault 
                              ? "text-[var(--md-sys-color-on-primary-container)]" 
                              : "text-[var(--md-sys-color-on-surface-variant)]"
                          )} />
                        )}
                      </div>
                      <div>
                        <h3 className="m3-title-medium font-semibold text-[var(--md-sys-color-on-surface)]">
                          {address.label}
                        </h3>
                        {address.isDefault && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]">
                            <CheckCircle2 className="h-3 w-3" />
                            Padrão
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address details */}
                  <div className="space-y-1 mb-4 pl-1">
                    <p className="m3-body-medium font-medium text-[var(--md-sys-color-on-surface)]">
                      {address.address1}
                    </p>
                    {address.address2 && (
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                        {address.address2}
                      </p>
                    )}
                    <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                      {address.city} - {address.stateCode}
                    </p>
                    <p className="m3-body-small font-mono text-[var(--md-sys-color-on-surface-variant)]">
                      CEP: {address.zipcode}
                    </p>
                    {address.phone && (
                      <p className="m3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                        Tel: {address.phone}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/30">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        className="flex-1 rounded-full border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)]/50"
                      >
                        Definir como Padrão
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(address)}
                      className="h-9 w-9 rounded-full hover:bg-[var(--md-sys-color-surface-container-high)]"
                    >
                      <Edit className="h-4 w-4 text-[var(--md-sys-color-on-surface-variant)]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="h-9 w-9 rounded-full hover:bg-[var(--md-sys-color-error-container)]"
                    >
                      <Trash2 className="h-4 w-4 text-[var(--md-sys-color-error)]" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Dialog with M3 styling */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '28px',
            bgcolor: 'var(--md-sys-color-surface-container-high)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--md-sys-color-primary-container)]">
              <MapPin className="h-5 w-5 text-[var(--md-sys-color-on-primary-container)]" />
            </div>
            <span className="m3-title-large font-semibold text-[var(--md-sys-color-on-surface)]">
              {editingAddress ? "Editar Endereço" : "Novo Endereço"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDialogOpen(false)}
            className="h-10 w-10 rounded-full hover:bg-[var(--md-sys-color-surface-container-highest)]"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogTitle>
        <DialogContent dividers sx={{ 
          borderColor: 'var(--md-sys-color-outline-variant)',
          bgcolor: 'var(--md-sys-color-surface-container-low)',
        }}>
          <div className="flex flex-col gap-5 py-4">
            <div className="space-y-2">
              <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">
                Rótulo do Endereço
              </Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Casa, Trabalho, etc."
                className="rounded-xl border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">
                Endereço *
              </Label>
              <Input
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                placeholder="Rua, número"
                required
                className="rounded-xl border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">
                Complemento
              </Label>
              <Input
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                placeholder="Apartamento, bloco, etc."
                className="rounded-xl border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">
                  Cidade *
                </Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Cidade"
                  required
                  className="rounded-xl border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">
                  Estado *
                </Label>
                <Input
                  value={formData.stateCode}
                  onChange={(e) => setFormData({ ...formData, stateCode: e.target.value.toUpperCase() })}
                  placeholder="UF"
                  maxLength={2}
                  required
                  className="rounded-xl border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">
                  CEP *
                </Label>
                <Input
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  placeholder="00000-000"
                  required
                  className="rounded-xl border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="m3-label-large text-[var(--md-sys-color-on-surface)]">
                  Telefone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="rounded-xl border-[var(--md-sys-color-outline)] focus:border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface)]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                className="border-[var(--md-sys-color-outline)] data-[state=checked]:bg-[var(--md-sys-color-primary)] data-[state=checked]:border-[var(--md-sys-color-primary)]"
              />
              <Label htmlFor="isDefault" className="m3-body-medium text-[var(--md-sys-color-on-surface)] cursor-pointer">
                Definir como endereço padrão
              </Label>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          gap: 2,
          bgcolor: 'var(--md-sys-color-surface-container-high)',
        }}>
          <Button 
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="rounded-full px-6 border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveAddress}
            className="rounded-full px-6 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:bg-[var(--md-sys-color-primary)]/90"
          >
            {editingAddress ? "Salvar Alterações" : "Adicionar Endereço"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  )
}
