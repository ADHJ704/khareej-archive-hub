
import React from 'react';
import { categories } from '@/data/categories';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Folder } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const Categories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate('/');
  };

  const handleCategoryClick = (categoryId: string) => {
    if (user) {
      navigate(`/projects?category=${categoryId}`);
    } else {
      navigate(`/trainee-login`, { state: { redirectTo: `/projects?category=${categoryId}` } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleGoBack}
              className="rtl:ml-auto"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold text-right">تصنيفات المشاريع</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer"
              >
                <div className="text-right">
                  <h2 className="text-xl font-bold mb-2">{category.name}</h2>
                  {category.description && (
                    <p className="text-gray-600 mb-4">{category.description}</p>
                  )}
                  <span className="text-blue-500 hover:underline">
                    {user ? "عرض المشاريع" : "تسجيل الدخول لعرض المشاريع"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-archive-dark text-white py-6">
        <div className="container-custom text-center">
          <p>أرشيف المشاريع الجامعية &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Categories;
