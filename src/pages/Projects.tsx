import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import Header from '@/components/Header';
import ProjectGrid from '@/components/ProjectGrid';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { categories } from '@/data/categories';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';

const Projects = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [suggestedProject, setSuggestedProject] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const { data: projects, isLoading, error } = useProjects(
    selectedCategories[0],
    searchQuery
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
    navigate('/projects');
  };

  const handleAISuggestion = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('project-suggestion', {
        body: JSON.stringify({ 
          message: suggestionMessage, 
          department: departmentFilter 
        })
      });

      if (error) throw error;

      setSuggestedProject(data.suggestion);
      toast({
        title: "اقتراح مشروع",
        description: "تم توليد اقتراح مشروع بنجاح",
      });
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء توليد الاقتراح",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container-custom">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-archive-primary mb-4">
                مشاريع التخرج
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                استعرض مجموعة متنوعة من مشاريع التخرج المميزة في مختلف التخصصات
              </p>
            </div>
            <Button
              onClick={() => setShowSuggestionDialog(true)}
              className="bg-archive-primary hover:bg-archive-dark"
            >
              <Bot className="h-4 w-4 ml-2" />
              اقتراح مشروع
            </Button>
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
                      {projects?.length || 0} مشروع
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
                projects={projects || []} 
                loading={isLoading} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={showSuggestionDialog} onOpenChange={setShowSuggestionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>اقتراح مشروع تخرج</DialogTitle>
            <DialogDescription>
              أخبرنا عن اهتماماتك وتخصصك، وسنقترح عليك مشروعًا مناسبًا
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">اختر التخصص</option>
              <option value="علوم الحاسب">علوم الحاسب</option>
              <option value="هندسة الحاسب">هندسة الحاسب</option>
              <option value="نظم المعلومات">نظم المعلومات</option>
              {/* Add more departments */}
            </select>
            
            <Textarea 
              placeholder="اكتب بعض التفاصيل عن اهتماماتك أو المجال الذي ترغب في العمل فيه (اختياري)"
              value={suggestionMessage}
              onChange={(e) => setSuggestionMessage(e.target.value)}
              className="w-full min-h-[100px]"
            />
            
            <Button 
              onClick={handleAISuggestion}
              className="w-full bg-archive-primary hover:bg-archive-dark"
            >
              اقتراح مشروع
            </Button>
            
            {suggestedProject && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">المشروع المقترح:</h3>
                <p>{suggestedProject}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-archive-dark text-white py-6">
        <div className="container-custom text-center">
          <p>أرشيف المشاريع الجامعية &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Projects;
