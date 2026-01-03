import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Minhas Demos | Yoobe",
  description: "Gerencie suas demos salvas",
}

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  )
}
