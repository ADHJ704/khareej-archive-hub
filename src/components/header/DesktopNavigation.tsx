
import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound, MessageSquareText, FileText, Plus, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SearchBar from '@/components/SearchBar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DesktopNavigationProps {
  user: any;
  onSearch: (query: string) => void;
  onLogout: () => void;
}

const DesktopNavigation = ({ user, onSearch, onLogout }: DesktopNavigationProps) => {
  const isSupervisor = user?.user_metadata?.role === 'supervisor' || user?.app_metadata?.role === 'supervisor';

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
            {isSupervisor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    className="text-white hover:bg-white/20 flex items-center"
                  >
                    <Settings className="ml-2 h-4 w-4" />
                    أدوات المشرف
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg rounded-md" align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/supervisor/projects/new" className="flex items-center cursor-pointer">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مشروع جديد
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/supervisor/projects" className="flex items-center cursor-pointer">
                      <FileText className="ml-2 h-4 w-4" />
                      عرض / حذف المشاريع
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
