
import React, { useState } from 'react';
import { categories } from '@/data/categories';
import { Link } from 'react-router-dom';

const Categories = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-right">تصنيفات المشاريع</h1>
      
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
