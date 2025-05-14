import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define form schema
const formSchema = z.object({
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل" }),
});

const TraineeLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // التحقق من وجود معلمات في الرابط
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/';
  const authRequired = searchParams.get('authRequired') === 'true';
  
  // الحصول على مسار إعادة التوجيه من state إذا كان موجودًا
  const locationState = location.state as { redirectTo?: string };
  const finalRedirectPath = locationState?.redirectTo || redirectPath;

  // إذا كان المستخدم مسجل الدخول بالفعل، توجيهه للصفحة المقصودة
  useEffect(() => {
    if (user) {
      navigate(finalRedirectPath);
    }
  }, [user, navigate, finalRedirectPath]);

  // إعداد نموذج الاستمارة
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // معالجة تقديم النموذج
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        setLoginError(error.message);
        return;
      }
      
      if (data && data.user) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبًا بك في منصة أرشيف المشاريع",
        });
        
        // التوجيه إلى المسار المطلوب
        navigate(finalRedirectPath);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-card rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-archive-primary mb-2">تسجيل دخول المتدربين</h1>
          <p className="text-gray-600 dark:text-gray-400">
            أدخل بياناتك للوصول إلى منصة أرشيف المشاريع
          </p>
        </div>
        
        {/* تنبيه إذا كان المستخدم يحاول الوصول لصفحة محمية */}
        {authRequired && (
          <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>يلزم تسجيل الدخول</AlertTitle>
            <AlertDescription>
              يجب تسجيل الدخول أولاً للوصول إلى محتوى المشاريع.
            </AlertDescription>
          </Alert>
        )}
        
        {/* عرض خطأ المصادقة إذا وجد */}
        {loginError && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">خطأ في تسجيل الدخول</AlertTitle>
            <AlertDescription>
              {loginError === "Invalid login credentials" ? "بيانات الدخول غير صحيحة" : loginError}
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل بريدك الإلكتروني" 
                      type="email" 
                      autoComplete="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل كلمة المرور" 
                      type="password" 
                      autoComplete="current-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="w-full bg-archive-primary hover:bg-archive-secondary" 
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            لا تملك حساباً؟{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-archive-primary"
              onClick={() => navigate('/trainee-signup', { state: { redirectTo: finalRedirectPath } })}
            >
              سجل الآن
            </Button>
          </p>
          
          <Button 
            variant="link" 
            className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
            onClick={() => navigate('/')}
          >
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TraineeLogin;
