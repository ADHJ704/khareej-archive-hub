
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

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
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <Card className="border-archive-secondary/20">
            <CardHeader>
              <CardTitle className="text-right">لوحة التحكم</CardTitle>
              <CardDescription className="text-right">
                إدارة الموقع
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SupervisorDashboard;
