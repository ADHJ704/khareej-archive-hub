
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';

interface MobileSearchProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

const MobileSearch = ({ onSearch, onClose }: MobileSearchProps) => {
  return (
    <div className="flex items-center w-full">
      <SearchBar 
        onSearch={onSearch} 
        variant="minimal"
        className="flex-1" 
        placeholder="البحث عن مشروع..."
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="ml-2 text-white hover:bg-white/10"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileSearch;
