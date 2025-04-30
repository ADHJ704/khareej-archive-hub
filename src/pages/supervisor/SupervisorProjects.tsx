
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';
import { supabase } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SupervisorProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // استخدام نفس خطاف المشاريع الموجود
  const { data: projects, isLoading, error, refetch } = useProjects(undefined, searchQuery);
  
  if (error) {
    toast({
      title: "خطأ في تحميل المشاريع",
      description: "حدث خطأ أثناء محاولة تحميل المشاريع. يرجى المحاولة مرة أخرى.",
      variant: "destructive",
    });
  }
  
  const handleEdit = (projectId: string) => {
    navigate(`/supervisor/projects/edit/${projectId}`);
  };
  
  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "تم حذف المشروع بنجاح",
        description: "تم حذف المشروع من قاعدة البيانات."
      });
      
      // إعادة تحميل قائمة المشاريع
      refetch();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "خطأ في حذف المشروع",
        description: "حدث خطأ أثناء محاولة حذف المشروع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setProjectToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const confirmDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right mb-4 md:mb-0">
            إدارة المشاريع
          </h1>
          
          <div className="flex w-full md:w-auto space-x-4 space-x-reverse">
            <Button 
              className="bg-archive-primary hover:bg-archive-primary/80"
              onClick={() => navigate('/supervisor/projects/new')}
            >
              <Plus className="ml-2 h-5 w-5" />
              إضافة مشروع جديد
            </Button>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-4 pr-10 text-right"
                placeholder="بحث عن مشروع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">عنوان المشروع</TableHead>
                  <TableHead className="text-right">الكاتب</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">السنة</TableHead>
                  <TableHead className="text-right w-24">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="text-right font-medium">{project.title}</TableCell>
                      <TableCell className="text-right">{project.author}</TableCell>
                      <TableCell className="text-right">{project.department}</TableCell>
                      <TableCell className="text-right">{project.year}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(project.id)}
                            title="تعديل المشروع"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => confirmDelete(project.id)}
                            title="حذف المشروع"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      لا توجد مشاريع للعرض
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="text-right">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا المشروع نهائيًا من قاعدة البيانات ولن تتمكن من استرجاعه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse sm:justify-end">
            <AlertDialogCancel className="ml-2">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-700">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupervisorProjects;
