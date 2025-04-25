
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from 'lucide-react';
import Header from '@/components/Header';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

const TraineeLogin = () => {
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
        return;
      }
      
      // التحقق من أن المستخدم متدرب
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();
      
      if (profileError || profileData?.role !== 'trainee') {
        await supabase.auth.signOut();
        toast({
          title: "خطأ في الوصول",
          description: "ليس لديك صلاحية الدخول كمتدرب",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في منصة المشاريع"
      });
      
      navigate('/projects');
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-archive-primary/20">
          <CardHeader className="pb-2 text-center">
            <div className="mx-auto bg-archive-primary/10 p-3 rounded-full mb-3">
              <GraduationCap className="w-12 h-12 text-archive-primary" />
            </div>
            <h1 className="text-2xl font-bold text-archive-dark">تسجيل دخول المتدرب</h1>
            <p className="text-gray-600 mt-2">أدخل بيانات الدخول للوصول إلى منصة المشاريع</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-right">البريد الإلكتروني</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-right">كلمة المرور</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="أدخل كلمة المرور" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white"
                  required 
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
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <a href="#" className="text-archive-primary hover:underline">
                تواصل مع المشرف للتسجيل
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default TraineeLogin;
