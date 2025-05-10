import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';

const signupFormSchema = z.object({
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
  confirmPassword: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

const TraineeSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigateAfterSignup = () => {
    navigate(redirectTo !== '/' ? decodeURIComponent(redirectTo) : '/');
  };

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);

    try {
      // تسجيل المستخدم
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // تعيين الدور إلى متدرب في جدول الملفات الشخصية
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'trainee' })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        toast({
          title: 'تم إنشاء الحساب بنجاح',
          description: 'يمكنك الآن تسجيل الدخول إلى منصة أرشيف المشاريع',
        });
        
        // التوجيه إلى الصفحة الرئيسية بعد التسجيل الناجح
        navigateAfterSignup();
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast({
          title: 'البريد الإلكتروني مستخدم بالفعل',
          description: 'يرجى استخدام بريد إلكتروني آخر أو تسجيل الدخول',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'خطأ في إنشاء الحساب',
          description: error?.message || 'حدث خطأ أثناء محاولة إنشاء الحساب',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10 flex-grow flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="border-archive-secondary/20">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-archive-secondary/10 p-3 rounded-full">
                  <UserPlus className="h-10 w-10 text-archive-secondary" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl text-archive-dark dark:text-white">
                تسجيل حساب متدرب جديد
              </CardTitle>
              <CardDescription className="text-center">
                أدخل بياناتك لإنشاء حساب جديد في منصة المتدربين
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل بريدك الإلكتروني"
                            className="text-right"
                            dir="rtl"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">كلمة المرور</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل كلمة المرور"
                            className="text-right"
                            dir="rtl"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">تأكيد كلمة المرور</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل كلمة المرور مرة أخرى"
                            className="text-right"
                            dir="rtl"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-archive-secondary hover:bg-archive-secondary/80"
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </Button>
                  </div>

                  <div className="text-center mt-2 text-sm">
                    <span>لديك حساب بالفعل؟</span>{" "}
                    <Link to="/trainee-login" className="text-archive-secondary hover:underline font-medium">
                      سجل دخول
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TraineeSignup;
