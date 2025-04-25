
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '@/data/projects';
import { additionalProjects } from '@/data/more-projects';
import { projects as demoProjects } from '@/data/projects';

export const useProjects = (categoryId?: string, searchQuery?: string, departmentFilter?: string) => {
  return useQuery({
    queryKey: ['projects', categoryId, searchQuery, departmentFilter],
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
          return data.map(item => ({
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
        } else {
          // إذا لم يتم العثور على بيانات، استخدم البيانات الافتراضية المحلية
          let combinedProjects = [...demoProjects, ...additionalProjects];
          
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
          
          return combinedProjects;
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        
        // في حالة الخطأ، استخدم البيانات المحلية
        let combinedProjects = [...demoProjects, ...additionalProjects];
        
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
        
        return combinedProjects;
      }
    }
  });
};
