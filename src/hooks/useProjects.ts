
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

      return data as Project[];
    }
  });
};
