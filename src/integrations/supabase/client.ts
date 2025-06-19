
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vncrtcnamqrycndixycd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuY3J0Y25hbXFyeWNuZGl4eWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODQ1MDUsImV4cCI6MjA1NzM2MDUwNX0.PtQ2HGUAIVBC1vTpu6ndZNIFJUN6QlFxB-fgEh5I2Cc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'apikey': SUPABASE_PUBLISHABLE_KEY,
      'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  }
});
