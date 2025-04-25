import React from 'react';
import { categories } from '@/data/categories';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Folder } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8 px-4">
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
          <Link 
            to={`/projects?category=${category.id}`} 
            key={category.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
          >
            <div className="text-right">
              <h2 className="text-xl font-bold mb-2">{category.name}</h2>
              {category.description && (
                <p className="text-gray-600 mb-4">{category.description}</p>
              )}
              <span className="text-blue-500 hover:underline">عرض المشاريع</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
