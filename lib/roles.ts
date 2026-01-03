/**
 * Tipos de papéis de usuário no sistema
 */
export type UserRole = 'member' | 'manager' | 'superAdmin' | 'gestor';

/**
 * Definição de permissões por papel
 */
export interface RolePermissions {
  role: UserRole;
  description: string;
  allowedAreas: string[]; // Prefixos de rotas permitidos
}

/**
 * Hierarquia de papéis
 */
export const ROLE_HIERARCHY: Record<UserRole | 'gestor', number> = {
  member: 1,
  manager: 2,
  gestor: 2,
  superAdmin: 3,
};

/**
 * Mapeamento de rotas por papel
 */
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  member: {
    role: 'member',
    description: 'Funcionário que resgata itens',
    allowedAreas: ['/dashboard', '/membro', '/loja', '/onboarding', '/demo-guide', '/documentacao', '/solucoes'],
  },
  manager: {
    role: 'manager',
    description: 'Gestor que gerencia tudo da conta, incluindo membros e produtos relacionados à sua loja',
    allowedAreas: ['/dashboard', '/gestor', '/loja', '/membro', '/onboarding', '/demo-guide', '/documentacao', '/solucoes'],
  },
  gestor: {
    role: 'manager',
    description: 'Gestor que gerencia tudo da conta, incluindo membros e produtos relacionados à sua loja',
    allowedAreas: ['/dashboard', '/gestor', '/loja', '/membro', '/onboarding', '/demo-guide', '/documentacao', '/solucoes'],
  },
  superAdmin: {
    role: 'superAdmin',
    description: 'Administrador geral que gerencia todos os clientes, usuários e features deles',
    allowedAreas: ['/dashboard', '/super-admin', '/gestor', '/loja', '/membro', '/onboarding', '/demo-guide', '/documentacao', '/solucoes'],
  },
};

/**
 * Verifica se um papel pode acessar uma rota específica
 */
export function canAccess(role: UserRole, path: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) {
    return false;
  }

  // superAdmin acessa tudo
  if (role === 'superAdmin') return true;

  const hasAccess = permissions.allowedAreas.some(area => path.startsWith(area));
  return hasAccess;
}

/**
 * Verifica se um papel tem pelo menos o nível de acesso requerido
 */
export function hasRequiredLevel(currentRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[requiredRole];
}
