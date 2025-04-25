
import React from 'react';
import ProjectCard from './ProjectCard';
import ProjectCardSkeleton from './ProjectCardSkeleton';
import { Project } from '@/data/projects';

interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
}

const ProjectGrid = ({ projects, loading = false }: ProjectGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">لا توجد مشاريع متاحة</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">حاول تغيير معايير البحث أو التصفية</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectGrid;
