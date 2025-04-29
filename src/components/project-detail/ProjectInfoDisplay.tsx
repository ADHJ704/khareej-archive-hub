
import React from 'react';
import { User, BookOpenCheck, Calendar, BookOpen } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from '@/data/projects';

interface ProjectInfoDisplayProps {
  project: Project;
}

const ProjectInfoDisplay = ({ project }: ProjectInfoDisplayProps) => {
  const hasProjectContent = !!project.project_content;

  return (
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
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">وصف المشروع</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {project.description}
        </p>
      </div>
      
      {/* Project content section */}
      {hasProjectContent && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">محتوى المشروع الكامل</h3>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <ScrollArea className="h-[400px] rounded-md pr-4">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {project.project_content}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectInfoDisplay;
