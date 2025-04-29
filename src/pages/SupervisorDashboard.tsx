
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { categories } from '@/data/categories';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
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
      fetchProjectSuggestions();
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const fetchProjectSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const { data, error } = await supabase
        .from('project_suggestions')
        .select(`
          *,
          profiles:user_id (id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the data to extract user info and format messages
      const processedData = data.map(item => {
        // Extract project details from the message
        const titleMatch = item.message.match(/عنوان المشروع: (.*?)(?:\n|$)/);
        const descMatch = item.message.match(/الوصف: (.*?)(?:\n|$)/);
        const catMatch = item.message.match(/التصنيف: (.*?)(?:\n|$)/);
        
        return {
          ...item,
          extractedTitle: titleMatch ? titleMatch[1] : 'عنوان غير متوفر',
          extractedDescription: descMatch ? descMatch[1] : 'وصف غير متوفر',
          extractedCategory: catMatch ? catMatch[1] : 'تصنيف غير متوفر',
          userId: item.user_id
        };
      });
      
      setSuggestions(processedData);
    } catch (error) {
      console.error('Error fetching project suggestions:', error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "حدث خطأ أثناء جلب اقتراحات المشاريع",
        variant: "destructive"
      });
    } finally {
      setLoadingSuggestions(false);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح"
    });
    navigate('/');
  };
  
  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : id;
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          
          {/* Project Suggestions Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">اقتراحات المشاريع</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSuggestions ? (
                <div className="flex justify-center py-8">
                  <p>جاري تحميل الاقتراحات...</p>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">لا توجد اقتراحات مشاريع حالياً</p>
                </div>
              ) : (
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان المشروع</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead className="hidden md:table-cell">الوصف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="hidden md:table-cell">تاريخ الاقتراح</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.map((suggestion) => (
                      <TableRow key={suggestion.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">{suggestion.extractedTitle}</TableCell>
                        <TableCell>{suggestion.extractedCategory}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {suggestion.extractedDescription}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={suggestion.response === 'قيد المراجعة' ? 'outline' : 'default'}
                            className={suggestion.response === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                          >
                            {suggestion.response}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(suggestion.created_at).toLocaleDateString('ar-SA')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard;

// Helper functions moved from imports
const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  return data.session.user;
};

const getUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data.role;
};
