
import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound, Home, BookOpen, Tag, MessageSquare, Settings, FileText, Plus, Trash2, LogOut } from 'lucide-react';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileSidebarProps {
  user: any;
  onSearch: (query: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

const MobileSidebar = ({ user, onLogout, onClose }: MobileSidebarProps) => {
  const isSupervisor = user?.user_metadata?.role === 'supervisor' || user?.app_metadata?.role === 'supervisor';
  
  const handleLinkClick = () => {
    onClose();
  };
  
  const handleLogout = () => {
    onLogout();
    onClose();
  };
  
  return (
    <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
      <SheetHeader className="py-4 px-5 border-b">
        <SheetTitle className="text-right">القائمة</SheetTitle>
      </SheetHeader>
      
      <div className="px-5 py-4">
        <div className="flex flex-col">
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
            <BookOpen className="ml-2 h-5 w-5" />
            <span>المشاريع</span>
          </Link>
          
          <Link 
            to="/categories"
            onClick={handleLinkClick}
            className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
          >
            <Tag className="ml-2 h-5 w-5" />
            <span>التخصصات</span>
          </Link>
          
          <Link 
            to="/ai-helper"
            onClick={handleLinkClick}
            className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
          >
            <MessageSquare className="ml-2 h-5 w-5" />
            <span>محادثة الذكاء الاصطناعي</span>
          </Link>

          {isSupervisor && (
            <>
              <Link 
                to="/supervisor/projects/new"
                onClick={handleLinkClick}
                className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1 text-archive-primary"
              >
                <Plus className="ml-2 h-5 w-5" />
                <span>إضافة مشروع</span>
              </Link>
              
              <Link 
                to="/supervisor/projects"
                onClick={handleLinkClick}
                className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1 text-archive-primary"
              >
                <Trash2 className="ml-2 h-5 w-5" />
                <span>حذف المشاريع</span>
              </Link>
            </>
          )}
          
          {user ? (
            <>
              {isSupervisor && (
                <Collapsible className="w-full">
                  <CollapsibleTrigger className={cn(
                    "flex w-full items-center py-3 px-4 hover:bg-muted rounded-lg justify-between",
                    "text-archive-primary"
                  )}>
                    <div className="flex items-center">
                      <Settings className="ml-2 h-5 w-5" />
                      <span>أدوات المشرف</span>
                    </div>
                    <span>▼</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pr-8">
                    <Link 
                      to="/supervisor/dashboard" 
                      onClick={handleLinkClick}
                      className="flex items-center py-3 px-4 hover:bg-muted rounded-lg mb-1"
                    >
                      <Settings className="ml-2 h-5 w-5" />
                      <span>لوحة التحكم</span>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex w-full items-center py-3 px-4 hover:bg-muted rounded-lg justify-start mt-4"
              >
                <LogOut className="ml-2 h-5 w-5" />
                <span>تسجيل الخروج</span>
              </Button>
            </>
          ) : (
            <div className="mt-4 flex flex-col space-y-3">
              <Link to="/trainee-login" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full justify-start">
                  <UserRound className="ml-2 h-5 w-5" />
                  تسجيل دخول متدرب
                </Button>
              </Link>
              
              <Link to="/supervisor-login" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full justify-start">
                  <UserRound className="ml-2 h-5 w-5" />
                  تسجيل دخول مشرف
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </SheetContent>
  );
};

export default MobileSidebar;
