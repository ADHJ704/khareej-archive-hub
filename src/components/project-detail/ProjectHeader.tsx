
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/data/projects';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-archive-primary">الرئيسية</Link>
        <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
        <Link to="/projects" className="text-gray-500 hover:text-archive-primary">المشاريع</Link>
        <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
        <span className="text-archive-primary">{project.title}</span>
      </div>
    </>
  );
};

export default ProjectHeader;
