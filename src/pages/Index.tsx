
import React from 'react';
import { ArrowRight, BookOpen, Search, Library, File } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import FeaturedProjects from '@/components/FeaturedProjects';
import { projects } from '@/data/projects';
import { categories } from '@/data/categories';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/projects?search=${encodeURIComponent(query)}`);
  };

  // Get the most recent projects
  const recentProjects = [...projects].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-gradient-to-r from-archive-primary to-archive-secondary py-16 md:py-24">
          <div className="container-custom relative z-10">
            <div className="text-center max-w-3xl mx-auto text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                أرشيف المشاريع الجامعية
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                منصة رقمية تجمع مشاريع التخرج السابقة لتكون مرجعاً للباحثين والطلاب
              </p>
              
              <div className="max-w-xl mx-auto">
                <SearchBar onSearch={handleSearch} className="mb-8" />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-archive-primary hover:bg-archive-light"
                  onClick={() => navigate('/projects')}
                >
                  <File className="ml-2 h-5 w-5" />
                  تصفح المشاريع
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/categories')}
                >
                  <Library className="ml-2 h-5 w-5" />
                  استعراض التصنيفات
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-archive-dark/10 z-0"></div>
        </section>
        
        {/* Stats section */}
        <section className="py-12 bg-white dark:bg-card">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-archive-muted rounded-lg">
                <div className="text-4xl font-bold text-archive-primary mb-2">{projects.length}+</div>
                <div className="text-archive-secondary font-medium">مشروع متاح</div>
              </div>
              <div className="text-center p-6 bg-archive-muted rounded-lg">
                <div className="text-4xl font-bold text-archive-primary mb-2">{categories.length}</div>
                <div className="text-archive-secondary font-medium">تصنيف مختلف</div>
              </div>
              <div className="text-center p-6 bg-archive-muted rounded-lg">
                <div className="text-4xl font-bold text-archive-primary mb-2">5+</div>
                <div className="text-archive-secondary font-medium">سنوات من المشاريع</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured projects section */}
        <FeaturedProjects projects={recentProjects} />
        
        {/* Categories section */}
        <section className="py-12 bg-white dark:bg-card">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-archive-primary mb-8 text-center">
              تصنيفات المشاريع
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <div 
                  key={category.id} 
                  className="p-6 archive-card hover:border-archive-accent hover:border transition-all"
                  onClick={() => navigate(`/projects?category=${category.id}`)}
                >
                  <h3 className="text-xl font-semibold text-archive-primary mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {category.description}
                  </p>
                  <Button variant="link" className="p-0 text-archive-secondary">
                    <span>عرض المشاريع</span>
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 bg-archive-primary text-white">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              ابدأ رحلة البحث الآن
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
              استفد من مكتبة المشاريع الرقمية واستلهم أفكاراً لمشروع تخرجك
            </p>
            <Button 
              size="lg" 
              className="bg-white text-archive-primary hover:bg-archive-light"
              onClick={() => navigate('/projects')}
            >
              <BookOpen className="ml-2 h-5 w-5" />
              استعرض المشاريع
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-archive-dark text-white py-8">
        <div className="container-custom">
          <div className="text-center">
            <p className="mb-2">أرشيف المشاريع الجامعية &copy; {new Date().getFullYear()}</p>
            <p className="text-sm text-white/70">
              تم تطوير المنصة بهدف دعم البحث العلمي وإثراء المعرفة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
