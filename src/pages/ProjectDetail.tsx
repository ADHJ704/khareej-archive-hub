
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, BookOpen, ArrowRight, Calendar, User, BookOpenCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProjects } from '@/hooks/useProjects';
import { categories } from '@/data/categories';
import { ScrollArea } from "@/components/ui/scroll-area";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the useProjects hook to fetch all projects
  const { data: projects = [], isLoading, isError } = useProjects();
  
  // Find the current project by ID
  const project = projects.find(p => p.id === id);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">جاري التحميل...</h2>
            <p className="mb-6">يرجى الانتظار قليلاً</p>
          </div>
        </main>
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
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">حدث خطأ</h2>
            <p className="mb-6">لم نتمكن من تحميل بيانات المشروع، يرجى المحاولة مرة أخرى</p>
            <Button onClick={() => navigate('/projects')}>
              العودة إلى المشاريع
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  // Show not found state if project doesn't exist
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">المشروع غير موجود</h2>
            <p className="mb-6">عذراً، لم يتم العثور على المشروع المطلوب</p>
            <Button onClick={() => navigate('/projects')}>
              العودة إلى المشاريع
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const category = categories.find(c => c.id === project.categoryId);
  
  // Get related projects from the same category
  const relatedProjects = projects
    .filter(p => p.categoryId === project.categoryId && p.id !== project.id)
    .slice(0, 3);

  // معالجي الأحداث للأزرار
  const handleDownloadClick = () => {
    if (!project.downloadUrl) {
      toast({
        title: "الرابط غير متوفر",
        description: "عذراً، رابط تحميل المشروع غير متوفر حالياً",
        variant: "destructive",
      });
      return;
    }
    
    // فتح الرابط في نافذة جديدة أو بدء التحميل
    window.open(project.downloadUrl, '_blank');
  };

  const handleViewPdfClick = () => {
    if (!project.pdfUrl) {
      toast({
        title: "ملف PDF غير متوفر",
        description: "عذراً، ملف PDF للمشروع غير متوفر حالياً",
        variant: "destructive",
      });
      return;
    }
    
    // فتح ملف PDF في نافذة جديدة
    window.open(project.pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-archive-primary">الرئيسية</Link>
            <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
            <Link to="/projects" className="text-gray-500 hover:text-archive-primary">المشاريع</Link>
            <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
            <span className="text-archive-primary">{project.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - Ensuring content is scrollable */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-8 overflow-y-auto max-h-full">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-archive-primary mb-4">
                  {project.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-archive-muted text-archive-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center">
                    <User className="h-5 w-5 ml-2 text-archive-secondary" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">الباحث</div>
                      <div className="font-medium">{project.author}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpenCheck className="h-5 w-5 ml-2 text-archive-secondary" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">المشرف</div>
                      <div className="font-medium">{project.supervisor}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 ml-2 text-archive-secondary" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">سنة المشروع</div>
                      <div className="font-medium">{project.year}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 ml-2 text-archive-secondary" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">القسم</div>
                      <div className="font-medium">{project.department}</div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">ملخص المشروع</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.abstract}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">وصف المشروع</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
              
              {/* Related projects */}
              {relatedProjects.length > 0 && (
                <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">مشاريع ذات صلة</h3>
                  
                  <div className="space-y-4">
                    {relatedProjects.map(related => (
                      <div key={related.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-archive-secondary transition-colors">
                        <Link to={`/project/${related.id}`} className="block">
                          <h4 className="font-medium text-archive-primary hover:text-archive-secondary mb-2">
                            {related.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {related.abstract}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar with improved sticky behavior */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-6 sticky top-24">
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-b from-archive-primary to-archive-secondary rounded-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <div className="mb-6 text-center">
                  <h3 className="font-medium mb-2">التصنيف</h3>
                  <Badge className="bg-archive-accent text-white px-3 py-1">
                    {category?.name || 'غير مصنف'}
                  </Badge>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-archive-primary hover:bg-archive-dark"
                    disabled={!project.downloadUrl}
                    onClick={handleDownloadClick}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    تنزيل المشروع
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!project.pdfUrl}
                    onClick={handleViewPdfClick}
                  >
                    <BookOpen className="h-4 w-4 ml-2" />
                    عرض PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-archive-dark text-white py-6">
        <div className="container-custom text-center">
          <p>أرشيف المشاريع الجامعية &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetail;
