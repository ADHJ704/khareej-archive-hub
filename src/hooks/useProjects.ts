
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '@/data/projects';

export const useProjects = (categoryId?: string, searchQuery?: string) => {
  return useQuery({
    queryKey: ['projects', categoryId, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select('*');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Map the database fields (snake_case) to our interface fields (camelCase)
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
        categoryId: item.category_id, // Map category_id to categoryId
        downloadUrl: item.download_url,
        pdfUrl: item.pdf_url
      })) as Project[];
    }
  });
};
