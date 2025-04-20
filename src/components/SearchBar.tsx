
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar = ({ onSearch, className = '' }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن مشاريع التخرج..."
          className="rounded-l-none pr-4"
        />
        <Button 
          type="submit" 
          className="rounded-r-none bg-archive-primary hover:bg-archive-dark"
        >
          <Search className="h-4 w-4 ml-2" />
          <span>بحث</span>
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
