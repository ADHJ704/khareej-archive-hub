
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '@/data/projects';
import { additionalProjects, testProject } from '@/data/projects'; // استيراد مشروع الاختبار
import { projects as demoProjects } from '@/data/projects';

export const useProjects = (categoryId?: string, searchQuery?: string, departmentFilter?: string, showOnlyWithLinks: boolean = true) => {
  return useQuery({
    queryKey: ['projects', categoryId, searchQuery, departmentFilter, showOnlyWithLinks],
    queryFn: async () => {
      try {
        let query = supabase
          .from('projects')
          .select('*');

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
        }
        
        if (departmentFilter) {
          query = query.eq('department', departmentFilter);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Supabase query error:", error);
          throw error;
        }

        // إذا وجدت بيانات من Supabase، استخدمها
        if (data && data.length > 0) {
          console.log('Data from Supabase:', data);
          
          const mappedData = data.map(item => ({
            id: item.id,
            title: item.title,
            author: item.author,
            department: item.department,
            year: item.year,
            abstract: item.abstract || '',
            description: item.description || '',
            tags: item.tags || [],
            supervisor: item.supervisor,
            categoryId: item.category_id,
            downloadUrl: item.download_url,
            pdfUrl: item.pdf_url
          })) as Project[];
          
          // إذا كانت الخاصية showOnlyWithLinks مفعلة، قم بتصفية المشاريع التي تحتوي على روابط فقط
          const filteredProjects = showOnlyWithLinks 
            ? mappedData.filter(project => !!project.pdfUrl || !!project.downloadUrl)
            : mappedData;
          
          console.log('Mapped data:', filteredProjects);
          return filteredProjects;
        } else {
          // إذا لم يتم العثور على بيانات، استخدم البيانات الافتراضية المحلية
          let combinedProjects = [...demoProjects, ...additionalProjects];
          
          // أضف مشروع الاختبار دائمًا
          combinedProjects = [testProject, ...combinedProjects];
          
          if (categoryId) {
            combinedProjects = combinedProjects.filter(
              project => project.categoryId === categoryId
            );
          }
          
          if (searchQuery) {
            const lowercaseQuery = searchQuery.toLowerCase();
            combinedProjects = combinedProjects.filter(
              project => 
                project.title.toLowerCase().includes(lowercaseQuery) ||
                project.abstract.toLowerCase().includes(lowercaseQuery) ||
                project.author.toLowerCase().includes(lowercaseQuery) ||
                project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
            );
          }
          
          if (departmentFilter) {
            combinedProjects = combinedProjects.filter(
              project => project.department === departmentFilter
            );
          }
          
          // إذا كانت الخاصية showOnlyWithLinks مفعلة، قم بتصفية المشاريع التي تحتوي على روابط فقط
          const filteredProjects = showOnlyWithLinks
            ? combinedProjects.filter(project => !!project.pdfUrl || !!project.downloadUrl)
            : combinedProjects;
          
          console.log('Using local data with test project. Total projects:', filteredProjects.length);
          return filteredProjects;
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        
        // في حالة الخطأ، استخدم البيانات المحلية
        let combinedProjects = [...demoProjects, ...additionalProjects];
        
        // أضف مشروع الاختبار دائمًا في حالة الخطأ أيضًا
        combinedProjects = [testProject, ...combinedProjects];
        
        if (categoryId) {
          combinedProjects = combinedProjects.filter(
            project => project.categoryId === categoryId
          );
        }
        
        if (searchQuery) {
          const lowercaseQuery = searchQuery.toLowerCase();
          combinedProjects = combinedProjects.filter(
            project => 
              project.title.toLowerCase().includes(lowercaseQuery) ||
              project.abstract.toLowerCase().includes(lowercaseQuery) ||
              project.author.toLowerCase().includes(lowercaseQuery) ||
              project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
          );
        }
        
        if (departmentFilter) {
          combinedProjects = combinedProjects.filter(
            project => project.department === departmentFilter
          );
        }
        
        // إذا كانت الخاصية showOnlyWithLinks مفعلة، قم بتصفية المشاريع التي تحتوي على روابط فقط
        const filteredProjects = showOnlyWithLinks
          ? combinedProjects.filter(project => !!project.pdfUrl || !!project.downloadUrl)
          : combinedProjects;
        
        console.log('Error occurred, using local data with test project. Total projects:', filteredProjects.length);
        return filteredProjects;
      }
    }
  });
};
