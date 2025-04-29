
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import HeaderContent from '@/components/header/HeaderContent';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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
      <HeaderContent
        user={user}
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
        onSearch={handleSearch}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
