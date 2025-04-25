
import { createClient } from '@supabase/supabase-js';

// Default values for development (these should be replaced with your actual values)
const DEFAULT_SUPABASE_URL = 'https://your-supabase-project-id.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-supabase-anon-key';

// Try to get from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for checking if a user is logged in
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  return data.session.user;
};

// Helper for checking user role
export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data.role;
};
