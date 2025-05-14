
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Project {
  id: string;
  title: string;
  author: string;
  year: string;
  department: string;
  supervisor: string;
  created_at?: string;
}

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  searchQuery: string;
  onDeleteClick: (project: Project) => void;
  formatDate: (dateString?: string) => string;
}

const ProjectsTable = ({
  projects,
  isLoading,
  searchQuery,
  onDeleteClick,
  formatDate,
}: ProjectsTableProps) => {
  // تصفية المشاريع بناء على البحث
  const filteredProjects = searchQuery
    ? projects.filter(
        project =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary mx-auto"></div>
        <p className="mt-4 text-archive-dark dark:text-white">جارِ تحميل المشاريع...</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-archive-dark dark:text-white text-lg">لم يتم العثور على مشاريع</p>
        {searchQuery && (
          <p className="text-muted-foreground mt-2">
            لا توجد نتائج مطابقة للبحث: "{searchQuery}"
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">عنوان المشروع</TableHead>
            <TableHead className="text-right">الباحث</TableHead>
            <TableHead className="text-right">القسم</TableHead>
            <TableHead className="text-right">السنة</TableHead>
            <TableHead className="text-right">المشرف</TableHead>
            <TableHead className="text-right">تاريخ الإضافة</TableHead>
            <TableHead className="text-right">العمليات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium text-right">{project.title}</TableCell>
              <TableCell className="text-right">{project.author}</TableCell>
              <TableCell className="text-right">{project.department}</TableCell>
              <TableCell className="text-right">{project.year}</TableCell>
              <TableCell className="text-right">{project.supervisor}</TableCell>
              <TableCell className="text-right">{formatDate(project.created_at)}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <Link to={`/project/${project.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Eye size={16} className="text-archive-secondary" />
                      <span className="sr-only">عرض</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => onDeleteClick(project)}
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">حذف</span>
                  </Button>
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
