/**
 * Material Design 3 (M3) Theme Configuration
 * 
 * This module provides M3 design tokens and utilities for the project.
 * Integrates with the existing Tailwind CSS setup.
 */

// M3 Color Roles - mapped to CSS custom properties
export const m3Colors = {
  // Primary colors
  primary: 'var(--md-sys-color-primary)',
  onPrimary: 'var(--md-sys-color-on-primary)',
  primaryContainer: 'var(--md-sys-color-primary-container)',
  onPrimaryContainer: 'var(--md-sys-color-on-primary-container)',
  
  // Secondary colors
  secondary: 'var(--md-sys-color-secondary)',
  onSecondary: 'var(--md-sys-color-on-secondary)',
  secondaryContainer: 'var(--md-sys-color-secondary-container)',
  onSecondaryContainer: 'var(--md-sys-color-on-secondary-container)',
  
  // Tertiary colors
  tertiary: 'var(--md-sys-color-tertiary)',
  onTertiary: 'var(--md-sys-color-on-tertiary)',
  tertiaryContainer: 'var(--md-sys-color-tertiary-container)',
  onTertiaryContainer: 'var(--md-sys-color-on-tertiary-container)',
  
  // Error colors
  error: 'var(--md-sys-color-error)',
  onError: 'var(--md-sys-color-on-error)',
  errorContainer: 'var(--md-sys-color-error-container)',
  onErrorContainer: 'var(--md-sys-color-on-error-container)',
  
  // Surface colors
  surface: 'var(--md-sys-color-surface)',
  onSurface: 'var(--md-sys-color-on-surface)',
  surfaceVariant: 'var(--md-sys-color-surface-variant)',
  onSurfaceVariant: 'var(--md-sys-color-on-surface-variant)',
  
  // Background
  background: 'var(--md-sys-color-background)',
  onBackground: 'var(--md-sys-color-on-background)',
  
  // Outline
  outline: 'var(--md-sys-color-outline)',
  outlineVariant: 'var(--md-sys-color-outline-variant)',
  
  // Inverse
  inverseSurface: 'var(--md-sys-color-inverse-surface)',
  inverseOnSurface: 'var(--md-sys-color-inverse-on-surface)',
  inversePrimary: 'var(--md-sys-color-inverse-primary)',
  
  // Shadow & Scrim
  shadow: 'var(--md-sys-color-shadow)',
  scrim: 'var(--md-sys-color-scrim)',
  
  // Surface tones
  surfaceDim: 'var(--md-sys-color-surface-dim)',
  surfaceBright: 'var(--md-sys-color-surface-bright)',
  surfaceContainerLowest: 'var(--md-sys-color-surface-container-lowest)',
  surfaceContainerLow: 'var(--md-sys-color-surface-container-low)',
  surfaceContainer: 'var(--md-sys-color-surface-container)',
  surfaceContainerHigh: 'var(--md-sys-color-surface-container-high)',
  surfaceContainerHighest: 'var(--md-sys-color-surface-container-highest)',
}

// M3 Typography Scale
export const m3Typography = {
  displayLarge: {
    fontSize: '57px',
    lineHeight: '64px',
    fontWeight: 400,
    letterSpacing: '-0.25px',
  },
  displayMedium: {
    fontSize: '45px',
    lineHeight: '52px',
    fontWeight: 400,
    letterSpacing: '0px',
  },
  displaySmall: {
    fontSize: '36px',
    lineHeight: '44px',
    fontWeight: 400,
    letterSpacing: '0px',
  },
  headlineLarge: {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 400,
    letterSpacing: '0px',
  },
  headlineMedium: {
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: 400,
    letterSpacing: '0px',
  },
  headlineSmall: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 400,
    letterSpacing: '0px',
  },
  titleLarge: {
    fontSize: '22px',
    lineHeight: '28px',
    fontWeight: 400,
    letterSpacing: '0px',
  },
  titleMedium: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: '0.15px',
  },
  titleSmall: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 500,
    letterSpacing: '0.1px',
  },
  bodyLarge: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    letterSpacing: '0.5px',
  },
  bodyMedium: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    letterSpacing: '0.25px',
  },
  bodySmall: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0.4px',
  },
  labelLarge: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 500,
    letterSpacing: '0.1px',
  },
  labelMedium: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: '0.5px',
  },
  labelSmall: {
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: '0.5px',
  },
}

// M3 Elevation Levels (using shadow)
export const m3Elevation = {
  level0: 'none',
  level1: '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
  level2: '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
  level3: '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.3)',
  level4: '0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px 0 rgba(0,0,0,0.3)',
  level5: '0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px 0 rgba(0,0,0,0.3)',
}

// M3 Shape Scale (border radius)
export const m3Shape = {
  none: '0px',
  extraSmall: '4px',
  small: '8px',
  medium: '12px',
  large: '16px',
  extraLarge: '28px',
  full: '9999px',
}

// M3 Motion (easing and duration)
export const m3Motion = {
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  },
  duration: {
    short1: '50ms',
    short2: '100ms',
    short3: '150ms',
    short4: '200ms',
    medium1: '250ms',
    medium2: '300ms',
    medium3: '350ms',
    medium4: '400ms',
    long1: '450ms',
    long2: '500ms',
    long3: '550ms',
    long4: '600ms',
    extraLong1: '700ms',
    extraLong2: '800ms',
    extraLong3: '900ms',
    extraLong4: '1000ms',
  },
}

// Utility to generate CSS variables
export function generateM3CSSVariables(seedColor: string = '#6750A4') {
  // This would typically use @material/material-color-utilities
  // For now, returning a static theme based on the default M3 purple
  return `
    :root {
      /* M3 Light Theme Colors */
      --md-sys-color-primary: #6750A4;
      --md-sys-color-on-primary: #FFFFFF;
      --md-sys-color-primary-container: #EADDFF;
      --md-sys-color-on-primary-container: #21005D;
      --md-sys-color-secondary: #625B71;
      --md-sys-color-on-secondary: #FFFFFF;
      --md-sys-color-secondary-container: #E8DEF8;
      --md-sys-color-on-secondary-container: #1D192B;
      --md-sys-color-tertiary: #7D5260;
      --md-sys-color-on-tertiary: #FFFFFF;
      --md-sys-color-tertiary-container: #FFD8E4;
      --md-sys-color-on-tertiary-container: #31111D;
      --md-sys-color-error: #B3261E;
      --md-sys-color-on-error: #FFFFFF;
      --md-sys-color-error-container: #F9DEDC;
      --md-sys-color-on-error-container: #410E0B;
      --md-sys-color-background: #FFFBFE;
      --md-sys-color-on-background: #1C1B1F;
      --md-sys-color-surface: #FFFBFE;
      --md-sys-color-on-surface: #1C1B1F;
      --md-sys-color-surface-variant: #E7E0EC;
      --md-sys-color-on-surface-variant: #49454F;
      --md-sys-color-outline: #79747E;
      --md-sys-color-outline-variant: #CAC4D0;
      --md-sys-color-shadow: #000000;
      --md-sys-color-scrim: #000000;
      --md-sys-color-inverse-surface: #313033;
      --md-sys-color-inverse-on-surface: #F4EFF4;
      --md-sys-color-inverse-primary: #D0BCFF;
      --md-sys-color-surface-dim: #DED8E1;
      --md-sys-color-surface-bright: #FFFBFE;
      --md-sys-color-surface-container-lowest: #FFFFFF;
      --md-sys-color-surface-container-low: #F7F2FA;
      --md-sys-color-surface-container: #F3EDF7;
      --md-sys-color-surface-container-high: #ECE6F0;
      --md-sys-color-surface-container-highest: #E6E0E9;
    }
    
    .dark {
      /* M3 Dark Theme Colors */
      --md-sys-color-primary: #D0BCFF;
      --md-sys-color-on-primary: #381E72;
      --md-sys-color-primary-container: #4F378B;
      --md-sys-color-on-primary-container: #EADDFF;
      --md-sys-color-secondary: #CCC2DC;
      --md-sys-color-on-secondary: #332D41;
      --md-sys-color-secondary-container: #4A4458;
      --md-sys-color-on-secondary-container: #E8DEF8;
      --md-sys-color-tertiary: #EFB8C8;
      --md-sys-color-on-tertiary: #492532;
      --md-sys-color-tertiary-container: #633B48;
      --md-sys-color-on-tertiary-container: #FFD8E4;
      --md-sys-color-error: #F2B8B5;
      --md-sys-color-on-error: #601410;
      --md-sys-color-error-container: #8C1D18;
      --md-sys-color-on-error-container: #F9DEDC;
      --md-sys-color-background: #1C1B1F;
      --md-sys-color-on-background: #E6E1E5;
      --md-sys-color-surface: #1C1B1F;
      --md-sys-color-on-surface: #E6E1E5;
      --md-sys-color-surface-variant: #49454F;
      --md-sys-color-on-surface-variant: #CAC4D0;
      --md-sys-color-outline: #938F99;
      --md-sys-color-outline-variant: #49454F;
      --md-sys-color-shadow: #000000;
      --md-sys-color-scrim: #000000;
      --md-sys-color-inverse-surface: #E6E1E5;
      --md-sys-color-inverse-on-surface: #313033;
      --md-sys-color-inverse-primary: #6750A4;
      --md-sys-color-surface-dim: #141218;
      --md-sys-color-surface-bright: #3B383E;
      --md-sys-color-surface-container-lowest: #0F0D13;
      --md-sys-color-surface-container-low: #1D1B20;
      --md-sys-color-surface-container: #211F26;
      --md-sys-color-surface-container-high: #2B2930;
      --md-sys-color-surface-container-highest: #36343B;
    }
  `
}
