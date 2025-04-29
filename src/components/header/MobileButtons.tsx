
import React from 'react';
import { Search, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";

interface MobileButtonsProps {
  onSearchClick: () => void;
}

const MobileButtons = ({ onSearchClick }: MobileButtonsProps) => {
  return (
    <div className="flex items-center md:hidden gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSearchClick}
        className="text-white hover:bg-white/10"
      >
        <Search className="h-5 w-5" />
      </Button>
      
      {/* SheetTrigger should ONLY be used inside the Header component where the Sheet is defined */}
      <Button 
        variant="ghost" 
        size="icon"
        className="text-white hover:bg-white/10"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileButtons;
