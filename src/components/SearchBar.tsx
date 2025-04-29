
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'minimal';
}

const SearchBar = ({ 
  onSearch, 
  className = '', 
  placeholder = "ابحث عن مشاريع التخرج...", 
  variant = 'default' 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Minimal variant for header
  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <div className="relative flex">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="rounded-l-none pr-4 text-right bg-white dark:bg-background text-foreground h-10 border-archive-primary/20 focus-visible:ring-archive-primary w-full"
            aria-label="البحث"
            dir="rtl"
          />
          <Button 
            type="submit" 
            className="rounded-r-none bg-archive-primary hover:bg-archive-dark h-10 px-3 shrink-0"
            size={isMobile ? "icon" : "default"}
          >
            {isMobile ? (
              <Search className="h-4 w-4" />
            ) : (
              <>
                <Search className="h-4 w-4 ml-2" />
                <span>بحث</span>
              </>
            )}
          </Button>
        </div>
      </form>
    );
  }

  // Default variant with shadow for homepage
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex shadow-md rounded-md overflow-hidden">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="rounded-l-none pr-4 text-right bg-white dark:bg-background text-foreground h-12 border-archive-primary/20 focus-visible:ring-archive-primary w-full"
          aria-label="البحث"
          dir="rtl"
        />
        <Button 
          type="submit" 
          className="rounded-r-none bg-archive-primary hover:bg-archive-dark h-12 px-5 shrink-0"
        >
          <Search className="h-4 w-4 ml-2" />
          <span>بحث</span>
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
