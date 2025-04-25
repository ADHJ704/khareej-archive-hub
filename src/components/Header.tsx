
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Search, UserCog, GraduationCap, List, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح"
    });
    navigate('/');
  };

  return (
    <header className="bg-archive-primary text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Book className="h-8 w-8 ml-2" />
          <Link to="/" className="font-heading text-2xl font-bold">أرشيف المشاريع</Link>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse w-full md:w-auto">
          <div className="relative w-full md:w-64 lg:w-80">
            <Input 
              type="text" 
              placeholder="البحث عن مشروع..." 
              className="pr-10 bg-white/10 border-white/20 placeholder:text-white/60 text-white w-full"
            />
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 h-4 w-4 text-white/60" />
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
                className="flex items-center border-white/20 text-white hover:bg-white/10 gap-2 min-w-24"
                onClick={() => navigate('/trainee-login')}
              >
                <GraduationCap className="h-4 w-4" />
                <span>تسجيل متدرب</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center border-white/20 text-white hover:bg-white/10 gap-2 min-w-24"
                onClick={() => navigate('/supervisor-login')}
              >
                <LogIn className="h-4 w-4" />
                <span>تسجيل مشرف</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
