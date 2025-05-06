
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { projectCategories } from '../data/categories';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '../schema/projectSchema';

interface BasicInfoFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ form }) => {
  return (
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
                {projectCategories.map((category) => (
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
  );
};
