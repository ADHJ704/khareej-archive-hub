
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectSearch from './ProjectSearch';

interface ProjectsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProjectsHeader = ({ searchQuery, setSearchQuery }: ProjectsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-archive-dark dark:text-white">حذف المشاريع</h1>
        <p className="text-muted-foreground">قم بإدارة المشاريع في قاعدة البيانات</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <ProjectSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <Button 
          onClick={() => navigate('/supervisor/projects/new')}
          className="bg-archive-primary hover:bg-archive-primary/90"
        >
          <Plus className="ml-2 h-4 w-4" />
          إضافة مشروع
        </Button>
      </div>
    </div>
  );
};

export default ProjectsHeader;
