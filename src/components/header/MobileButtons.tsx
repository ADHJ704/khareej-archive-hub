
import React from 'react';
import { Search, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MobileButtonsProps {
  onSearchClick: () => void;
  onMenuClick: () => void;
}

const MobileButtons = ({ onSearchClick, onMenuClick }: MobileButtonsProps) => {
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
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onMenuClick}
        className="text-white hover:bg-white/10"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileButtons;
