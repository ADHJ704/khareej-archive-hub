
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/components/projects/ProjectsTable';
import ProjectsTable from '@/components/projects/ProjectsTable';
import DeleteProjectDialog from '@/components/projects/DeleteProjectDialog';
import ManageProjectsHeader from '@/components/projects/ManageProjectsHeader';

const ManageProjects = () => {
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

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <ManageProjectsHeader 
          projectCount={projects.length}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Card className="border-archive-secondary/20">
          <CardContent className="pt-6">
            <ProjectsTable
              projects={projects}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onDeleteClick={handleDeleteClick}
              formatDate={formatDate}
            />
          </CardContent>
        </Card>
      </main>

      {/* مربع حوار تأكيد الحذف */}
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        projectTitle={projectToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ManageProjects;
