
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, FileText, LogOut, UserRound, Compass, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MobileSidebarProps {
  user: any;
  onLogout: () => void;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const MobileSidebar = ({ user, onLogout, onClose, onSearch }: MobileSidebarProps) => {
  const handleLinkClick = () => {
    onClose();
  };
  
  const handleLogout = () => {
    onLogout();
    onClose();
  };
  
  return (
    <SheetContent side="right" className="w-64 sm:w-80">
      <SheetHeader>
        <SheetTitle className="text-right">القائمة</SheetTitle>
      </SheetHeader>
      
      <div className="flex flex-col mt-6">
        <Link 
          to="/" 
          onClick={handleLinkClick}
          className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
        >
          <Home className="ml-2 h-5 w-5" />
          <span>الرئيسية</span>
        </Link>
        
        <Link 
          to="/projects" 
          onClick={handleLinkClick}
          className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
        >
          <FileText className="ml-2 h-5 w-5" />
          <span>المشاريع</span>
        </Link>
        
        <Link 
          to="/categories" 
          onClick={handleLinkClick}
          className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
        >
          <Compass className="ml-2 h-5 w-5" />
          <span>التخصصات</span>
        </Link>
        
        <Link 
          to="/ai-helper" 
          onClick={handleLinkClick}
          className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
        >
          <MessageSquareText className="ml-2 h-5 w-5" />
          <span>محادثة الذكاء الاصطناعي</span>
        </Link>
        
        <div className="border-t my-4"></div>
        
        {user ? (
          <Button
            variant="destructive"
            className="mt-2"
            onClick={handleLogout}
          >
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/trainee-login" onClick={handleLinkClick}>
              <Button className="w-full bg-archive-secondary hover:bg-archive-secondary/80">
                <UserRound className="ml-2 h-4 w-4" />
                تسجيل دخول متدرب
              </Button>
            </Link>
            <Link to="/supervisor-login" onClick={handleLinkClick}>
              <Button className="w-full bg-archive-secondary hover:bg-archive-secondary/80">
                <UserRound className="ml-2 h-4 w-4" />
                تسجيل دخول مشرف
              </Button>
            </Link>
          </div>
        )}
      </div>
    </SheetContent>
  );
};

export default MobileSidebar;
