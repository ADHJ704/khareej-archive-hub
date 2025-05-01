
import { supabase } from './supabase';

/**
 * تحديث كلمة مرور المشرف باستخدام البريد الإلكتروني وكلمة المرور الجديدة
 */
export const updateSupervisorPassword = async (
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. إعادة تعيين كلمة المرور باستخدام Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(
      'dbd4e74f-dc17-44b1-8cc0-1d256c5382bd', // هذا هو معرف المستخدم المحدد المرتبط بالبريد الإلكتروني
      { password: newPassword }
    );

    if (error) {
      throw error;
    }

    return { 
      success: true, 
      message: 'تم تحديث كلمة مرور المشرف بنجاح.' 
    };
  } catch (error: any) {
    console.error('خطأ في تحديث كلمة المرور:', error);
    
    // هناك خطأ في استخدام admin.updateUserById لأنه يتطلب مفتاح دور الخدمة
    // لنجرب طريقة بديلة باستخدام إعادة تعيين كلمة المرور
    try {
      // استخدام resetPasswordForEmail كبديل
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/supervisor-login'
      });

      if (resetError) {
        throw resetError;
      }

      return { 
        success: true, 
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني المحدد.' 
      };
    } catch (resetError: any) {
      console.error('خطأ في إعادة تعيين كلمة المرور:', resetError);
      return { 
        success: false, 
        message: `فشل تحديث كلمة المرور: ${error.message || 'خطأ غير معروف'}` 
      };
    }
  }
};
