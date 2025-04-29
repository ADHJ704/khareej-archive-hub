
import React from 'react';
import { Download, BookOpen } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Project } from '@/data/projects';
import { categories } from '@/data/categories';

interface ProjectSidebarProps {
  project: Project;
}

const ProjectSidebar = ({ project }: ProjectSidebarProps) => {
  const { toast } = useToast();
  const category = categories.find(c => c.id === project.categoryId);
  
  const isDownloadAvailable = !!project.downloadUrl;
  const hasProjectContent = !!project.project_content;

  const handleDownloadClick = () => {
    if (!project.downloadUrl) {
      toast({
        title: "الرابط غير متوفر",
        description: "عذراً، رابط تحميل المشروع غير متوفر حالياً",
        variant: "destructive",
      });
      return;
    }
    
    window.open(project.downloadUrl, '_blank');
    
    toast({
      title: "بدء التحميل",
      description: "تم بدء تحميل المشروع",
    });
  };

  return (
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
          className={`w-full ${isDownloadAvailable 
            ? 'bg-archive-primary hover:bg-archive-dark' 
            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'}`}
          disabled={!isDownloadAvailable}
          onClick={handleDownloadClick}
        >
          <Download className="h-4 w-4 ml-2" />
          {isDownloadAvailable ? 'تنزيل المشروع' : 'التحميل غير متاح'}
        </Button>
        
        {/* Availability indicator box */}
        <div className={`mt-4 p-3 rounded-md ${(!hasProjectContent && !isDownloadAvailable) 
          ? 'bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' 
          : 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
          <p className="text-sm font-medium mb-2 text-center">
            {(!hasProjectContent && !isDownloadAvailable) 
              ? 'ملفات المشروع غير متوفرة' 
              : 'محتوى المشروع المتوفر'}
          </p>
          <ul className="space-y-1 text-sm">
            <li className={`flex items-center ${hasProjectContent ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${hasProjectContent ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              المحتوى الكامل: {hasProjectContent ? 'متاح' : 'غير متاح'}
            </li>
            <li className={`flex items-center ${isDownloadAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isDownloadAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              ملف للتحميل: {isDownloadAvailable ? 'متاح' : 'غير متاح'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
