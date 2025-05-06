
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// تعريف مخطط التحقق من صحة النموذج باستخدام Zod
const projectSchema = z.object({
  title: z.string().min(3, { message: 'عنوان المشروع يجب أن يكون 3 أحرف على الأقل' }),
  author: z.string().min(2, { message: 'اسم الكاتب يجب أن يكون حرفين على الأقل' }),
  supervisor: z.string().min(2, { message: 'اسم المشرف يجب أن يكون حرفين على الأقل' }),
  department: z.string().min(2, { message: 'يجب تحديد القسم' }),
  year: z.string().min(2, { message: 'يجب إدخال سنة المشروع' }),
  abstract: z.string().min(10, { message: 'يجب أن يكون الملخص 10 أحرف على الأقل' }),
  description: z.string().min(10, { message: 'يجب أن يكون الوصف 10 أحرف على الأقل' }),
  full_content: z.string().min(10, { message: 'يجب أن يكون المحتوى الكامل 10 أحرف على الأقل' }),
  tags: z.string().optional(),
  categoryId: z.string().min(1, { message: 'يجب اختيار تصنيف للمشروع' }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

// قائمة من التصنيفات
const categories = [
  { id: 'ai_ml', name: 'الذكاء الاصطناعي وتعلم الآلة' },
  { id: 'web_development', name: 'تطوير الويب' },
  { id: 'mobile_dev', name: 'تطوير الجوال' },
  { id: 'iot', name: 'انترنت الأشياء' },
  { id: 'cloud_computing', name: 'الحوسبة السحابية' },
  { id: 'cyber_security', name: 'الأمن السيبراني' },
  { id: 'data_science', name: 'علوم البيانات' },
  { id: 'blockchain', name: 'تقنية البلوكتشين' },
  { id: 'virtual_reality', name: 'الواقع الافتراضي' },
  { id: 'robotics', name: 'الروبوتات' },
  { id: 'tech_support', name: 'الدعم التقني' },
  { id: 'it_management', name: 'إدارة تكنولوجيا المعلومات' },
];

const SupervisorProjectForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projectId } = useParams(); // للحصول على معرف المشروع إذا كان التعديل
  const isEditMode = !!projectId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProject, setLoadingProject] = useState(isEditMode);
  
  // تهيئة النموذج باستخدام react-hook-form و zod
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      author: '',
      supervisor: '',
      department: '',
      year: new Date().getFullYear().toString(),
      abstract: '',
      description: '',
      full_content: '',
      tags: '',
      categoryId: '',
    },
  });
  
  // جلب بيانات المشروع عند التعديل
  useEffect(() => {
    const fetchProject = async () => {
      if (isEditMode && projectId) {
        try {
          setLoadingProject(true);
          
          // التأكد من استخدام الـ session الحالي للمستخدم المشرف
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (data) {
            // تجهيز البيانات للنموذج
            form.reset({
              title: data.title,
              author: data.author,
              supervisor: data.supervisor,
              department: data.department,
              year: data.year,
              abstract: data.abstract || '',
              description: data.description || '',
              full_content: data.full_content || '',
              tags: data.tags ? data.tags.join(', ') : '',
              categoryId: data.category_id,
            });
          }
        } catch (error) {
          console.error("Error fetching project:", error);
          toast({
            title: "خطأ في تحميل بيانات المشروع",
            description: "حدث خطأ أثناء محاولة تحميل بيانات المشروع. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
          });
        } finally {
          setLoadingProject(false);
        }
      }
    };
    
    fetchProject();
  }, [projectId, isEditMode, form, toast]);
  
  // معالجة تقديم النموذج
  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    
    try {
      // تحويل سلسلة الوسوم إلى مصفوفة
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      const projectData = {
        title: values.title,
        author: values.author,
        supervisor: values.supervisor,
        department: values.department,
        year: values.year,
        abstract: values.abstract,
        description: values.description,
        full_content: values.full_content,
        tags: tagsArray,
        category_id: values.categoryId,
      };
      
      let response;
      
      if (isEditMode && projectId) {
        // تحديث المشروع الموجود
        response = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId);
        
        if (response.error) {
          throw response.error;
        }
        
        toast({
          title: "تم تحديث المشروع بنجاح",
          description: "تم تحديث بيانات المشروع في قاعدة البيانات."
        });
        
        // الانتقال إلى صفحة عرض المشروع
        navigate(`/projects/${projectId}`);
      } else {
        // إنشاء مشروع جديد
        response = await supabase
          .from('projects')
          .insert([projectData])
          .select();
        
        if (response.error) {
          throw response.error;
        }
        
        toast({
          title: "تم إضافة المشروع بنجاح",
          description: "تم إضافة المشروع الجديد إلى قاعدة البيانات."
        });
        
        // إذا كان هناك مشروع تم إنشاؤه، انتقل إلى صفحة عرض المشروع
        if (response.data && response.data.length > 0) {
          const newProjectId = response.data[0].id;
          navigate(`/projects/${newProjectId}`);
        } else {
          // إذا لم يتم الحصول على معرف المشروع، انتقل إلى قائمة المشاريع
          navigate('/supervisor/projects');
        }
      }
    } catch (error: any) {
      console.error("Error submitting project:", error);
      toast({
        title: "خطأ في حفظ المشروع",
        description: `حدث خطأ أثناء محاولة حفظ المشروع: ${error.message || "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loadingProject) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
        <Header />
        <main className="container mx-auto px-4 py-10 flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary mb-4"></div>
            <p className="text-archive-dark dark:text-white">جاري تحميل بيانات المشروع...</p>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right">
            {isEditMode ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
          </h1>
          <p className="text-muted-foreground mt-2 text-right">
            {isEditMode ? 'قم بتعديل بيانات المشروع الموجود' : 'أدخل بيانات المشروع الجديد لإضافته إلى الأرشيف'}
          </p>
        </div>
        
        <Card className="border-archive-secondary/20">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">عنوان المشروع</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل عنوان المشروع"
                            className="text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">اسم الكاتب</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم كاتب المشروع"
                            className="text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supervisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">اسم المشرف</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم مشرف المشروع"
                            className="text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">القسم</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل قسم المشروع"
                            className="text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">سنة المشروع</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل سنة المشروع"
                            className="text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">التصنيف</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right"
                            dir="rtl"
                            {...field}
                          >
                            <option value="" disabled>اختر تصنيف المشروع</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right block">الوسوم (مفصولة بفواصل)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: تطوير ويب، تجارة الكترونية، رياكت"
                            className="text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-right" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="abstract"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">ملخص المشروع</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل ملخصًا للمشروع"
                          className="text-right resize-none min-h-[100px]"
                          dir="rtl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">وصف المشروع</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل وصفًا تفصيليًا للمشروع"
                          className="text-right resize-none min-h-[150px]"
                          dir="rtl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="full_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">المحتوى الكامل للمشروع</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل المحتوى الكامل للمشروع هنا، يمكن استخدام تنسيق نصي بسيط"
                          className="text-right resize-none min-h-[300px]"
                          dir="rtl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4 space-x-reverse pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/supervisor/projects')}
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    className="bg-archive-primary hover:bg-archive-primary/80"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        {isEditMode ? 'جار حفظ التغييرات...' : 'جار إضافة المشروع...'}
                      </span>
                    ) : (
                      isEditMode ? 'حفظ التغييرات' : 'إضافة المشروع'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupervisorProjectForm;
