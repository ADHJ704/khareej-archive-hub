
import React, { useEffect, useState } from 'react';
import { BookOpen, File, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import FeaturedProjects from '@/components/FeaturedProjects';
import { projects } from '@/data/projects';
import { categories } from '@/data/categories';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { updateSupervisorPassword } from "@/lib/update-supervisor-password";
import { verifySupervisorAccount } from "@/lib/verify-supervisor-account";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectsCount, setProjectsCount] = useState(0);
  const [categoriesCount, setCategorizesCount] = useState(0);
  const { toast } = useToast();

  // الحصول على أحدث المشاريع
  const recentProjects = [...projects].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
  ).slice(0, 3);

  // جلب الإحصائيات الفعلية من قاعدة البيانات
  useEffect(() => {
    const fetchCounts = async () => {
      // الحصول على عدد المشاريع
      const { count: projectCount, error: projectError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      if (!projectError && projectCount !== null) {
        setProjectsCount(projectCount);
      } else {
        console.error('Error fetching project count:', projectError);
        setProjectsCount(projects.length); // استخدام البيانات المحلية كبديل
      }

      // الحصول على عدد التخصصات
      setCategorizesCount(categories.length);
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        {/* قسم الترحيب */}
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
                <Button 
                  size="lg" 
                  className="bg-white text-archive-primary hover:bg-archive-light"
                  onClick={() => navigate('/categories')}
                >
                  <Compass className="ml-2 h-5 w-5" />
                  استعراض التخصصات
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-archive-dark/10 z-0"></div>
        </section>
        
        {/* قسم الإحصائيات */}
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
        
        {/* قسم المشاريع المميزة */}
        <FeaturedProjects projects={recentProjects} />

        {/* قسم عن المنصة */}
        <section className="py-12 bg-slate-50 dark:bg-slate-900">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-archive-primary mb-4">
                عن منصة أرشيف المشاريع
              </h2>
              <p className="text-lg text-archive-dark/80 dark:text-white/80">
                منصة متكاملة لمساعدة المتدربين والمشرفين في الوصول إلى مشاريع التخرج السابقة والاستفادة منها في إعداد أبحاثهم ومشاريعهم الخاصة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-card p-6 rounded-lg text-center shadow-sm">
                <div className="bg-archive-muted/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-archive-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">سهولة الوصول</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  وصول سريع وسهل لمئات المشاريع في مختلف التخصصات
                </p>
              </div>
              <div className="bg-white dark:bg-card p-6 rounded-lg text-center shadow-sm">
                <div className="bg-archive-muted/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <File className="h-8 w-8 text-archive-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">محتوى متكامل</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  عرض المشاريع بتفاصيلها الكاملة مع إمكانية تصفحها مباشرة
                </p>
              </div>
              <div className="bg-white dark:bg-card p-6 rounded-lg text-center shadow-sm">
                <div className="bg-archive-muted/50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Compass className="h-8 w-8 text-archive-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">تصنيف منظم</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  تصنيف المشاريع حسب التخصصات والأقسام لتسهيل عملية البحث
                </p>
              </div>
            </div>
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
