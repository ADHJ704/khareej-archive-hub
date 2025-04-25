
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
  DialogFooter,
} from "@/components/ui/dialog";
import { categories } from '@/data/categories';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const { data: projects, isLoading: projectsLoading, error } = useProjects(
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
    setSuggestionError(null);
    
    if (!departmentFilter) {
      toast({
        title: "اختر التخصص",
        description: "يرجى اختيار التخصص قبل طلب الاقتراح",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('project-suggestion', {
        body: JSON.stringify({ 
          message: suggestionMessage, 
          department: departmentFilter 
        })
      });

      if (error) {
        console.error('Supabase function error:', error);
        setSuggestionError("خطأ في الاتصال بالخدمة. يرجى المحاولة لاحقًا.");
        throw error;
      }

      if (data?.error) {
        console.error('API returned error:', data.error);
        setSuggestionError(data.error);
        throw new Error(data.error);
      }

      if (data?.suggestion) {
        setSuggestedProject(data.suggestion);
        toast({
          title: "اقتراح مشروع",
          description: "تم توليد اقتراح مشروع بنجاح",
        });
      } else {
        throw new Error("لم يتم استلام اقتراح من الخدمة");
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء توليد الاقتراح",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const departments = [
    "علوم الحاسب",
    "نظم المعلومات",
    "هندسة الحاسب",
    "الذكاء الاصطناعي",
    "أمن المعلومات",
    "شبكات الحاسب",
    "تطبيقات الجوال",
    "تطوير الويب",
    "دعم فني حاسب آلي",
    "تقنية شبكات",
    "برمجة تطبيقات",
    "إنترنت الأشياء",
    "إدارة تقنية"
  ];

  const closeDialog = () => {
    setShowSuggestionDialog(false);
    setSuggestionError(null);
    setSuggestedProject('');
    setSuggestionMessage('');
    setDepartmentFilter('');
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
                loading={projectsLoading} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={showSuggestionDialog} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>اقتراح مشروع تخرج</DialogTitle>
            <DialogDescription>
              أخبرنا عن اهتماماتك وتخصصك، وسنقترح عليك مشروعًا مناسبًا
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {suggestionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{suggestionError}</AlertDescription>
              </Alert>
            )}
            
            <Select
              value={departmentFilter}
              onValueChange={(value) => setDepartmentFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر التخصص" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                <SelectGroup>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Textarea 
              placeholder="اكتب بعض التفاصيل عن اهتماماتك أو المجال الذي ترغب في العمل فيه (اختياري)"
              value={suggestionMessage}
              onChange={(e) => setSuggestionMessage(e.target.value)}
              className="w-full min-h-[100px]"
            />
            
            <Button 
              onClick={handleAISuggestion}
              className="w-full bg-archive-primary hover:bg-archive-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التوليد...
                </span>
              ) : 'اقتراح مشروع'}
            </Button>
            
            {suggestedProject && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">المشروع المقترح:</h3>
                <p className="whitespace-pre-line">{suggestedProject}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={closeDialog}
            >
              إغلاق
            </Button>
          </DialogFooter>
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
