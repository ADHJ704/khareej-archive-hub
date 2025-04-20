
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProjectGrid from '@/components/ProjectGrid';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import { projects, searchProjects, Project } from '@/data/projects';
import { categories } from '@/data/categories';

const Projects = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract search query from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      setFilteredProjects(searchProjects(searchParam));
    }
    
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location.search]);

  // Apply filters when selected categories change
  useEffect(() => {
    setLoading(true);
    
    let result = [...projects];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(project => 
        selectedCategories.includes(project.categoryId)
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      result = searchProjects(searchQuery).filter(project => 
        selectedCategories.length === 0 || selectedCategories.includes(project.categoryId)
      );
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setFilteredProjects(result);
      setLoading(false);
    }, 500);
  }, [selectedCategories, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/projects?search=${encodeURIComponent(query)}`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    navigate('/projects');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-archive-primary mb-4">
              مشاريع التخرج
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              استعرض مجموعة متنوعة من مشاريع التخرج المميزة في مختلف التخصصات
            </p>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <SearchBar 
                onSearch={handleSearch} 
                className="mb-4" 
              />
              
              <div className="p-4 bg-white dark:bg-card rounded-lg shadow-sm">
                <h3 className="font-medium text-lg mb-4">تصفية النتائج</h3>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    التصنيفات الرئيسية
                  </h4>
                  <CategoryFilter 
                    categories={categories} 
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
                
                {(selectedCategories.length > 0 || searchQuery) && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={clearFilters}
                  >
                    مسح التصفية
                  </Button>
                )}
              </div>
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {filteredProjects.length} مشروع
                      {searchQuery && 
                        <span className="text-gray-600 dark:text-gray-400 mr-2">
                          لنتائج البحث: "{searchQuery}"
                        </span>
                      }
                    </h3>
                  </div>
                </div>
              </div>
              
              <ProjectGrid 
                projects={filteredProjects} 
                loading={loading} 
              />
            </div>
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

export default Projects;
