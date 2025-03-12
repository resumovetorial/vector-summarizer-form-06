
import { User, AccessLevel } from '@/types/admin';

// Mock data for testing the admin panel
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@example.com',
    role: 'Administrador',
    accessLevelId: 1,
    active: true,
    assignedLocalities: ['Centro', 'Mangabinha', 'Santa Catarina', 'Pontalzinho', 'Nova Itabuna']
  },
  {
    id: 2,
    name: 'João Silva',
    email: 'joao@example.com',
    role: 'Supervisor',
    accessLevelId: 2,
    active: true,
    assignedLocalities: ['Centro', 'Mangabinha', 'Santa Catarina']
  },
  {
    id: 3,
    name: 'Maria Santos',
    email: 'maria@example.com',
    role: 'Agente',
    accessLevelId: 3,
    active: true,
    assignedLocalities: ['Centro']
  },
  {
    id: 4,
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    role: 'Agente',
    accessLevelId: 3,
    active: false,
    assignedLocalities: []
  }
];

export const mockAccessLevels: AccessLevel[] = [
  {
    id: 1,
    name: 'Administrador',
    description: 'Acesso completo ao sistema',
    permissions: ['dashboard', 'form', 'admin', 'reports', 'settings']
  },
  {
    id: 2,
    name: 'Supervisor',
    description: 'Acesso ao dashboard e formulários',
    permissions: ['dashboard', 'form', 'reports']
  },
  {
    id: 3,
    name: 'Agente',
    description: 'Acesso apenas aos formulários',
    permissions: ['form']
  }
];

// Mock functions to simulate API calls
export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 500);
  });
};

export const fetchAccessLevels = async (): Promise<AccessLevel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAccessLevels);
    }, 500);
  });
};

export const getUserAccessibleLocalities = (userId: number): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === userId);
      resolve(user ? user.assignedLocalities : []);
    }, 300);
  });
};
