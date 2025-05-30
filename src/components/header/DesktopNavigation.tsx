
import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound, MessageSquareText, FileText, Plus, Settings, Trash2 } from 'lucide-react';
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
        
        {/* أيقونات المشرف التي تظهر فقط للمشرف بعد تسجيل الدخول */}
        {isSupervisor && (
          <>
            <Link to="/supervisor/add-project" className="text-white/90 hover:text-white transition flex items-center">
              <Plus className="ml-1 h-4 w-4" />
              إضافة مشروع
            </Link>
            <Link to="/supervisor/manage-projects" className="text-white/90 hover:text-white transition flex items-center">
              <Trash2 className="ml-1 h-4 w-4" />
              إدارة المشاريع
            </Link>
          </>
        )}
        
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
                    <Link to="/supervisor/dashboard" className="flex items-center cursor-pointer">
                      <Settings className="ml-2 h-4 w-4" />
                      لوحة التحكم
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
