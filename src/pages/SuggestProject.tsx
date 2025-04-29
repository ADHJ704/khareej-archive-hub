
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import RequireAuth from '@/components/RequireAuth';
import { categories } from '@/data/categories';

// Define form validation schema
const formSchema = z.object({
  title: z.string().min(5, { message: 'العنوان يجب أن يكون 5 أحرف على الأقل' }).max(100, { message: 'العنوان لا يمكن أن يتجاوز 100 حرف' }),
  description: z.string().min(20, { message: 'الوصف يجب أن يكون 20 حرفاً على الأقل' }),
  category_id: z.string({ required_error: 'يرجى اختيار تصنيف' }),
});

type FormValues = z.infer<typeof formSchema>;

const SuggestProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "خطأ في الصلاحية",
        description: "يجب تسجيل الدخول لاقتراح مشروع",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert form values to message format
      const message = `عنوان المشروع: ${values.title}\nالوصف: ${values.description}\nالتصنيف: ${
        categories.find(cat => cat.id === values.category_id)?.name || values.category_id
      }`;

      // Insert into project_suggestions table
      const { error } = await supabase
        .from('project_suggestions')
        .insert({
          user_id: user.id,
          message: message,
          response: 'قيد المراجعة', // Default response
        });

      if (error) throw error;

      // Show success message
      toast({
        title: "تم تقديم الاقتراح بنجاح",
        description: "سيتم مراجعة اقتراحك في أقرب وقت ممكن",
      });

      // Navigate back to homepage
      navigate('/');
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast({
        title: "خطأ في حفظ الاقتراح",
        description: "حدث خطأ أثناء حفظ اقتراحك، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="outline"
              className="mb-6"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للصفحة الرئيسية
            </Button>

            <Card className="border-archive-primary/20">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-archive-primary/10 p-3 rounded-full">
                    <FileText className="h-10 w-10 text-archive-primary" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl text-archive-dark dark:text-white">
                  اقتراح مشروع جديد
                </CardTitle>
                <CardDescription className="text-center">
                  أدخل معلومات المشروع الذي ترغب باقتراحه
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right block">تصنيف المشروع</FormLabel>
                          <FormControl>
                            <select
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base text-right"
                              dir="rtl"
                              {...field}
                            >
                              <option value="">اختر تصنيفاً...</option>
                              {categories.map((category) => (
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right block">وصف المشروع</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="أدخل وصف تفصيلي للمشروع المقترح"
                              className="min-h-[150px] text-right"
                              dir="rtl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-right" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-archive-primary hover:bg-archive-dark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'جاري إرسال الاقتراح...' : 'إرسال الاقتراح'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default SuggestProject;
