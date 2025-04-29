
import React, { useEffect, useState } from 'react';
import { BookOpen, File, UserRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import FeaturedProjects from '@/components/FeaturedProjects';
import { projects } from '@/data/projects';
import { categories } from '@/data/categories';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectsCount, setProjectsCount] = useState(0);
  const [categoriesCount, setCategorizesCount] = useState(0);

  // Get the most recent projects
  const recentProjects = [...projects].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
  ).slice(0, 3);

  // Fetch actual counts from database
  useEffect(() => {
    const fetchCounts = async () => {
      // Get projects count
      const { count: projectCount, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (!projectError && projectCount !== null) {
        setProjectsCount(projectCount);
      } else {
        console.error('Error fetching project count:', projectError);
        setProjectsCount(projects.length); // Fallback to local data
      }

      // Get categories count
      setCategorizesCount(categories.length);
    };

    fetchCounts();
  }, []);

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
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="bg-white text-archive-primary hover:bg-archive-light"
                  onClick={() => navigate('/projects')}
                >
                  <File className="ml-2 h-5 w-5" />
                  تصفح المشاريع
                </Button>
              </div>
              
              {!user && (
                <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">تسجيل الدخول للوصول إلى كامل المميزات</h2>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-archive-primary hover:bg-archive-light"
                      onClick={() => navigate('/trainee-login')}
                    >
                      <UserRound className="ml-2 h-5 w-5" />
                      تسجيل دخول متدرب
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-archive-secondary hover:bg-archive-secondary/80"
                      onClick={() => navigate('/supervisor-login')}
                    >
                      <UserRound className="ml-2 h-5 w-5" />
                      تسجيل دخول مشرف
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="absolute inset-0 bg-archive-dark/10 z-0"></div>
        </section>
        
        {/* Stats section */}
        <section className="py-12 bg-white dark:bg-card">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-archive-muted rounded-lg">
                <div className="text-4xl font-bold text-archive-primary mb-2">{projectsCount}+</div>
                <div className="text-archive-secondary font-medium">مشروع متاح</div>
              </div>
              <div className="text-center p-6 bg-archive-muted rounded-lg">
                <div className="text-4xl font-bold text-archive-primary mb-2">{categoriesCount}</div>
                <div className="text-archive-secondary font-medium">تخصص مختلف</div>
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
