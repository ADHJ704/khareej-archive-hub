
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProjectsHeaderProps {
  onRequestSuggestion: () => void;
}

const ProjectsHeader = ({ onRequestSuggestion }: ProjectsHeaderProps) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-heading font-bold text-archive-primary mb-4">
          مشاريع التخرج
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          استعرض مجموعة متنوعة من مشاريع التخرج المميزة في مختلف التخصصات
        </p>
      </div>
      <Button
        onClick={onRequestSuggestion}
        className="bg-archive-primary hover:bg-archive-dark"
      >
        <Bot className="h-4 w-4 ml-2" />
        اقتراح مشروع
      </Button>
    </div>
  );
};

export default ProjectsHeader;
