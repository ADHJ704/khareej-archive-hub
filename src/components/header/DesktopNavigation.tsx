
import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound, MessageSquareText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';

interface DesktopNavigationProps {
  user: any;
  onSearch: (query: string) => void;
  onLogout: () => void;
}

const DesktopNavigation = ({ user, onSearch, onLogout }: DesktopNavigationProps) => {
  return (
    <div className="flex items-center space-x-4 space-x-reverse w-full md:w-auto">
      <div className="hidden md:block md:w-64 lg:w-80">
        <SearchBar 
          onSearch={onSearch} 
          variant="minimal"
          placeholder="البحث عن مشروع..." 
        />
      </div>
      
      <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
        <Link to="/" className="text-white/90 hover:text-white transition">الرئيسية</Link>
        <Link to="/projects" className="text-white/90 hover:text-white transition">المشاريع</Link>
        <Link to="/categories" className="text-white/90 hover:text-white transition">التخصصات</Link>
        <Link to="/ai-helper" className="text-white/90 hover:text-white transition">محادثة الذكاء الاصطناعي</Link>
        
        {user ? (
          <>
            <Button 
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={onLogout}
            >
              تسجيل الخروج
            </Button>
          </>
        ) : (
          <div className="flex items-center space-x-2 space-x-reverse">
            <Link to="/trainee-login">
              <Button 
                className="bg-archive-secondary hover:bg-archive-secondary/80"
              >
                <UserRound className="ml-1 h-4 w-4" />
                تسجيل دخول متدرب
              </Button>
            </Link>
            <Link to="/supervisor-login">
              <Button 
                className="bg-archive-secondary hover:bg-archive-secondary/80"
              >
                <UserRound className="ml-1 h-4 w-4" />
                تسجيل دخول مشرف
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default DesktopNavigation;
