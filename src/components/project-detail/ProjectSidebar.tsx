
import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Project } from '@/data/projects';
import { categories } from '@/data/categories';

interface ProjectSidebarProps {
  project: Project;
}

const ProjectSidebar = ({ project }: ProjectSidebarProps) => {
  const category = categories.find(c => c.id === project.categoryId);
  
  const hasProjectContent = !!project.project_content;
  const hasFullContent = !!project.full_content;

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
        <Link to={`/project-details/${project.id}`}>
          <Button 
            className="w-full bg-archive-primary hover:bg-archive-dark"
          >
            <FileText className="h-4 w-4 ml-2" />
            عرض تفاصيل المشروع
          </Button>
        </Link>
        
        {/* Availability indicator box */}
        <div className={`mt-4 p-3 rounded-md ${(!hasProjectContent && !hasFullContent) 
          ? 'bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' 
          : 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
          <p className="text-sm font-medium mb-2 text-center">
            {(!hasProjectContent && !hasFullContent) 
              ? 'محتوى المشروع غير متوفر' 
              : 'محتوى المشروع المتوفر'}
          </p>
          <ul className="space-y-1 text-sm">
            <li className={`flex items-center ${hasProjectContent || hasFullContent ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${hasProjectContent || hasFullContent ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              المحتوى الكامل: {hasProjectContent || hasFullContent ? 'متاح' : 'غير متاح'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
