"use client"

import { useDemoState } from "@/hooks/use-demo-state"
import { useEventLogs } from "@/hooks/use-console-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Terminal, Search, Filter, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function LogsPage() {
  const { env } = useDemoState()
  const { logs, isLoading } = useEventLogs(env)
  const [search, setSearch] = useState("")

  const filteredLogs = logs.filter(log => 
    log.type.toLowerCase().includes(search.toLowerCase()) || 
    log.traceId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Logs</h1>
          <p className="text-muted-foreground text-sm">Rastreie cada evento que passa pelo Yoobe no ambiente {env}.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filtrar por evento ou Trace ID..." 
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead className="text-right">Trace ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Carregando logs...</TableCell></TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Terminal className="h-8 w-8 opacity-20" />
                      <p>Nenhum log de evento encontrado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] font-bold uppercase",
                          log.status === "ok" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-slate-900">{log.type}</span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                          {JSON.stringify(log.payloadPreview)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="ghost" className="text-[10px] bg-slate-100 text-slate-600 capitalize">
                        {log.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[10px] text-muted-foreground">
                      {log.traceId}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 p-3 rounded border border-dashed">
        <Info className="h-4 w-4 text-blue-500" />
        Os logs são retidos por 7 dias em Sandbox e 30 dias em Production. Em modo demo, são salvos no seu navegador.
      </div>
    </div>
  )
}

