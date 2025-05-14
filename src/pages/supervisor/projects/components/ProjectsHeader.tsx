
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectSearch from './ProjectSearch';

interface ProjectsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProjectsHeader = ({ searchQuery, setSearchQuery }: ProjectsHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right mb-2">
            إدارة المشاريع
          </h1>
          <p className="text-muted-foreground text-right">
            قم بعرض، تعديل، أو حذف المشاريع من الأرشيف
          </p>
        </div>
        
        <Link to="/supervisor/projects/new" className="mt-4 md:mt-0">
          <Button className="w-full md:w-auto bg-archive-primary hover:bg-archive-primary/80">
            <Plus className="ml-2 h-5 w-5" />
            إضافة مشروع جديد
          </Button>
        </Link>
      </div>
      
      <ProjectSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default ProjectsHeader;
