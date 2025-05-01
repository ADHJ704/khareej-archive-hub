
import { supabase } from './supabase';

/**
 * تحديث كلمة مرور المشرف باستخدام البريد الإلكتروني وكلمة المرور الجديدة
 */
export const updateSupervisorPassword = async (
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // محاولة تعيين كلمة المرور باستخدام الوظيفة الإدارية (تتطلب مفتاح خدمة)
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(
        email, // سيتم استخدام البريد الإلكتروني كمعرف هنا
        { password: newPassword }
      );

      if (error) {
        throw error;
      }

      return { 
        success: true, 
        message: 'تم تحديث كلمة المرور بنجاح.' 
      };
    } catch (adminError) {
      console.log("فشل استخدام واجهة الإدارة، سيتم استخدام إعادة تعيين كلمة المرور بدلاً من ذلك:", adminError);
      
      // إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/supervisor-login`
      });

      if (resetError) {
        throw resetError;
      }

      return { 
        success: true, 
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني المحدد. يرجى التحقق من بريدك الإلكتروني واتباع التعليمات لتعيين كلمة المرور الجديدة.' 
      };
    }
  } catch (error: any) {
    console.error('خطأ في عملية تغيير كلمة المرور:', error);
    return { 
      success: false, 
      message: `فشلت عملية تغيير كلمة المرور: ${error.message || 'خطأ غير معروف'}` 
    };
  }
};
