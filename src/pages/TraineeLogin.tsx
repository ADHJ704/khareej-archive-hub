
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap } from 'lucide-react';
import Header from '@/components/Header';

const TraineeLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا سيتم إضافة كود التحقق من هوية المتدرب باستخدام Supabase
    console.log('تسجيل دخول المتدرب');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <GraduationCap className="w-12 h-12 mx-auto text-archive-primary" />
            <h1 className="text-2xl font-bold mt-4">تسجيل دخول المتدرب</h1>
            <p className="text-gray-600 mt-2">أدخل بيانات الدخول للوصول إلى منصة المشاريع</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-right">البريد الإلكتروني</label>
              <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-right">كلمة المرور</label>
              <Input id="password" type="password" placeholder="أدخل كلمة المرور" required />
            </div>
            
            <Button type="submit" className="w-full bg-archive-primary hover:bg-archive-dark">
              تسجيل الدخول
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <a href="#" className="text-archive-primary hover:underline">
                تواصل مع المشرف للتسجيل
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TraineeLogin;
