
import React, { useEffect, useState } from 'react';
import { BookOpen, File, Compass, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import FeaturedProjects from '@/components/FeaturedProjects';
import { categories } from '@/data/categories';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projectsCount, setProjectsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(categories.length);
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const { toast } = useToast();

  // جلب الإحصائيات والمشاريع الحديثة من قاعدة البيانات
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProjects(true);
      try {
        // الحصول على عدد المشاريع
        const { count: projectCount, error: projectError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        if (!projectError && projectCount !== null) {
          setProjectsCount(projectCount);
        } else {
          console.error('Error fetching project count:', projectError);
        }

        // إذا كان المستخدم مسجل الدخول، نقوم بجلب أحدث المشاريع
        if (user) {
          const { data: latestProjects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

          if (!projectsError && latestProjects) {
            setRecentProjects(latestProjects);
          } else {
            console.error('Error fetching recent projects:', projectsError);
            setRecentProjects([]);
          }
        } else {
          // إذا لم يكن المستخدم مسجل الدخول، نضع مصفوفة فارغة
          setRecentProjects([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchData();
  }, [user]);
  
  // التوجيه إلى صفحة تسجيل الدخول للمتدربين
  const handleProjectsClick = () => {
    if (user) {
      navigate('/projects');
    } else {
      navigate('/trainee-login', { state: { redirectTo: '/projects' } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
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
                  onClick={handleProjectsClick}
                >
                  <File className="ml-2 h-5 w-5" />
                  {user ? "تصفح المشاريع" : "تسجيل الدخول لعرض المشاريع"}
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
        
        {/* قسم المشاريع المميزة - فقط للمستخدمين المسجلين */}
        {user ? (
          isLoadingProjects ? (
            <div className="py-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary"></div>
            </div>
          ) : (
            <FeaturedProjects projects={recentProjects} />
          )
        ) : (
          <section className="py-10 bg-archive-muted">
            <div className="container-custom">
              <div className="bg-white dark:bg-card p-8 rounded-lg shadow text-center">
                <Lock className="h-16 w-16 mx-auto mb-4 text-archive-primary opacity-80" />
                <h2 className="text-2xl font-bold mb-4">المشاريع متاحة فقط للمستخدمين المسجلين</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  يرجى تسجيل الدخول أو إنشاء حساب جديد للوصول إلى جميع مشاريع الأرشيف
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/trainee-login')}
                    className="bg-archive-primary hover:bg-archive-secondary"
                  >
                    تسجيل الدخول
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/trainee-signup')}
                    className="border-archive-primary text-archive-primary hover:bg-archive-primary hover:text-white"
                  >
                    إنشاء حساب جديد
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* قسم عن المنصة */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-archive-dark dark:text-white mb-4">استعرض مشاريع التخرج</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                تصفح مجموعة متنوعة من مشاريع التخرج في مختلف التخصصات. يرجى تسجيل الدخول للوصول إلى كامل المحتوى.
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
