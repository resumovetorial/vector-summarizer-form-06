
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  accessLevelId: number;
  active: boolean;
  assignedLocalities: string[];
  supabaseId?: string; // Adding supabaseId for integration with Supabase
}

export interface AccessLevel {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

// Este é o tipo completo do banco de dados para níveis de acesso do Supabase
export interface AccessLevelDB {
  id: string; // UUID no Supabase
  name: string;
  description: string | null;
  permissions: string[];
  created_at: string;
  updated_at: string;
}
