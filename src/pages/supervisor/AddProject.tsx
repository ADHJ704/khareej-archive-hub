
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const AddProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    department: '',
    year: new Date().getFullYear().toString(),
    supervisor: '',
    abstract: '',
    description: '',
    tags: '',
    category_id: 'general', // قيمة افتراضية
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // تحويل التاغات من نص إلى مصفوفة
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      // إنشاء كائن المشروع للإرسال
      const projectData = {
        title: formData.title,
        author: formData.author,
        department: formData.department,
        year: formData.year,
        supervisor: formData.supervisor,
        abstract: formData.abstract,
        description: formData.description,
        tags: tagsArray,
        category_id: formData.category_id,
      };

      // إرسال البيانات إلى قاعدة البيانات
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) {
        console.error("Error adding project:", error);
        toast({
          title: "حدث خطأ",
          description: "لم نتمكن من إضافة المشروع. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
        return;
      }

      // نجاح الإضافة
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة المشروع بنجاح إلى قاعدة البيانات.",
      });

      // إعادة تعيين النموذج
      setFormData({
        title: '',
        author: '',
        department: '',
        year: new Date().getFullYear().toString(),
        supervisor: '',
        abstract: '',
        description: '',
        tags: '',
        category_id: 'general',
      });

    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-archive-dark dark:text-white text-right">
            إضافة مشروع جديد
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            العودة
          </Button>
        </div>
        
        <Card className="w-full max-w-4xl mx-auto border-archive-secondary/20">
          <CardHeader>
            <CardTitle className="text-right">نموذج إضافة مشروع</CardTitle>
            <CardDescription className="text-right">
              أدخل تفاصيل المشروع الجديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان المشروع</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="أدخل عنوان المشروع"
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">اسم الباحث</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="أدخل اسم الباحث"
                    required
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="أدخل اسم القسم"
                    required
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">السنة</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="سنة المشروع"
                    required
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor">المشرف</Label>
                  <Input
                    id="supervisor"
                    name="supervisor"
                    value={formData.supervisor}
                    onChange={handleChange}
                    placeholder="اسم المشرف"
                    required
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">التخصص</Label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right"
                    required
                  >
                    <option value="ai">الذكاء الاصطناعي</option>
                    <option value="web">تطوير الويب</option>
                    <option value="mobile">تطوير التطبيقات المحمولة</option>
                    <option value="iot">إنترنت الأشياء</option>
                    <option value="cs">علوم الحاسوب</option>
                    <option value="general">عام</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">الكلمات المفتاحية (مفصولة بفواصل)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="تقنية, بحث, تطوير"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abstract">ملخص المشروع</Label>
                <Textarea
                  id="abstract"
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  placeholder="اكتب ملخصاً موجزاً للمشروع"
                  rows={3}
                  className="resize-none text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف المشروع</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="اكتب وصفاً تفصيلياً للمشروع"
                  rows={5}
                  className="resize-none text-right"
                />
              </div>

              <CardFooter className="flex justify-start px-0 pt-6">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-archive-primary hover:bg-archive-primary/90 w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : "إضافة المشروع"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddProject;
