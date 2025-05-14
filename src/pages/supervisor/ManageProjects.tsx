
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trash2, Loader2, Search, Eye } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

// نوع لبيانات المشاريع
interface Project {
  id: string;
  title: string;
  author: string;
  year: string;
  department: string;
  supervisor: string;
  created_at: string;
}

const ManageProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // جلب المشاريع
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, author, year, department, supervisor, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من جلب المشاريع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // فتح مربع حوار تأكيد الحذف
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  // حذف المشروع
  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);
      
      if (error) {
        throw error;
      }
      
      // تحديث القائمة المحلية
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف مشروع "${projectToDelete.title}" بنجاح.`,
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حذف المشروع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

  // تصفية المشاريع حسب البحث
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right">
              إدارة المشاريع
            </h1>
            <p className="text-muted-foreground mt-1 text-right">
              يمكنك عرض وحذف المشاريع من هنا
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              العودة
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/supervisor/add-project')}
              className="bg-archive-primary hover:bg-archive-primary/90 w-full sm:w-auto"
            >
              إضافة مشروع جديد
            </Button>
          </div>
        </div>
        
        <Card className="border-archive-secondary/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-right">قائمة المشاريع</CardTitle>
                <CardDescription className="text-right">
                  {isLoading 
                    ? 'جاري تحميل المشاريع...' 
                    : `إجمالي المشاريع: ${projects.length}`
                  }
                </CardDescription>
              </div>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المشاريع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-archive-primary" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="overflow-x-auto">
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">عنوان المشروع</TableHead>
                      <TableHead className="text-right">الباحث</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">السنة</TableHead>
                      <TableHead className="text-right">المشرف</TableHead>
                      <TableHead className="text-right">تاريخ الإضافة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted/50">
                        <TableCell className="max-w-[200px] truncate font-medium">
                          {project.title}
                        </TableCell>
                        <TableCell>{project.author}</TableCell>
                        <TableCell>{project.department}</TableCell>
                        <TableCell>{project.year}</TableCell>
                        <TableCell>{project.supervisor}</TableCell>
                        <TableCell>{formatDate(project.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link to={`/project/${project.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteClick(project)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">لم يتم العثور على مشاريع مطابقة للبحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* مربع حوار تأكيد الحذف */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>هل تريد حذف هذا المشروع؟</DialogTitle>
            <DialogDescription>
              أنت على وشك حذف مشروع "{projectToDelete?.title}". هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-0 rtl:space-x-reverse">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : "حذف المشروع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProjects;
