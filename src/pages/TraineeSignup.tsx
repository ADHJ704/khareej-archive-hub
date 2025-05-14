
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle } from 'lucide-react';

// نموذج التحقق من البيانات
const formSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
  password: z.string().min(8, {
    message: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const TraineeSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // الحصول على مسار إعادة التوجيه من state إذا كان موجودًا
  const locationState = location.state as { redirectTo?: string };
  const redirectPath = locationState?.redirectTo || '/';

  // إذا كان المستخدم مسجل الدخول بالفعل، توجيهه للصفحة الرئيسية
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  // إعداد نموذج الاستمارة
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // معالجة تقديم النموذج
  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setSignupError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            role: 'trainee',
          }
        }
      });
      
      if (error) {
        setSignupError(error.message);
        return;
      }
      
      if (data) {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "تم تسجيل حسابك بنجاح، يمكنك الآن تسجيل الدخول",
        });
        
        // توجيه المستخدم لصفحة تسجيل الدخول بعد إنشاء الحساب
        navigate('/trainee-login', { state: { redirectTo: redirectPath } });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setSignupError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white dark:bg-card rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-archive-primary mb-2">إنشاء حساب متدرب جديد</h1>
          <p className="text-gray-600 dark:text-gray-400">
            قم بالتسجيل للوصول إلى منصة أرشيف المشاريع
          </p>
        </div>
        
        {/* عرض خطأ التسجيل إذا وجد */}
        {signupError && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {signupError === "User already registered" ? 
              "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك." 
              : signupError}
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
                      autoComplete="new-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أعد إدخال كلمة المرور" 
                      type="password" 
                      autoComplete="new-password"
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
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            لديك حساب بالفعل؟{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-archive-primary"
              onClick={() => navigate('/trainee-login', { state: { redirectTo: redirectPath } })}
            >
              تسجيل الدخول
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

export default TraineeSignup;
