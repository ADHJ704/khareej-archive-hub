
import * as z from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, { message: "عنوان المشروع يجب أن يكون على الأقل 3 أحرف" }),
  author: z.string().min(2, { message: "اسم الكاتب يجب أن يكون على الأقل 2 حرفين" }),
  supervisor: z.string().min(2, { message: "اسم المشرف يجب أن يكون على الأقل 2 حرفين" }),
  department: z.string().min(2, { message: "اسم القسم يجب أن يكون على الأقل 2 حرفين" }),
  year: z.string().regex(/^\d{4}$/, { message: "السنة يجب أن تكون 4 أرقام" }),
  abstract: z.string().min(10, { message: "الملخص يجب أن يكون على الأقل 10 أحرف" }),
  description: z.string().min(10, { message: "الوصف يجب أن يكون على الأقل 10 أحرف" }),
  full_content: z.string().optional(),
  tags: z.string(),
  categoryId: z.string().min(1, { message: "يرجى اختيار تصنيف للمشروع" }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
