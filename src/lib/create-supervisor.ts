
import { supabase } from './supabase';

/**
 * Creates a supervisor account with the provided email and password
 * This function should be used only once to initialize the admin account
 */
export const createSupervisorAccount = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. Sign up the user with Supabase Auth
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

    if (!authData?.user?.id) {
      return { success: false, message: 'لم يتم إنشاء الحساب' };
    }

    // 2. Update the user role to be a supervisor in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'supervisor' })
      .eq('id', authData.user.id);

    if (profileError) {
      throw profileError;
    }

    return { 
      success: true, 
      message: 'تم إنشاء حساب المشرف بنجاح. يمكنك الآن تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور المقدمة.' 
    };
  } catch (error: any) {
    console.error('Error creating supervisor account:', error);
    
    // Handle case where user already exists
    if (error.message?.includes('already registered')) {
      // User exists, try to update their role
      try {
        const { data: userData } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (userData?.user) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'supervisor' })
            .eq('id', userData.user.id);
            
          if (!updateError) {
            return { success: true, message: 'تم تحديث الحساب الموجود إلى مشرف بنجاح.' };
          }
        }
      } catch (signInError) {
        console.error('Error signing in to existing account:', signInError);
      }
      
      return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل ولكن تعذّر تحديث الصلاحيات' };
    }
    
    return { 
      success: false, 
      message: `فشل إنشاء حساب المشرف: ${error.message || 'خطأ غير معروف'}` 
    };
  }
};
