
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// استيراد المكونات الجديدة
import Logo from '@/components/header/Logo';
import MobileButtons from '@/components/header/MobileButtons';
import MobileSearch from '@/components/header/MobileSearch';
import MobileSidebar from '@/components/header/MobileSidebar';
import DesktopNavigation from '@/components/header/DesktopNavigation';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/projects?search=${encodeURIComponent(query.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج بنجاح",
    });
    navigate('/');
  };

  return (
    <header className="bg-archive-primary text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
          <Logo />
          
          {!showMobileSearch && (
            <MobileButtons
              onSearchClick={() => setShowMobileSearch(true)}
            />
          )}
        </div>
        
        {showMobileSearch ? (
          <MobileSearch 
            onSearch={handleSearch}
            onClose={() => setShowMobileSearch(false)}
          />
        ) : (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <DesktopNavigation 
              user={user}
              onSearch={handleSearch}
              onLogout={handleLogout}
            />
            
            <MobileSidebar 
              user={user}
              onSearch={handleSearch}
              onLogout={handleLogout}
              onClose={() => setIsOpen(false)}
            />
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
