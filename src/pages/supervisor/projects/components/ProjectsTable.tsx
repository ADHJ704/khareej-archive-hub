
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Project } from '@/data/projects';

interface ProjectsTableProps {
  projects: Project[];
  onDelete: (projectId: string) => void;
}

const ProjectsTable = ({ projects, onDelete }: ProjectsTableProps) => {
  const navigate = useNavigate();
  
  const handleEdit = (projectId: string) => {
    navigate(`/supervisor/projects/edit/${projectId}`);
  };
  
  return (
    <div className="overflow-x-auto">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">عنوان المشروع</TableHead>
            <TableHead className="text-right">الكاتب</TableHead>
            <TableHead className="text-right">القسم</TableHead>
            <TableHead className="text-right">السنة</TableHead>
            <TableHead className="text-right w-24">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="text-right font-medium">{project.title}</TableCell>
                <TableCell className="text-right">{project.author}</TableCell>
                <TableCell className="text-right">{project.department}</TableCell>
                <TableCell className="text-right">{project.year}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(project.id)}
                      title="تعديل المشروع"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDelete(project.id)}
                      title="حذف المشروع"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                لا توجد مشاريع للعرض
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
