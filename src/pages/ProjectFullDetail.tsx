
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tool } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import Header from '@/components/Header';
import ProjectDetailSkeleton from '@/components/project-detail/ProjectDetailSkeleton';
import ProjectDetailErrorState from '@/components/project-detail/ProjectDetailErrorState';
import ProjectDetailNotFound from '@/components/project-detail/ProjectDetailNotFound';
import ProjectFooter from '@/components/project-detail/ProjectFooter';
import { useToast } from "@/hooks/use-toast";

const ProjectFullDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the useProjects hook to fetch the project
  const { data: projects = [], isLoading, isError } = useProjects(undefined, undefined, undefined, false);
  
  // Find the current project by ID
  const project = projects.find(p => p.id === id);

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
  
  // Format the full content or use project_content as fallback
  const fullContent = project.full_content || project.project_content || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          {/* Back button */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="mb-4 flex items-center gap-2"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <ArrowLeft size={18} />
              <span>العودة إلى صفحة المشروع</span>
            </Button>
          </div>
          
          {/* Project title */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-archive-primary mb-6 text-center">
              {project.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between text-center md:text-right text-sm text-gray-600 dark:text-gray-400 mb-2">
              <div className="mb-2 md:mb-0">
                <span className="font-medium">الباحث:</span> {project.author}
              </div>
              <div className="mb-2 md:mb-0">
                <span className="font-medium">المشرف:</span> {project.supervisor}
              </div>
              <div>
                <span className="font-medium">سنة المشروع:</span> {project.year}
              </div>
            </div>
          </div>
          
          {/* Full content */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-heading font-bold text-archive-primary mb-4">
              التفاصيل الكاملة للمشروع
            </h2>
            
            <Separator className="my-4" />
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* Project sections */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-heading font-bold text-archive-primary mb-4">
              أقسام المشروع
            </h2>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">فكرة المشروع</h3>
                <p className="text-gray-700 dark:text-gray-300">{project.abstract}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">أهداف المشروع</h3>
                <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">الأدوات المستخدمة</h3>
                {project.tags && project.tags.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {project.tags.map((tool, index) => (
                      <li key={index}>{tool}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    لم يتم تحديد الأدوات المستخدمة في هذا المشروع
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">القسم</h3>
                <p className="text-gray-700 dark:text-gray-300">{project.department}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ProjectFooter />
    </div>
  );
};

export default ProjectFullDetail;
