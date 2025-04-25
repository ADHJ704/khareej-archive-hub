
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { supabase, getCurrentUser, getUserRole } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      
      if (!user) {
        toast({
          title: "غير مصرح",
          description: "يجب تسجيل الدخول للوصول إلى هذه الصفحة",
          variant: "destructive",
        });
        navigate('/supervisor-login');
        return;
      }
      
      const role = await getUserRole(user.id);
      
      if (role !== 'supervisor') {
        toast({
          title: "غير مصرح",
          description: "ليس لديك صلاحية الوصول إلى لوحة تحكم المشرف",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح"
    });
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl">جاري التحميل...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">لوحة تحكم المشرف</h1>
            <Button variant="outline" onClick={handleLogout}>تسجيل الخروج</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">إدارة المشاريع</h2>
              <p className="mb-4 text-gray-600">إضافة، تعديل وحذف المشاريع في النظام</p>
              <Button className="w-full">إدارة المشاريع</Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">إدارة المتدربين</h2>
              <p className="mb-4 text-gray-600">إضافة وإدارة حسابات المتدربين</p>
              <Button className="w-full">إدارة المتدربين</Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">إدارة التصنيفات</h2>
              <p className="mb-4 text-gray-600">إضافة وتعديل تصنيفات المشاريع</p>
              <Button className="w-full">إدارة التصنيفات</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard;
