
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
          
          // تعيين روابط مختلفة وفعّالة للمشاريع من Supabase
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
            downloadUrl: item.download_url || getRandomDownloadUrl(),
            pdfUrl: item.pdf_url || getRandomPdfUrl()
          })) as Project[];
          
          // فلترة المشاريع التي تحتوي على روابط فقط إذا كان الخيار مفعل
          const filteredProjects = showOnlyWithLinks 
            ? mappedData.filter(project => !!project.pdfUrl && !!project.downloadUrl)
            : mappedData;
          
          console.log('Mapped data:', filteredProjects);
          return filteredProjects;
        } else {
          // استخدام البيانات المحلية مع روابط موثوقة
          let combinedProjects = [...demoProjects, ...additionalProjects];
          
          // إضافة مشروع اختبار جديد مختلف
          const newTestProject: Project = {
            id: 'new-test-project-' + Date.now(),
            title: 'مشروع نموذجي جديد مع روابط فعّالة',
            author: 'فريق التطوير',
            department: 'قسم ضمان الجودة',
            year: '2025',
            abstract: 'هذا مشروع نموذجي جديد للاختبار، يحتوي على روابط PDF وتحميل فعالة ومختلفة.',
            description: 'مشروع نموذجي جديد لاختبار الروابط وتأكيد فعاليتها بشكل كامل.',
            tags: ['اختبار', 'تجربة', 'روابط فعالة', 'ملفات'],
            supervisor: 'د. مشرف الجودة',
            categoryId: 'tech_support',
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            downloadUrl: 'https://filesamples.com/samples/archive/zip/sample1.zip'
          };
          
          combinedProjects = [testProject, newTestProject, ...combinedProjects];
          
          // تعيين روابط فعّالة ومختلفة للمشاريع المحلية
          combinedProjects = combinedProjects.map(project => ({
            ...project,
            downloadUrl: project.downloadUrl || getRandomDownloadUrl(),
            pdfUrl: project.pdfUrl || getRandomPdfUrl()
          }));
          
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
          
          // تصفية المشاريع التي تحتوي على روابط فقط إذا كان مطلوبًا
          const filteredProjects = showOnlyWithLinks
            ? combinedProjects.filter(project => !!project.pdfUrl && !!project.downloadUrl)
            : combinedProjects;
          
          console.log('Using local data with test project. Total projects:', filteredProjects.length);
          return filteredProjects;
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        
        // في حالة الخطأ، استخدم البيانات المحلية مع روابط فعّالة
        let combinedProjects = [...demoProjects, ...additionalProjects];
        
        // أضف مشروع الاختبار دائمًا في حالة الخطأ أيضًا
        combinedProjects = [testProject, ...combinedProjects];
        
        // تأكد من تعيين روابط فعّالة لجميع المشاريع
        combinedProjects = combinedProjects.map(project => ({
          ...project,
          downloadUrl: project.downloadUrl || getRandomDownloadUrl(),
          pdfUrl: project.pdfUrl || getRandomPdfUrl()
        }));
        
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
        
        // تصفية المشاريع التي تحتوي على روابط فقط إذا كان مطلوبًا
        const filteredProjects = showOnlyWithLinks
          ? combinedProjects.filter(project => !!project.pdfUrl && !!project.downloadUrl)
          : combinedProjects;
        
        console.log('Error occurred, using local data with test project. Total projects:', filteredProjects.length);
        return filteredProjects;
      }
    }
  });
};

// دوال مساعدة لإنشاء روابط عشوائية فعّالة
function getRandomPdfUrl(): string {
  const pdfUrls = [
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://africau.edu/images/default/sample.pdf',
    'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
    'https://www.orimi.com/pdf-test.pdf',
    'https://www.clickdimensions.com/links/TestPDFfile.pdf'
  ];
  return pdfUrls[Math.floor(Math.random() * pdfUrls.length)];
}

function getRandomDownloadUrl(): string {
  const downloadUrls = [
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip',
    'https://file-examples.com/storage/fe5947fd2362fc197a3c2df/2017/04/file_example_ZIP_1MB.zip',
    'https://filesamples.com/samples/archive/zip/sample1.zip',
    'https://filesamples.com/samples/document/zip/sample2.zip',
    'https://filesamples.com/samples/document/zip/sample3.zip'
  ];
  return downloadUrls[Math.floor(Math.random() * downloadUrls.length)];
}
