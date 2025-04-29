
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Validation schema for the registration form
const formSchema = z.object({
  email: z.string().email({ message: "يجب إدخال بريد إلكتروني صالح" }),
  password: z.string().min(8, { message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" }),
  confirmPassword: z.string(),
  firstName: z.string().min(1, { message: "الاسم الأول مطلوب" }),
  lastName: z.string().min(1, { message: "الاسم الأخير مطلوب" }),
})
.refine(data => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const TraineeRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    
    try {
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          }
        }
      });
      
      if (error) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول."
      });
      
      navigate('/trainee-login');
    } catch (error) {
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md shadow-lg border-archive-primary/20">
          <CardHeader className="pb-2 text-center">
            <div className="mx-auto bg-archive-primary/10 p-3 rounded-full mb-3">
              <GraduationCap className="w-12 h-12 text-archive-primary" />
            </div>
            <h1 className="text-2xl font-bold text-archive-dark dark:text-white">إنشاء حساب متدرب</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">أدخل بياناتك لإنشاء حساب جديد</p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300">الاسم الأول</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل اسمك الأول" 
                            {...field}
                            dir="rtl"
                            className="bg-white dark:bg-card border-archive-primary/20 text-right"
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300">الاسم الأخير</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="أدخل اسمك الأخير" 
                            {...field}
                            dir="rtl"
                            className="bg-white dark:bg-card border-archive-primary/20 text-right"
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300">البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="أدخل بريدك الإلكتروني" 
                          {...field}
                          dir="rtl"
                          className="bg-white dark:bg-card border-archive-primary/20 text-right"
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
                      <FormLabel className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300">كلمة المرور</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="أدخل كلمة المرور" 
                          {...field}
                          dir="rtl"
                          className="bg-white dark:bg-card border-archive-primary/20 text-right"
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
                      <FormLabel className="block text-sm text-right font-medium text-gray-700 dark:text-gray-300">تأكيد كلمة المرور</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="أعد إدخال كلمة المرور" 
                          {...field}
                          dir="rtl"
                          className="bg-white dark:bg-card border-archive-primary/20 text-right"
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-archive-primary hover:bg-archive-dark"
                  disabled={loading}
                >
                  {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              لديك حساب بالفعل؟{' '}
              <Link to="/trainee-login" className="text-archive-primary hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default TraineeRegister;
