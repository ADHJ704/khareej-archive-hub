
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { projectSchema } from '../schema/projectSchema';

type ProjectFormValues = z.infer<typeof projectSchema>;

export const useProjectForm = (isEditMode: boolean, projectId?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  return {
    form,
    isSubmitting,
    loadingProject,
    onSubmit
  };
};
