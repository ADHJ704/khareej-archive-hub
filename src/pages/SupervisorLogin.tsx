
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCog } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

const SupervisorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // التحقق من أن المستخدم مشرف
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();
      
      if (profileError || profileData?.role !== 'supervisor') {
        await supabase.auth.signOut();
        toast({
          title: "خطأ في الوصول",
          description: "ليس لديك صلاحية الدخول كمشرف",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة تحكم المشرف"
      });
      
      navigate('/supervisor-dashboard');
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
              <UserCog className="w-12 h-12 text-archive-primary" />
            </div>
            <h1 className="text-2xl font-bold text-archive-dark dark:text-white">تسجيل دخول المشرف</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">أدخل بيانات الدخول للوصول إلى لوحة تحكم المشرف</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-right text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  dir="rtl"
                  className="bg-white dark:bg-card border-archive-primary/20 text-right"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-right text-gray-700 dark:text-gray-300">كلمة المرور</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="أدخل كلمة المرور" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="rtl"
                  className="bg-white dark:bg-card border-archive-primary/20 text-right"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-archive-primary hover:bg-archive-dark"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ليس لديك حساب؟{' '}
              <a href="#" className="text-archive-primary hover:underline">
                تواصل مع الإدارة للتسجيل
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default SupervisorLogin;
