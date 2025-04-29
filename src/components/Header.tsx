
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Search, X, Menu, UserRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SearchBar from '@/components/SearchBar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
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
      <div className="container-custom flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
          <div className="flex items-center">
            <Book className="h-8 w-8 ml-2" />
            <Link to="/" className="font-heading text-2xl font-bold">أرشيف المشاريع</Link>
          </div>
          
          <div className="flex items-center md:hidden gap-2">
            {!showMobileSearch && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSearch(true)}
                  className="text-white hover:bg-white/10"
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/10"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-archive-primary text-white p-0">
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center mb-6">
                          <Book className="h-8 w-8 ml-2" />
                          <span className="font-heading text-xl font-bold">أرشيف المشاريع</span>
                        </div>
                        <SearchBar 
                          onSearch={(q) => {
                            handleSearch(q);
                            setIsOpen(false);
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
                              onClick={() => setIsOpen(false)}
                            >
                              الرئيسية
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/projects" 
                              className="block py-2 hover:bg-white/10 px-2 rounded transition"
                              onClick={() => setIsOpen(false)}
                            >
                              المشاريع
                            </Link>
                          </li>
                          {user ? (
                            <>
                              <li>
                                <Link 
                                  to="/suggest-project" 
                                  className="block py-2 hover:bg-white/10 px-2 rounded transition"
                                  onClick={() => setIsOpen(false)}
                                >
                                  اقتراح مشروع
                                </Link>
                              </li>
                              <li>
                                <button 
                                  className="block py-2 hover:bg-white/10 px-2 rounded transition w-full text-right"
                                  onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
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
                                  className="block py-2 bg-white/20 hover:bg-white/30 px-2 rounded transition text-center font-medium"
                                  onClick={() => setIsOpen(false)}
                                >
                                  تسجيل دخول متدرب
                                </Link>
                              </li>
                              <li className="mt-2">
                                <Link 
                                  to="/supervisor-login" 
                                  className="block py-2 bg-archive-secondary hover:bg-archive-secondary/80 px-2 rounded transition text-center font-medium"
                                  onClick={() => setIsOpen(false)}
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
                </Sheet>
              </>
            )}
          </div>
        </div>
        
        {showMobileSearch ? (
          <div className="flex items-center w-full">
            <SearchBar 
              onSearch={handleSearch} 
              variant="minimal"
              className="flex-1" 
              placeholder="البحث عن مشروع..."
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowMobileSearch(false)}
              className="ml-2 text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 space-x-reverse w-full md:w-auto">
            <div className="hidden md:block md:w-64 lg:w-80">
              <SearchBar 
                onSearch={handleSearch} 
                variant="minimal"
                placeholder="البحث عن مشروع..." 
              />
            </div>
            
            <nav className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Link to="/" className="text-white/90 hover:text-white transition">الرئيسية</Link>
              <Link to="/projects" className="text-white/90 hover:text-white transition">المشاريع</Link>
              
              {user ? (
                <>
                  <Link to="/suggest-project" className="text-white/90 hover:text-white transition">اقتراح مشروع</Link>
                  <Button 
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Link to="/trainee-login">
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-archive-primary"
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
        )}
      </div>
    </header>
  );
};

export default Header;
