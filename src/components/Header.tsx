import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// استيراد المكونات الجديدة
import Logo from '@/components/header/Logo';
import MobileSearch from '@/components/header/MobileSearch';
import MobileSidebar from '@/components/header/MobileSidebar';
import DesktopNavigation from '@/components/header/DesktopNavigation';
import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <div className="flex items-center md:hidden gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(true)}
                className="text-white hover:bg-white/10"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                
                <MobileSidebar 
                  user={user}
                  onSearch={handleSearch}
                  onLogout={handleLogout}
                  onClose={() => setIsOpen(false)}
                />
              </Sheet>
            </div>
          )}
        </div>
        
        {showMobileSearch ? (
          <MobileSearch 
            onSearch={handleSearch}
            onClose={() => setShowMobileSearch(false)}
          />
        ) : (
          <DesktopNavigation 
            user={user}
            onSearch={handleSearch}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
