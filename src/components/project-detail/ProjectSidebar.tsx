
import React from 'react';
import { Calendar, User, BookOpenCheck, FileText, Building } from 'lucide-react';
import { Project } from '@/data/projects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectSidebarProps {
  project: Project;
}

const ProjectSidebar = ({ project }: ProjectSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-archive-secondary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">معلومات المشروع</CardTitle>
          <CardDescription>تفاصيل أساسية عن المشروع</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <User className="h-5 w-5 ml-3 text-archive-secondary" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">الباحث</div>
              <div className="font-medium">{project.author}</div>
            </div>
          </div>

          <div className="flex items-center">
            <BookOpenCheck className="h-5 w-5 ml-3 text-archive-secondary" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">المشرف</div>
              <div className="font-medium">{project.supervisor}</div>
            </div>
          </div>

          <div className="flex items-center">
            <Calendar className="h-5 w-5 ml-3 text-archive-secondary" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">سنة المشروع</div>
              <div className="font-medium">{project.year}</div>
            </div>
          </div>

          <div className="flex items-center">
            <Building className="h-5 w-5 ml-3 text-archive-secondary" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">القسم</div>
              <div className="font-medium">{project.department}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-archive-secondary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">التصنيفات</CardTitle>
          <CardDescription>تصنيفات المشروع</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-archive-muted text-archive-primary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSidebar;
