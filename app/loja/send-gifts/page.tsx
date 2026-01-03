"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, Package, Send, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { getProducts, getUsers, type User, type Product } from "@/lib/storage"
import { InventorySelector } from "@/components/gifts/InventorySelector"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SendGiftsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Carregar dados iniciais
    setProducts(getProducts())
    setUsers(getUsers())
  }, [])

  const handleToggleRecipient = (email: string) => {
    setSelectedRecipients(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    )
  }

  const handleSubmit = async () => {
    if (selectedRecipients.length === 0 || selectedItems.length === 0 || !scheduledDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmitting(true)
    try {
      const recipientData = selectedRecipients.map(email => {
        const user = users.find(u => u.email === email)!
        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address || {
            address1: "Endereço não informado",
            city: "Cidade não informada",
            stateCode: "UF",
            zipcode: "00000-000"
          }
        }
      })

      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: "admin@yoobe.com.br", // Demo default
          recipients: recipientData,
          items: selectedItems,
          scheduledDate: scheduledDate.toISOString(),
          message
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Presentes agendados com sucesso!")
        router.push("/loja")
      } else {
        toast.error(data.error || "Erro ao agendar presentes")
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enviar Presentes</h1>
            <p className="text-muted-foreground">Agende o envio de itens do estoque para membros da equipe</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
            <span className={cn("px-2 py-1 rounded", step === 1 ? "bg-primary text-primary-foreground" : "bg-muted")}>1. Itens</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className={cn("px-2 py-1 rounded", step === 2 ? "bg-primary text-primary-foreground" : "bg-muted")}>2. Destinatários</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className={cn("px-2 py-1 rounded", step === 3 ? "bg-primary text-primary-foreground" : "bg-muted")}>3. Agendamento</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Selecionar Itens
              </CardTitle>
              <CardDescription>Escolha os produtos do estoque corporativo para o presente</CardDescription>
            </CardHeader>
            <CardContent>
              <InventorySelector 
                products={products} 
                onSelect={setSelectedItems} 
              />
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={selectedItems.length === 0}
                >
                  Próximo: Destinatários
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Selecionar Destinatários
              </CardTitle>
              <CardDescription>Para quem você deseja enviar esses presentes?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                  {users.map((user) => (
                    <div key={user.email} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Checkbox 
                        id={`user-${user.email}`} 
                        checked={selectedRecipients.includes(user.email)}
                        onCheckedChange={() => handleToggleRecipient(user.email)}
                      />
                      <label 
                        htmlFor={`user-${user.email}`}
                        className="flex-1 flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant="outline">{user.level}</Badge>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    disabled={selectedRecipients.length === 0}
                  >
                    Próximo: Agendamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Agendar Entrega
              </CardTitle>
              <CardDescription>Escolha a data e adicione uma mensagem opcional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Data de Envio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">O estoque será reservado imediatamente.</p>
                </div>
                <div className="space-y-2">
                  <Label>Mensagem (Opcional)</Label>
                  <Textarea 
                    placeholder="Escreva uma mensagem carinhosa..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg space-y-3 border border-primary/10">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Resumo do Agendamento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Itens</p>
                    <p className="font-medium">{selectedItems.reduce((acc, item) => acc + item.quantity, 0)} unidades de {selectedItems.length} produtos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Destinatários</p>
                    <p className="font-medium">{selectedRecipients.length} membros da equipe</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Envio</p>
                    <p className="font-medium">{scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    "Agendando..."
                  ) : (
                    <>
                      Confirmar e Agendar
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
