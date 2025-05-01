
import { supabase } from './supabase';

/**
 * تحديث كلمة مرور المشرف باستخدام البريد الإلكتروني وكلمة المرور الجديدة
 */
export const updateSupervisorPassword = async (
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني
    console.log("إرسال رابط إعادة تعيين كلمة المرور");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/supervisor-login'
    });

    if (resetError) {
      throw resetError;
    }

    return { 
      success: true, 
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني المحدد. يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لتعيين كلمة المرور الجديدة.' 
    };
  } catch (error: any) {
    console.error('خطأ في عملية إعادة تعيين كلمة المرور:', error);
    return { 
      success: false, 
      message: `فشل إرسال رابط إعادة تعيين كلمة المرور: ${error.message || 'خطأ غير معروف'}` 
    };
  }
};
