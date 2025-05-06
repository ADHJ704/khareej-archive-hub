
import * as z from 'zod';

export const projectSchema = z.object({
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

export type ProjectFormValues = z.infer<typeof projectSchema>;
