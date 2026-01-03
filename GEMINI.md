# Gemini Project Context

This project uses the Conductor extension for Gemini CLI to maintain a shared "brain" for the team.

## Current Focus
- **CONSOLIDATED**: All development tracks for 2025-12-31 are completed and documented.
- **Refinement**: Polishing the AI-generated swags and logistics workflow.
- **Modernization**: Design System v0 fully implemented with enhanced tactile feedback and animations.
- **Stitch Integration**: Sophisticated Fun Mode with hexagonal patterns and celebration effects.
- **Scale**: Ensuring the catalog master and replication systems support multi-company expansion.

## Useful Commands
- `./conductor.sh sync`: **(NEW)** Auto-sync docs with code and refresh Conductor brain.
- `./conductor.sh conductor new track`: Start a new development track.
- `./conductor.sh conductor implement`: Implement the current plan.

## Design System & Visual Patterns

### Design Reference
The project follows design patterns inspired by **v0 by Vercel** design system:
- **Reference**: [v0 Dashboard Page - Manager Design System](https://v0.app/chat/dashboard-page-manager-uNsIAgvyYGb?b=v0-preview-b_5A0jGm6CEPG&f=1&path=%2Fdesign-system)

### Visual Patterns & Libraries

#### Core Technologies
- **Framework**: Next.js 16.0.10 (App Router)
- **Styling**: Tailwind CSS v4 with `tailwindcss-animate`
- **UI Components**: Radix UI primitives + shadcn/ui components
- **Icons**: Lucide React
- **Typography**: Geist Sans & Geist Mono fonts
- **Theme**: next-themes with system preference detection

#### Design Tokens (app/globals.css)
- **Color System**: OKLCH color space for better perceptual uniformity
- **Shadows**: Multi-level shadow system (xs, sm, md, lg, xl) with proper dark mode support
- **Border Radius**: Consistent 0.625rem (10px) base radius
- **Transitions**: Smooth cubic-bezier transitions (150ms) for all interactive elements
- **Focus States**: Ring-based focus indicators with 3px ring width

#### Component Patterns

**Buttons** (`components/ui/button.tsx`):
- Active state with `scale-[0.98]` for tactile feedback
- Shadow elevation on default/destructive variants
- Smooth hover transitions with shadow elevation changes

**Cards** (`components/ui/card.tsx`):
- Rounded-xl (12px) corners
- Shadow-sm with hover:shadow-md elevation
- Smooth transition-shadow for interactive feedback

**Badges** (`components/ui/badge.tsx`):
- Shadow-sm with hover elevation
- Consistent border-radius and padding
- Transition-all for smooth state changes

**Inputs** (`components/ui/input.tsx`):
- Shadow-xs with focus-visible:shadow-sm
- Hover border color transitions
- Proper focus ring with ring/50 opacity

**Tabs** (`components/ui/tabs.tsx`):
- Muted background with shadow-sm
- Active state with background and shadow elevation
- Hover states with background/50 opacity

**Navigation** (`components/app-shell.tsx`):
- Backdrop blur (backdrop-blur-md) on header
- Shadow-sm on header with card/95 opacity
- Active navigation items with shadow-primary/20
- Smooth scale transitions on interactive elements

#### Key Design Principles
1. **Consistent Elevation**: Use shadow-sm → shadow-md progression for depth
2. **Smooth Transitions**: All interactive elements have 150ms transitions
3. **Focus Accessibility**: Ring-based focus indicators (3px width, ring/50 opacity)
4. **Dark Mode**: Full OKLCH color system support with proper contrast
5. **Tactile Feedback**: Active states use scale-[0.98] for button presses
6. **Backdrop Effects**: Modern backdrop-blur for overlays and headers

#### File Structure
- **Design Tokens**: `app/globals.css` - All CSS custom properties and theme definitions
- **Theme Provider**: `components/theme-provider.tsx` - next-themes wrapper
- **UI Components**: `components/ui/*.tsx` - All shadcn/ui components
- **App Shell**: `components/app-shell.tsx` - Main navigation and layout wrapper
