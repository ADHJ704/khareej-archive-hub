
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Button } from "@/components/ui/button";
import { Project } from '@/data/projects';

interface FeaturedProjectsProps {
  projects: Project[];
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  // تأكد من أن المشاريع تحتوي على روابط PDF وتحميل فعّالة
  const filteredProjects = projects.filter(project => 
    !!project.pdfUrl && !!project.downloadUrl &&
    validateUrl(project.pdfUrl) && validateUrl(project.downloadUrl)
  );
  
  // أخذ أحدث 3 مشاريع فقط للعرض المميز
  const featuredProjects = filteredProjects.slice(0, 3);

  return (
    <section className="py-10 bg-archive-muted">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-archive-primary">
            أحدث المشاريع الكاملة
          </h2>
          <Link to="/projects">
            <Button variant="link" className="text-archive-secondary flex items-center gap-1 hover:text-archive-primary transition-colors">
              <span>عرض الكل</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">لا توجد مشاريع كاملة متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
};

// دالة للتحقق من صحة الروابط
function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export default FeaturedProjects;
