
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectSearch from './ProjectSearch';

interface ProjectsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProjectsHeader = ({ searchQuery, setSearchQuery }: ProjectsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right mb-4 md:mb-0">
        إدارة المشاريع
      </h1>
      
      <div className="flex w-full md:w-auto space-x-4 space-x-reverse">
        <Button 
          className="bg-archive-primary hover:bg-archive-primary/80"
          onClick={() => navigate('/supervisor/projects/new')}
        >
          <Plus className="ml-2 h-5 w-5" />
          إضافة مشروع جديد
        </Button>
        
        <ProjectSearch 
          value={searchQuery} 
          onChange={setSearchQuery} 
        />
      </div>
    </div>
  );
};

export default ProjectsHeader;
