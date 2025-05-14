
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
            مرحبًا بك في لوحة التحكم.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-archive-secondary/20">
            <CardHeader>
              <CardTitle className="text-right">إدارة المشاريع</CardTitle>
              <CardDescription className="text-right">
                إضافة، عرض، وحذف مشاريع التخرج
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link to="/supervisor/add-project">
                <Button className="w-full justify-start bg-archive-primary hover:bg-archive-primary/90">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة مشروع جديد
                </Button>
              </Link>
              <Link to="/supervisor/manage-projects">
                <Button variant="outline" className="w-full justify-start">
                  <Trash2 className="ml-2 h-4 w-4" />
                  إدارة المشاريع
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-archive-secondary/20">
            <CardHeader>
              <CardTitle className="text-right">إعدادات النظام</CardTitle>
              <CardDescription className="text-right">
                ضبط إعدادات الموقع والنظام
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button variant="outline" className="w-full justify-start" disabled>
                <Settings className="ml-2 h-4 w-4" />
                إعدادات النظام
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard;
