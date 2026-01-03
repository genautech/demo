'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Material Design 3 Button Component
 * 
 * Implements M3 button specifications:
 * - Filled, Outlined, Text, Elevated, Tonal variants
 * - Proper ripple effect
 * - Icon support
 * - Loading states
 */

const m3ButtonVariants = cva(
  // Base styles following M3 specs
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full
   text-sm font-medium transition-all duration-200
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-38
   active:scale-[0.98]
   [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        // Filled button - high emphasis
        filled: `
          bg-primary text-primary-foreground
          hover:shadow-md hover:bg-primary/90
          focus-visible:ring-primary
        `,
        // Outlined button - medium emphasis
        outlined: `
          border border-outline bg-transparent text-primary
          hover:bg-primary/8
          focus-visible:ring-primary
        `,
        // Text button - low emphasis
        text: `
          bg-transparent text-primary
          hover:bg-primary/8
          focus-visible:ring-primary
        `,
        // Elevated button - medium emphasis with shadow
        elevated: `
          bg-surface-container-low text-primary
          shadow-sm hover:shadow-md
          hover:bg-surface-container
          focus-visible:ring-primary
        `,
        // Tonal button - secondary emphasis
        tonal: `
          bg-secondary-container text-secondary-foreground
          hover:shadow-sm hover:bg-secondary-container/90
          focus-visible:ring-secondary
        `,
        // FAB - Floating Action Button
        fab: `
          bg-primary-container text-on-primary-container
          shadow-lg hover:shadow-xl
          hover:bg-primary-container/90
          focus-visible:ring-primary
        `,
        // Destructive
        destructive: `
          bg-error text-on-error
          hover:shadow-md hover:bg-error/90
          focus-visible:ring-error
        `,
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
        fab: 'h-14 w-14 p-0',
        'fab-extended': 'h-14 px-6',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  }
)

export interface M3ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof m3ButtonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

const M3Button = React.forwardRef<HTMLButtonElement, M3ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    icon,
    trailingIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    
    return (
      <Comp
        className={cn(m3ButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : icon}
        {children}
        {trailingIcon}
      </Comp>
    )
  }
)
M3Button.displayName = 'M3Button'

export { M3Button, m3ButtonVariants }
