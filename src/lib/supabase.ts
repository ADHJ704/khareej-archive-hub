
import { createClient } from '@supabase/supabase-js';

// Use the environment variables or get from the supabase client file
const supabaseUrl = "https://kyuzpbomewcbkwyyfuds.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXpwYm9tZXdjYmt3eXlmdWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODc5ODksImV4cCI6MjA2MTE2Mzk4OX0.dB86VqJD3Ih8e0Uc2DL6PyVs73ChH4p3FTzCR1pLUXc";

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

// Function to sign up a new user
export const signUpUser = async (
  email: string, 
  password: string, 
  role: 'trainee' | 'supervisor'
) => {
  // 1. Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw authError;
  }

  if (authData?.user) {
    // 2. Update the user's role in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', authData.user.id);

    if (profileError) {
      throw profileError;
    }
  }

  return authData;
};

// Check if the user is a trainee
export const isTrainee = async (userId: string) => {
  const role = await getUserRole(userId);
  return role === 'trainee';
};

// Check if the user is a supervisor
export const isSupervisor = async (userId: string) => {
  const role = await getUserRole(userId);
  return role === 'supervisor';
};
