
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kyuzpbomewcbkwyyfuds.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXpwYm9tZXdjYmt3eXlmdWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODc5ODksImV4cCI6MjA2MTE2Mzk4OX0.dB86VqJD3Ih8e0Uc2DL6PyVs73ChH4p3FTzCR1pLUXc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});
