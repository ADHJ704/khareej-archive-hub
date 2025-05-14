
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { categories } from '@/data/categories';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectResults from '@/components/projects/ProjectResults';
import ProjectSuggestionDialog from '@/components/projects/ProjectSuggestionDialog';

const Projects = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const { data: projects, isLoading: projectsLoading, error } = useProjects(
    selectedCategories[0],
    searchQuery,
    departmentFilter === 'all' ? '' : departmentFilter
  );

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location.search]);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "خطأ في تحميل المشاريع",
        description: "حدث خطأ أثناء تحميل المشاريع، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  }, [error, toast]);

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
    setDepartmentFilter('all');
    navigate('/projects');
  };

  // تعديل معالج حوار الاقتراحات للتأكد من تمرير قيمة منطقية فقط
  const handleSuggestionDialogChange = (value: boolean): void => {
    setShowSuggestionDialog(Boolean(value));
  };

  const hasActiveFilters = selectedCategories.length > 0 || searchQuery || departmentFilter !== 'all';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <ProjectsHeader onRequestSuggestion={() => setShowSuggestionDialog(true)} />
          
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <SearchBar 
                onSearch={handleSearch} 
                className="mb-4" 
              />
              
              <ProjectFilters 
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                departmentFilter={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                categories={categories}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
              />
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <ProjectResults 
                projects={projects} 
                loading={projectsLoading} 
                searchQuery={searchQuery}
                departmentFilter={departmentFilter}
              />
            </div>
          </div>
        </div>
      </main>
      
      <ProjectSuggestionDialog 
        open={showSuggestionDialog} 
        onOpenChange={handleSuggestionDialogChange}
      />
      
      <footer className="bg-archive-dark text-white py-6">
        <div className="container-custom text-center">
          <p>أرشيف المشاريع الجامعية &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Projects;
