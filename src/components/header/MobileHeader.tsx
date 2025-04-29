
import React, { useState } from 'react';
import { Sheet } from "@/components/ui/sheet";
import Logo from './Logo';
import MobileButtons from './MobileButtons';
import MobileSearch from './MobileSearch';
import MobileSidebar from './MobileSidebar';

interface MobileHeaderProps {
  user: any;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  onSearch: (query: string) => void;
  onLogout: () => void;
}

const MobileHeader = ({
  user,
  showMobileSearch,
  setShowMobileSearch,
  onSearch,
  onLogout
}: MobileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenSidebar = () => {
    setIsOpen(true);
  };

  if (showMobileSearch) {
    return (
      <MobileSearch 
        onSearch={onSearch}
        onClose={() => setShowMobileSearch(false)}
      />
    );
  }
  
  return (
    <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
      <Logo />
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <MobileButtons
          onSearchClick={() => setShowMobileSearch(true)}
          onMenuClick={handleOpenSidebar}
        />
        
        <MobileSidebar 
          user={user}
          onSearch={onSearch}
          onLogout={onLogout}
          onClose={() => setIsOpen(false)}
        />
      </Sheet>
    </div>
  );
};

export default MobileHeader;
