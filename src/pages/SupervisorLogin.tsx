
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
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

const loginFormSchema = z.object({
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const SupervisorLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // التحقق مما إذا كان المستخدم مشرف
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (profileData.role !== 'supervisor') {
          // تسجيل الخروج إذا لم يكن مشرف
          await supabase.auth.signOut();
          toast({
            title: 'خطأ في تسجيل الدخول',
            description: 'هذا الحساب ليس مشرفاً',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بك في منصة أرشيف المشاريع',
        });
        
        // التوجيه إلى الصفحة الرئيسية
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
                تسجيل دخول المشرف
              </CardTitle>
              <CardDescription className="text-center">
                أدخل بياناتك لتسجيل الدخول إلى منصة المشرفين
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SupervisorLogin;
