
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, FileText, LogOut, UserRound, Compass, MessageSquareText, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const isSupervisor = user?.user_metadata?.role === 'supervisor';
  
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
        
        {isSupervisor && (
          <Collapsible className="w-full">
            <CollapsibleTrigger className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1 w-full text-right">
              <Settings className="ml-2 h-5 w-5" />
              <span>أدوات المشرف</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pr-8">
              <Link 
                to="/supervisor/projects/new" 
                onClick={handleLinkClick}
                className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
              >
                <Plus className="ml-2 h-5 w-5" />
                <span>إضافة مشروع جديد</span>
              </Link>
              <Link 
                to="/supervisor/projects" 
                onClick={handleLinkClick}
                className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
              >
                <FileText className="ml-2 h-5 w-5" />
                <span>عرض / حذف المشاريع</span>
              </Link>
            </CollapsibleContent>
          </Collapsible>
        )}
        
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
