
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// نوع لبيانات المشاريع
export interface Project {
  id: string;
  title: string;
  author: string;
  year: string;
  department: string;
  supervisor: string;
  created_at: string;
}

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  searchQuery: string;
  onDeleteClick: (project: Project) => void;
  formatDate: (dateString: string) => string;
}

const ProjectsTable = ({ 
  projects, 
  isLoading, 
  searchQuery, 
  onDeleteClick,
  formatDate 
}: ProjectsTableProps) => {
  // تصفية المشاريع حسب البحث
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-archive-primary" />
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">لم يتم العثور على مشاريع مطابقة للبحث</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">عنوان المشروع</TableHead>
            <TableHead className="text-right">الباحث</TableHead>
            <TableHead className="text-right">القسم</TableHead>
            <TableHead className="text-right">السنة</TableHead>
            <TableHead className="text-right">المشرف</TableHead>
            <TableHead className="text-right">تاريخ الإضافة</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id} className="hover:bg-muted/50">
              <TableCell className="max-w-[200px] truncate font-medium">
                {project.title}
              </TableCell>
              <TableCell>{project.author}</TableCell>
              <TableCell>{project.department}</TableCell>
              <TableCell>{project.year}</TableCell>
              <TableCell>{project.supervisor}</TableCell>
              <TableCell>{formatDate(project.created_at)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={`/project/${project.id}/full`}>
                          <Button size="sm" variant="ghost" className="text-archive-primary hover:text-archive-primary/90 hover:bg-archive-primary/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>عرض المشروع</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteClick(project)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>حذف المشروع</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
