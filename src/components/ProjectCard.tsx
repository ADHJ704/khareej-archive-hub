
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, File } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard = ({ project, featured = false }: ProjectCardProps) => {
  // تحقق من وجود محتوى المشروع
  const hasContent = !!project.project_content || !!project.full_content;
  
  return (
    <div className={`archive-card overflow-hidden flex flex-col ${featured ? 'h-full' : ''}`}>
      <div className={`relative ${featured ? 'h-48' : 'h-40'} bg-gradient-to-b from-archive-primary to-archive-secondary flex items-center justify-center`}>
        <File className="h-16 w-16 text-white/80" />
        <Badge className="absolute top-3 right-3 bg-archive-accent">
          {project.year}
        </Badge>
        
        {/* عرض شارات توفر المحتوى بطريقة أكثر وضوحًا */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {hasContent && (
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-500">
              <FileText className="h-3 w-3 ml-1" />
              المحتوى متاح
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="font-heading text-lg font-semibold mb-2 line-clamp-2">{project.title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span>{project.author}</span>
          <span className="mx-2">•</span>
          <span>{project.department}</span>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {project.abstract}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-archive-muted text-archive-primary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        <Link to={`/project/${project.id}`}>
          <Button className="w-full bg-archive-secondary hover:bg-archive-primary">
            <BookOpen className="h-4 w-4 ml-2" />
            عرض المشروع
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
