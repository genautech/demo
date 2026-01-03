'use client'

import * as React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

interface ResponsiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  contentClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
}

/**
 * ResponsiveModal - Modal responsivo que usa Dialog em desktop e Drawer em mobile
 * 
 * IMPORTANTE: O footer é sempre visível (sticky) no final do modal.
 * O conteúdo é scrollável independentemente, garantindo que os botões
 * de ação nunca fiquem escondidos.
 * 
 * @see conductor/CHANGELOG.md - Erro de footer cortado corrigido
 */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
  maxWidth = 'lg',
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    full: 'sm:max-w-full',
  }

  // Default to desktop on SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            maxWidthClasses[maxWidth],
            'max-h-[90vh] flex flex-col overflow-hidden',
            contentClassName
          )}
        >
          {title && (
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          <div className={cn('py-2 flex-1 overflow-y-auto', className)}>{children}</div>
          {footer && (
            <DialogFooter className="gap-2 shrink-0 border-t pt-4 mt-2 bg-background">
              {footer}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className={cn('max-h-[90vh] flex flex-col overflow-hidden', contentClassName)}
        >
          {title && (
            <DrawerHeader className="text-left shrink-0">
              <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
              {description && (
                <DrawerDescription className="text-sm text-muted-foreground">
                  {description}
                </DrawerDescription>
              )}
            </DrawerHeader>
          )}
          <div className={cn('px-4 pb-4 flex-1 overflow-y-auto', className)}>{children}</div>
          {footer && (
            <DrawerFooter className="gap-2 shrink-0 border-t pt-4 bg-background">
              {footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          maxWidthClasses[maxWidth],
          'max-h-[90vh] flex flex-col overflow-hidden',
          contentClassName
        )}
      >
        {title && (
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className={cn('py-2 flex-1 overflow-y-auto', className)}>{children}</div>
        {footer && (
          <DialogFooter className="gap-2 shrink-0 border-t pt-4 mt-2 bg-background">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
