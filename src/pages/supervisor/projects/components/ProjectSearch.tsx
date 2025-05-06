
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const ProjectSearch = ({ value, onChange }: ProjectSearchProps) => {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-4 pr-10 text-right"
        placeholder="بحث عن مشروع..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ProjectSearch;
