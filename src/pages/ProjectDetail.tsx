
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { useProjects } from '@/hooks/useProjects';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

// Import our new components
import ProjectHeader from '@/components/project-detail/ProjectHeader';
import ProjectInfoDisplay from '@/components/project-detail/ProjectInfoDisplay';
import ProjectSidebar from '@/components/project-detail/ProjectSidebar';
import RelatedProjects from '@/components/project-detail/RelatedProjects';
import ProjectDetailSkeleton from '@/components/project-detail/ProjectDetailSkeleton';
import ProjectDetailErrorState from '@/components/project-detail/ProjectDetailErrorState';
import ProjectDetailNotFound from '@/components/project-detail/ProjectDetailNotFound';
import ProjectFooter from '@/components/project-detail/ProjectFooter';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the useProjects hook to fetch all projects
  const { data: projects = [], isLoading, isError } = useProjects(undefined, undefined, undefined, false);
  
  // Find the current project by ID
  const project = projects.find(p => p.id === id);

  // Log project details for debugging
  useEffect(() => {
    if (project) {
      console.log('Project details:', {
        title: project.title,
        project_content: project.project_content ? project.project_content.substring(0, 50) + '...' : 'Not available'
      });
    }
  }, [project]);
  
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
  
  // Get related projects from the same category
  const relatedProjects = projects
    .filter(p => p.categoryId === project.categoryId && p.id !== project.id)
    .slice(0, 3);

  // تحقق من وجود محتوى كامل للمشروع
  const hasFullContent = !!project.full_content || !!project.project_content;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <ProjectHeader project={project} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <ProjectInfoDisplay project={project} />
              
              {/* عرض رابط الانتقال للمحتوى الكامل إذا كان متوفراً */}
              {hasFullContent && (
                <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">محتوى المشروع</h2>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    يمكنك استعراض المحتوى الكامل للمشروع من خلال الضغط على الزر أدناه
                  </p>
                  <Button 
                    className="bg-archive-secondary hover:bg-archive-secondary/80"
                    onClick={() => navigate(`/project-details/${project.id}`)}
                  >
                    عرض المحتوى الكامل للمشروع
                  </Button>
                </div>
              )}
              
              {/* Related projects */}
              <RelatedProjects projects={relatedProjects} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProjectSidebar project={project} />
            </div>
          </div>
        </div>
      </main>
      
      <ProjectFooter />
    </div>
  );
};

export default ProjectDetail;
