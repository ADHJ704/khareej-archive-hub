
import React from 'react';
import DesktopNavigation from './DesktopNavigation';
import MobileHeader from './MobileHeader';

interface HeaderContentProps {
  user: any;
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
  onSearch: (query: string) => void;
  onLogout: () => void;
}

const HeaderContent = ({
  user,
  showMobileSearch,
  setShowMobileSearch,
  onSearch,
  onLogout
}: HeaderContentProps) => {
  return (
    <div className="container-custom flex flex-col md:flex-row items-center justify-between">
      <MobileHeader
        user={user}
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
        onSearch={onSearch}
        onLogout={onLogout}
      />
      
      {!showMobileSearch && (
        <DesktopNavigation 
          user={user}
          onSearch={onSearch}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};

export default HeaderContent;
