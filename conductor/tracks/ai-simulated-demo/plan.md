# Track: ai-simulated-demo

## Contexto
Implementação de uma experiência de demonstração dinâmica e personalizada usando a API do Gemini e o conceito de 'Assistente da Demo' para geração de produtos e cenários realistas baseados no perfil do cliente.

## Objetivos
- [x] Criar fluxo de onboarding com chat de descoberta (Gemini)
- [x] Implementar geração de produtos e swags via AI (Assistente da Demo)
- [x] Desenvolver simulador de comportamento (pedidos fantasmas, conquistas)
- [x] Criar alternador de perspectiva (Gestor vs Membro)
- [x] Integrar Assistente de Demo híbrido (Chat + Ações Rápidas)
- [x] Implementar upload de logo da empresa e branding dinâmico
- [x] Criar sistema de geração contínua de produtos via AI Assistant

## Implementação

### Fase 1: Onboarding & Perfil (AI Discovery) ✅
- [x] Criar componente `app/onboarding/ai-discovery.tsx`
- [x] Implementar hook `hooks/use-ai-demo.ts` para integração com Gemini
- [x] Atualizar `lib/seeders.ts` para suportar cenários gerados por AI
- [x] Adicionar upload de logo no chat de descoberta
- [x] Integrar logo no perfil da empresa (Base64 storage)

### Fase 2: Geração de Conteúdo (Assistente da Demo) ✅
- [x] Criar lógica de geração de produtos/swags baseada no nicho detectado
- [x] Implementar visualização personalizada na `/loja`
- [x] Criar componente `BrandedProductImage` para sobreposição de logo
- [x] Atualizar `/loja` e `/loja/produto/[id]` para usar branding dinâmico

### Fase 3: Multi-Role & Assistente ✅
- [x] Criar `components/demo/perspective-switcher.tsx`
- [x] Criar `components/demo/ai-assistant.tsx`
- [x] Implementar geração contínua de produtos via AI Assistant
- [x] Adicionar botão "Gerar Itens" no AI Assistant
- [x] Criar `components/demo/demo-wrapper.tsx` para integração global

### Fase 4: Branding & Visual Enhancement ✅
- [x] Criar `components/demo/branded-product-image.tsx`
- [x] Integrar logo overlay em todos os produtos da loja
- [x] Atualizar API route para suportar prompts customizados de geração

## Arquivos Criados/Modificados
- `conductor/tracks/ai-simulated-demo/plan.md`
- `app/onboarding/page.tsx` (modificado para incluir discovery)
- `app/onboarding/ai-discovery.tsx` (criado - chat com upload de logo)
- `hooks/use-ai-demo.ts` (criado - integração com Gemini)
- `app/api/demo/ai/route.ts` (criado - API route para Gemini)
- `components/demo/branded-product-image.tsx` (criado - overlay de logo)
- `components/demo/ai-assistant.tsx` (criado - assistente híbrido)
- `components/demo/perspective-switcher.tsx` (criado - alternador de roles)
- `components/demo/demo-wrapper.tsx` (criado - wrapper global)
- `app/loja/page.tsx` (modificado - usa BrandedProductImage)
- `app/loja/produto/[id]/page.tsx` (modificado - usa BrandedProductImage)
- `app/layout.tsx` (modificado - inclui DemoWrapper)
- `lib/seeders.ts` (modificado - adiciona seedAIScenario)

## Resultados
✅ Sistema completo de demo AI implementado:
- Chat de descoberta com upload de logo funcional
- Geração de produtos personalizados via Assistente da Demo
- Branding dinâmico aplicado em todos os produtos
- Assistente AI com geração contínua de itens
- Alternador de perspectiva para demo multi-role
- Simulação comportamental com histórico de pedidos
