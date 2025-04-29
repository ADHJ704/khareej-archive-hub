
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
  // Reliable PDF and download URLs that are known to work
  const reliablePdfUrls = [
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://africau.edu/images/default/sample.pdf',
    'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
    'https://www.orimi.com/pdf-test.pdf',
    'https://www.clickdimensions.com/links/TestPDFfile.pdf'
  ];
  
  const reliableDownloadUrls = [
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip',
    'https://file-examples.com/storage/fe5947fd2362fc197a3c2df/2017/04/file_example_ZIP_1MB.zip',
    'https://filesamples.com/samples/archive/zip/sample1.zip',
    'https://filesamples.com/samples/document/zip/sample2.zip',
    'https://filesamples.com/samples/document/zip/sample3.zip'
  ];
  
  // Function to validate URL is one of our known working URLs
  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return reliablePdfUrls.includes(url) || reliableDownloadUrls.includes(url);
    } catch (e) {
      return false;
    }
  };
  
  // Filter to only show projects with verified working links
  const filteredProjects = projects.filter(project => 
    !!project.pdfUrl && !!project.downloadUrl &&
    isValidUrl(project.pdfUrl) && isValidUrl(project.downloadUrl)
  );
  
  // Take latest 3 projects with verified links
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

export default FeaturedProjects;
