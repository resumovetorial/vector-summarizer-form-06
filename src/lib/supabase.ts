
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database/types';

// Get environment variables with fallback to the hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vncrtcnamqrycndixycd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuY3J0Y25hbXFyeWNuZGl4eWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODQ1MDUsImV4cCI6MjA1NzM2MDUwNX0.PtQ2HGUAIVBC1vTpu6ndZNIFJUN6QlFxB-fgEh5I2Cc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey
    }
  }
});
