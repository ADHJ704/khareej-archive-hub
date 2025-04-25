
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, LogIn, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
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
          
          <Button 
            variant="outline" 
            className="hidden md:flex items-center border-white/20 text-white hover:bg-white/10 gap-2"
          >
            <LogIn className="h-4 w-4" />
            تسجيل الدخول
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
