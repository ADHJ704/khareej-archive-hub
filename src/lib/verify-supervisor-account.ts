
import { supabase } from './supabase';

/**
 * التحقق من وجود حساب المشرف وصلاحياته
 */
export const verifySupervisorAccount = async (
  email: string
): Promise<{ exists: boolean; isSupervisor: boolean; message: string }> => {
  try {
    // التحقق من وجود المستخدم
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers({ 
      filter: `email.eq.${email}`
    });

    if (userError) {
      console.error('خطأ في البحث عن المستخدم:', userError);
      return {
        exists: false,
        isSupervisor: false,
        message: `لم يتم العثور على حساب بالبريد الإلكتروني ${email}`
      };
    }

    if (!userData?.users || userData.users.length === 0) {
      return {
        exists: false,
        isSupervisor: false,
        message: `لم يتم العثور على حساب بالبريد الإلكتروني ${email}`
      };
    }

    const user = userData.users[0];

    // التحقق من دور المستخدم في جدول الملفات الشخصية
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('خطأ في التحقق من ملف المستخدم:', profileError);
      return {
        exists: true,
        isSupervisor: false,
        message: 'تم العثور على الحساب، ولكن لا يمكن التحقق من الصلاحيات. يرجى التحقق من جدول الملفات الشخصية.'
      };
    }

    // التحقق ما إذا كان المستخدم مشرفاً
    if (!profileData || profileData.role !== 'supervisor') {
      // تحديث دور المستخدم إلى مشرف
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'supervisor' })
        .eq('id', user.id);

      if (updateError) {
        console.error('خطأ في تحديث دور المستخدم:', updateError);
        return {
          exists: true,
          isSupervisor: false,
          message: `تم العثور على الحساب، ولكن فشل في تعيينه كمشرف: ${updateError.message}`
        };
      }

      return {
        exists: true,
        isSupervisor: true,
        message: `تم تحديث دور المستخدم بنجاح إلى مشرف.`
      };
    }

    return {
      exists: true,
      isSupervisor: true,
      message: `الحساب موجود بالفعل ولديه دور مشرف.`
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
