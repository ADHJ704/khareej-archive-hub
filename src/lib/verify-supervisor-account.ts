
import { supabase } from "./supabase";

export async function verifySupervisorAccount(
  token: string
): Promise<
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    }
> {
  try {
    // التحقق من صحة رمز التفعيل
    const { error: verifyError, data } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    });

    if (verifyError || !data || !data.user) {
      return { success: false, message: "رمز التفعيل غير صالح أو منتهي الصلاحية" };
    }

    // تحديث دور المستخدم إلى مشرف في جدول profiles
    const user = data.user;
    
    // التحقق من وجود حقل البريد الإلكتروني
    if (!user || !('email' in user) || !user.email) {
      return { success: false, message: "لم يتم العثور على بيانات المستخدم" };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: "supervisor" })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating role:", updateError);
      return {
        success: false,
        message: "حدث خطأ أثناء تحديث صلاحيات المشرف",
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in verifySupervisorAccount:", error);
    return {
      success: false,
      message: `حدث خطأ غير متوقع: ${error.message || "خطأ غير معروف"}`,
    };
  }
}
