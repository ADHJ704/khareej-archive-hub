
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Settings, Users } from 'lucide-react';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right">
            لوحة تحكم المشرف
          </h1>
          <p className="text-muted-foreground mt-2 text-right">
            مرحبًا بك في لوحة التحكم. يمكنك هنا إضافة وإدارة المشاريع في أرشيف المشاريع.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-archive-secondary/20">
            <CardHeader>
              <CardTitle className="text-right">إدارة المشاريع</CardTitle>
              <CardDescription className="text-right">
                إضافة، تعديل أو حذف المشاريع في الأرشيف
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button 
                className="bg-archive-secondary hover:bg-archive-secondary/80"
                onClick={() => navigate('/supervisor/projects')}
              >
                <FileText className="ml-2 h-5 w-5" />
                إدارة المشاريع
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-archive-secondary/20">
            <CardHeader>
              <CardTitle className="text-right">إضافة مشروع جديد</CardTitle>
              <CardDescription className="text-right">
                إدخال تفاصيل مشروع جديد في نظام الأرشيف
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button 
                className="bg-archive-primary hover:bg-archive-primary/80"
                onClick={() => navigate('/supervisor/projects/new')}
              >
                <Plus className="ml-2 h-5 w-5" />
                إضافة مشروع جديد
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard;
