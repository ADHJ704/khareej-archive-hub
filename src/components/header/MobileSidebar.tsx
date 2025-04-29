
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';
import { SheetContent } from "@/components/ui/sheet";
import SearchBar from '@/components/SearchBar';

interface MobileSidebarProps {
  user: any;
  onSearch: (query: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

const MobileSidebar = ({ user, onSearch, onLogout, onClose }: MobileSidebarProps) => {
  return (
    <SheetContent side="right" className="bg-archive-primary text-white p-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center mb-6">
            <Book className="h-8 w-8 ml-2" />
            <span className="font-heading text-xl font-bold">أرشيف المشاريع</span>
          </div>
          <SearchBar 
            onSearch={(q) => {
              onSearch(q);
              onClose();
            }} 
            variant="minimal"
            placeholder="البحث عن مشروع..." 
          />
        </div>
        
        <nav className="flex-grow p-4">
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="block py-2 hover:bg-white/10 px-2 rounded transition"
                onClick={onClose}
              >
                الرئيسية
              </Link>
            </li>
            <li>
              <Link 
                to="/projects" 
                className="block py-2 hover:bg-white/10 px-2 rounded transition"
                onClick={onClose}
              >
                المشاريع
              </Link>
            </li>
            <li>
              <Link 
                to="/categories" 
                className="block py-2 hover:bg-white/10 px-2 rounded transition"
                onClick={onClose}
              >
                التخصصات
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link 
                    to="/suggest-project" 
                    className="block py-2 hover:bg-white/10 px-2 rounded transition"
                    onClick={onClose}
                  >
                    اقتراح مشروع
                  </Link>
                </li>
                <li>
                  <button 
                    className="block py-2 hover:bg-white/10 px-2 rounded transition w-full text-right"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                  >
                    تسجيل الخروج
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/trainee-login" 
                    className="block py-2 bg-archive-secondary hover:bg-archive-secondary/80 px-2 rounded transition text-center font-medium"
                    onClick={onClose}
                  >
                    تسجيل دخول متدرب
                  </Link>
                </li>
                <li className="mt-2">
                  <Link 
                    to="/supervisor-login" 
                    className="block py-2 bg-archive-secondary hover:bg-archive-secondary/80 px-2 rounded transition text-center font-medium"
                    onClick={onClose}
                  >
                    تسجيل دخول مشرف
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </SheetContent>
  );
};

export default MobileSidebar;
