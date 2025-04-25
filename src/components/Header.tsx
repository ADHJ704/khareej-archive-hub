
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Search, UserCog, GraduationCap, List, LogIn, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح"
    });
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-archive-primary text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Book className="h-8 w-8 ml-2" />
          <Link to="/" className="font-heading text-2xl font-bold">أرشيف المشاريع</Link>
        </div>
        
        {showMobileSearch ? (
          <div className="flex items-center w-full">
            <form onSubmit={handleSearch} className="flex-1 flex">
              <Input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث عن مشروع..." 
                className="pr-4 bg-white/10 border-white/20 placeholder:text-white/60 text-white w-full rounded-l-none"
                autoFocus
              />
              <Button 
                type="submit" 
                className="rounded-r-none bg-white/20 hover:bg-white/30 border-r border-white/20"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowMobileSearch(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 space-x-reverse w-full md:w-auto">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileSearch(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <div className="relative hidden md:block w-64 lg:w-80">
              <form onSubmit={handleSearch} className="flex">
                <Input 
                  type="text" 
                  placeholder="البحث عن مشروع..." 
                  className="pr-10 bg-white/10 border-white/20 placeholder:text-white/60 text-white w-full rounded-l-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="rounded-r-none bg-white/20 hover:bg-white/30"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Link to="/" className="text-white/90 hover:text-white transition">الرئيسية</Link>
              <Link to="/projects" className="text-white/90 hover:text-white transition">المشاريع</Link>
              <Link to="/categories" className="text-white/90 hover:text-white transition">التصنيفات</Link>
            </nav>
            
            {user ? (
              <Button 
                variant="outline" 
                className="flex items-center border-white/20 text-white hover:bg-white/10 gap-2"
                onClick={handleLogout}
              >
                <List className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center border-white/20 text-white hover:bg-white/10 gap-2 whitespace-nowrap"
                  onClick={() => navigate('/trainee-login')}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden md:inline">تسجيل متدرب</span>
                  <span className="md:hidden">متدرب</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center border-white/20 text-white hover:bg-white/10 gap-2 whitespace-nowrap"
                  onClick={() => navigate('/supervisor-login')}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden md:inline">تسجيل مشرف</span>
                  <span className="md:hidden">مشرف</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
