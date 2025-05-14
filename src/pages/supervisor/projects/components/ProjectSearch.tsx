
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProjectSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProjectSearch = ({ searchQuery, setSearchQuery }: ProjectSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="البحث عن المشاريع..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-4 pr-10 text-right"
        dir="rtl"
      />
    </div>
  );
};

export default ProjectSearch;
