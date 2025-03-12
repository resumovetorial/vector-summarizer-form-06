
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
