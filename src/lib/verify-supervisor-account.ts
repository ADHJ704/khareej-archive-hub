
import { supabase } from './supabase';

/**
 * التحقق من وجود حساب المشرف وصلاحياته
 */
export const verifySupervisorAccount = async (
  email: string
): Promise<{ exists: boolean; isSupervisor: boolean; message: string }> => {
  try {
    // التحقق من وجود المستخدم
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('role', 'supervisor')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // لا يوجد نتائج
        return {
          exists: false,
          isSupervisor: false,
          message: 'لم يتم العثور على أي مشرف في النظام.'
        };
      }
      throw error;
    }

    if (!data) {
      return {
        exists: false,
        isSupervisor: false,
        message: 'لم يتم العثور على حساب المشرف.'
      };
    }

    return {
      exists: true,
      isSupervisor: data.role === 'supervisor',
      message: `تم العثور على حساب المشرف. الدور: ${data.role}`
    };
  } catch (error: any) {
    console.error('خطأ في التحقق من حساب المشرف:', error);
    return {
      exists: false,
      isSupervisor: false,
      message: `خطأ في التحقق من حساب المشرف: ${error.message || 'خطأ غير معروف'}`
    };
  }
};
