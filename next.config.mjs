/** @type {import('next').NextConfig} */
// Force reload: 2026-01-03
const nextConfig = {
  transpilePackages: ['@/lib', '@/components'],
  typescript: {
    // Ignorar erros de TypeScript durante build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar erros de ESLint durante build
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Desabilitar Turbopack para compatibilidade
  experimental: {
    turbo: undefined,
  },
}

export default nextConfig
