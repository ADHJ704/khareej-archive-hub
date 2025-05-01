
import { supabase } from './supabase';

/**
 * تحديث كلمة مرور المشرف باستخدام البريد الإلكتروني وكلمة المرور الجديدة
 */
export const updateSupervisorPassword = async (
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // محاولة تسجيل الدخول أولاً والحصول على معرف المستخدم
    const { data: userData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: newPassword, // نجرب باستخدام كلمة المرور الجديدة (ربما تكون موجودة بالفعل)
    });

    if (loginError) {
      // إذا كان هناك خطأ في تسجيل الدخول، نحاول إرسال رابط إعادة تعيين كلمة المرور
      console.log("إرسال رابط إعادة تعيين كلمة المرور");
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
    }

    // إذا نجح تسجيل الدخول، نعيد تسجيل الخروج حتى نعود للصفحة السابقة
    await supabase.auth.signOut();

    return { 
      success: true, 
      message: 'كلمة المرور صالحة ويمكن تسجيل الدخول بها.' 
    };
  } catch (error: any) {
    console.error('خطأ في عملية التحقق من كلمة المرور:', error);
    return { 
      success: false, 
      message: `فشل التحقق من كلمة المرور: ${error.message || 'خطأ غير معروف'}` 
    };
  }
};
