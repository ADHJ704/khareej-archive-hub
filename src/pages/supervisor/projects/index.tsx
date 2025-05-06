
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/hooks/useProjects';
import ProjectsHeader from './components/ProjectsHeader';
import ProjectsTable from './components/ProjectsTable';
import LoadingSpinner from './components/LoadingSpinner';
import DeleteProjectDialog from './components/DeleteProjectDialog';

const SupervisorProjects = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Use the existing projects hook with search query
  const { data: projects, isLoading, error, refetch } = useProjects(undefined, searchQuery);
  
  if (error) {
    toast({
      title: "خطأ في تحميل المشاريع",
      description: "حدث خطأ أثناء محاولة تحميل المشاريع. يرجى المحاولة مرة أخرى.",
      variant: "destructive",
    });
  }
  
  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteSuccess = () => {
    refetch();
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <ProjectsHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ProjectsTable 
            projects={projects || []} 
            onDelete={handleDeleteClick}
          />
        )}
      </main>
      
      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        projectId={projectToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default SupervisorProjects;
