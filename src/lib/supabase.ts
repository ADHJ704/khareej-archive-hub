
import { createClient } from '@supabase/supabase-js';

// استخدام المتغيرات البيئية أو الحصول عليها من ملف العميل Supabase
const supabaseUrl = "https://kyuzpbomewcbkwyyfuds.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXpwYm9tZXdjYmt3eXlmdWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1ODc5ODksImV4cCI6MjA2MTE2Mzk4OX0.dB86VqJD3Ih8e0Uc2DL6PyVs73ChH4p3FTzCR1pLUXc";

// إنشاء عميل Supabase مع تحسين خيارات التخزين والاستمرارية
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// مساعد للتحقق مما إذا كان المستخدم قد سجل الدخول
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  return data.session.user;
};

// مساعد للتحقق من دور المستخدم
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

// وظيفة لتسجيل مستخدم جديد
export const signUpUser = async (
  email: string, 
  password: string, 
  role: 'trainee' | 'supervisor'
) => {
  // 1. تسجيل المستخدم مع مصادقة Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
    }
  });

  if (authError) {
    throw authError;
  }

  if (authData?.user) {
    // 2. تحديث دور المستخدم في جدول الملفات الشخصية
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

// تحقق مما إذا كان المستخدم متدرب
export const isTrainee = async (userId: string) => {
  const role = await getUserRole(userId);
  return role === 'trainee';
};

// تحقق مما إذا كان المستخدم مشرف
export const isSupervisor = async (userId: string) => {
  const role = await getUserRole(userId);
  return role === 'supervisor';
};
