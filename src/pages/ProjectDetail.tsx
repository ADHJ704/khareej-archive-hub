
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Download, FileText } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ProjectDetailSkeleton from '@/components/project-detail/ProjectDetailSkeleton';
import ProjectDetailErrorState from '@/components/project-detail/ProjectDetailErrorState';
import ProjectDetailNotFound from '@/components/project-detail/ProjectDetailNotFound';
import ProjectSidebar from '@/components/project-detail/ProjectSidebar';
import ProjectInfoDisplay from '@/components/project-detail/ProjectInfoDisplay';
import ProjectHeader from '@/components/project-detail/ProjectHeader';
import ProjectFooter from '@/components/project-detail/ProjectFooter';
import RelatedProjects from '@/components/project-detail/RelatedProjects';
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Fetch the project
  const { data: projects = [], isLoading, isError } = useProjects();
  
  // Find the current project by ID
  const project = projects.find(p => p.id === id);
  
  // Find related projects (same category, excluding current)
  const relatedProjects = project 
    ? projects
        .filter(p => p.categoryId === project.categoryId && p.id !== project.id)
        .slice(0, 3)
    : [];
    
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <ProjectDetailSkeleton />
      </div>
    );
  }
  
  // Show error state
  if (isError) {
    toast({
      title: "حدث خطأ",
      description: "لم نتمكن من تحميل بيانات المشروع، يرجى المحاولة مرة أخرى.",
      variant: "destructive",
    });
    
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <ProjectDetailErrorState />
        <ProjectFooter />
      </div>
    );
  }
  
  // Show not found state if project doesn't exist
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <ProjectDetailNotFound />
        <ProjectFooter />
      </div>
    );
  }
  
  // Check if project has content
  const hasContent = !!project.project_content || !!project.full_content;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <ProjectHeader project={project} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProjectInfoDisplay project={project} />
              
              {/* Display actions only if content exists */}
              {hasContent && (
                <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Link to={`/project/${project.id}/full`} className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full bg-archive-primary hover:bg-archive-secondary"
                    >
                      <Book className="ml-2 h-5 w-5" />
                      عرض المحتوى الكامل
                    </Button>
                  </Link>
                  
                  {project.downloadUrl && (
                    <a 
                      href={project.downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full border-archive-secondary text-archive-secondary hover:bg-archive-secondary hover:text-white"
                      >
                        <Download className="ml-2 h-5 w-5" />
                        تنزيل المشروع
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <ProjectSidebar project={project} />
            </div>
          </div>
          
          <RelatedProjects projects={relatedProjects} />
        </div>
      </main>
      
      <ProjectFooter />
    </div>
  );
};

export default ProjectDetail;
