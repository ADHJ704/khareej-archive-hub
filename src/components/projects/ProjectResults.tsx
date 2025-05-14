
import React from 'react';
import ProjectGrid from '@/components/ProjectGrid';
import { Project } from '@/data/projects';

interface ProjectResultsProps {
  projects: Project[] | undefined;
  loading: boolean;
  searchQuery: string;
  departmentFilter: string;
}

const ProjectResults = ({ 
  projects, 
  loading, 
  searchQuery, 
  departmentFilter 
}: ProjectResultsProps) => {
  return (
    <>
      <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">
              {projects?.length || 0} مشروع
              {searchQuery && 
                <span className="text-gray-600 dark:text-gray-400 mr-2">
                  لنتائج البحث: "{searchQuery}"
                </span>
              }
              {departmentFilter !== 'all' && 
                <span className="text-gray-600 dark:text-gray-400 mr-2">
                  في تخصص: "{departmentFilter}"
                </span>
              }
            </h3>
          </div>
        </div>
      </div>
      
      <ProjectGrid 
        projects={projects || []} 
        loading={loading} 
      />
    </>
  );
};

export default ProjectResults;
