
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
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="ابحث عن مشاريع التخرج..."
          className="rounded-l-none pr-4 text-right bg-white dark:bg-background text-foreground"
          aria-label="البحث"
          dir="rtl"
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
