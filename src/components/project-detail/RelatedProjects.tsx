
import React from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Project } from '@/data/projects';

interface RelatedProjectsProps {
  projects: Project[];
}

const RelatedProjects = ({ projects }: RelatedProjectsProps) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">مشاريع ذات صلة</h3>
      
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-archive-secondary transition-colors">
            <Link to={`/project/${project.id}`} className="block">
              <h4 className="font-medium text-archive-primary hover:text-archive-secondary mb-2">
                {project.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.abstract}
              </p>
              
              {/* Availability badges */}
              <div className="flex gap-2 mt-2">
                {project.project_content && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-500">
                    <FileText className="h-3 w-3 ml-1" />
                    محتوى متاح
                  </Badge>
                )}
                {project.downloadUrl && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-500">
                    <Download className="h-3 w-3 ml-1" />
                    تحميل متاح
                  </Badge>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProjects;
