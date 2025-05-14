
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const ProjectSearch = ({ value, onChange }: ProjectSearchProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="بحث في المشاريع..."
        value={value}
        onChange={handleChange}
        className="pl-4 pr-10 w-full text-right"
      />
    </div>
  );
};

export default ProjectSearch;
