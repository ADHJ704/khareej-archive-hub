
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const TraineeLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleResendVerification = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({
        title: 'خطأ في إرسال التحقق',
        description: 'يرجى إدخال البريد الإلكتروني أولاً',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'تم إرسال رابط التحقق',
        description: 'يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ في إرسال التحقق',
        description: error?.message || 'حدث خطأ أثناء محاولة إرسال رابط التحقق',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setVerificationNeeded(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // Check if the error is related to email verification
        if (error.message.includes('Email not confirmed')) {
          setVerificationNeeded(true);
          throw new Error('يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول');
        }
        throw error;
      }

      if (data?.user) {
        // Check if user is a trainee
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profileData.role !== 'trainee') {
          // Sign out if not a trainee
          await supabase.auth.signOut();
          toast({
            title: 'خطأ في تسجيل الدخول',
            description: 'هذا الحساب ليس متدرباً',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في منصة أرشيف المشاريع',
        });
        
        // Redirect to home page
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error?.message || 'حدث خطأ أثناء محاولة تسجيل الدخول',
        variant: 'destructive',
      });
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
                  <UserRound className="h-10 w-10 text-archive-secondary" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl text-archive-dark dark:text-white">
                تسجيل دخول المتدرب
              </CardTitle>
              <CardDescription className="text-center">
                أدخل بياناتك لتسجيل الدخول إلى منصة المتدربين
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

                  {verificationNeeded && (
                    <div className="pt-2">
                      <p className="text-sm text-center text-amber-600 mb-2">
                        يجب تأكيد بريدك الإلكتروني قبل تسجيل الدخول
                      </p>
                      <Button
                        type="button"
                        onClick={handleResendVerification}
                        className="w-full bg-amber-500 hover:bg-amber-600"
                        disabled={isLoading}
                      >
                        إعادة إرسال رابط التأكيد
                      </Button>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-archive-secondary hover:bg-archive-secondary/80"
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="text-center mt-4 text-sm">
                <span>ما عندك حساب؟</span>{" "}
                <Link to="/trainee-signup" className="text-archive-secondary hover:underline font-medium">
                  سجّل الآن
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TraineeLogin;
