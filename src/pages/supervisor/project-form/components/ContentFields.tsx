
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { ProjectFormValues } from '../schema/projectSchema';

interface ContentFieldsProps {
  form: UseFormReturn<ProjectFormValues>;
}

export const ContentFields: React.FC<ContentFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
