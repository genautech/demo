'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Material Design 3 Card Component
 * 
 * Implements M3 card specifications:
 * - Elevated, Filled, Outlined variants
 * - Proper shadow and border radius
 * - Interactive states
 */

const m3CardVariants = cva(
  // Base styles following M3 specs
  `rounded-xl transition-all duration-200`,
  {
    variants: {
      variant: {
        // Elevated card - default with shadow
        elevated: `
          bg-surface-container-low
          shadow-sm hover:shadow-md
        `,
        // Filled card - no shadow, filled background
        filled: `
          bg-surface-container-highest
        `,
        // Outlined card - border, no shadow
        outlined: `
          bg-surface
          border border-outline-variant
        `,
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'elevated',
      interactive: false,
    },
  }
)

export interface M3CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof m3CardVariants> {}

const M3Card = React.forwardRef<HTMLDivElement, M3CardProps>(
  ({ className, variant, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(m3CardVariants({ variant, interactive, className }))}
      {...props}
    />
  )
)
M3Card.displayName = 'M3Card'

const M3CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
M3CardHeader.displayName = 'M3CardHeader'

const M3CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-medium leading-none tracking-tight text-on-surface',
      className
    )}
    {...props}
  />
))
M3CardTitle.displayName = 'M3CardTitle'

const M3CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-on-surface-variant', className)}
    {...props}
  />
))
M3CardDescription.displayName = 'M3CardDescription'

const M3CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
M3CardContent.displayName = 'M3CardContent'

const M3CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
M3CardFooter.displayName = 'M3CardFooter'

const M3CardMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string }
>(({ className, src, alt, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative overflow-hidden rounded-t-xl', className)}
    {...props}
  >
    {src ? (
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
    ) : (
      children
    )}
  </div>
))
M3CardMedia.displayName = 'M3CardMedia'

export {
  M3Card,
  M3CardHeader,
  M3CardFooter,
  M3CardTitle,
  M3CardDescription,
  M3CardContent,
  M3CardMedia,
  m3CardVariants,
}
