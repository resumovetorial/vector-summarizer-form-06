
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database/types';

// Definir diretamente as credenciais do Supabase
const supabaseUrl = 'https://vncrtcnamqrycndixycd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuY3J0Y25hbXFyeWNuZGl4eWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODQ1MDUsImV4cCI6MjA1NzM2MDUwNX0.PtQ2HGUAIVBC1vTpu6ndZNIFJUN6QlFxB-fgEh5I2Cc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
