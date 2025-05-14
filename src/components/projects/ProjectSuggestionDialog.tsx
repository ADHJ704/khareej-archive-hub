
import React, { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRepeatedActionConfirmation } from '@/lib/repeated-action-helper';

interface ProjectSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEPARTMENTS = [
  "علوم الحاسب",
  "نظم المعلومات",
  "هندسة الحاسب",
  "الذكاء الاصطناعي",
  "أمن المعلومات",
  "شبكات الحاسب",
  "تطبيقات الجوال",
  "تطوير الويب",
  "دعم فني حاسب آلي",
  "تقنية شبكات",
  "برمجة تطبيقات",
  "إنترنت الأشياء",
  "إدارة تقنية"
];

const ProjectSuggestionDialog = ({ open, onOpenChange }: ProjectSuggestionDialogProps) => {
  const { toast } = useToast();
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [suggestedProject, setSuggestedProject] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const { needsConfirmation, trackAction, resetAction } = useRepeatedActionConfirmation(2);
  
  const handleAISuggestion = async () => {
    if (!trackAction()) {
      return;
    }

    setSuggestionError(null);
    
    if (!departmentFilter) {
      toast({
        title: "اختر التخصص",
        description: "يرجى اختيار التخصص قبل طلب الاقتراح",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('project-suggestion', {
        body: JSON.stringify({ 
          message: suggestionMessage, 
          department: departmentFilter 
        })
      });

      if (error) {
        console.error('Supabase function error:', error);
        setSuggestionError("خطأ في الاتصال بالخدمة. يرجى المحاولة لاحقًا.");
        throw error;
      }

      if (data?.error) {
        console.error('API returned error:', data.error);
        setSuggestionError(data.error);
        throw new Error(data.error);
      }

      if (data?.suggestion) {
        setSuggestedProject(data.suggestion);
        toast({
          title: "اقتراح مشروع",
          description: "تم توليد اقتراح مشروع بنجاح",
        });
      } else {
        throw new Error("لم يتم استلام اقتراح من الخدمة");
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      if (error instanceof Error) {
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء توليد الاقتراح",
          variant: "destructive"
        });
      } else {
        toast({
          title: "خطأ",
          description: "حدث خطأ غير معروف أثناء توليد الاقتراح",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeDialog = () => {
    onOpenChange(false);
    setSuggestionError(null);
    setSuggestedProject('');
    setSuggestionMessage('');
    setDepartmentFilter('');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>اقتراح مشروع تخرج</DialogTitle>
            <DialogDescription>
              أخبرنا عن اهتماماتك وتخصصك، وسنقترح عليك مشروعًا مناسبًا
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {suggestionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{suggestionError}</AlertDescription>
              </Alert>
            )}
            
            <Select
              value={departmentFilter}
              onValueChange={(value) => setDepartmentFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر التخصص" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <ScrollArea className="h-[180px] w-full">
                  <SelectGroup>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </ScrollArea>
              </SelectContent>
            </Select>
            
            <Textarea 
              placeholder="اكتب بعض التفاصيل عن اهتماماتك أو المجال الذي ترغب في العمل فيه (اختياري)"
              value={suggestionMessage}
              onChange={(e) => setSuggestionMessage(e.target.value)}
              className="w-full min-h-[100px]"
            />
            
            <Button 
              onClick={handleAISuggestion}
              className="w-full bg-archive-primary hover:bg-archive-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التوليد...
                </span>
              ) : 'اقتراح مشروع'}
            </Button>
            
            {suggestedProject && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">المشروع المقترح:</h3>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-gray-100">
                  <p className="whitespace-pre-line">{suggestedProject}</p>
                </ScrollArea>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={closeDialog}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {needsConfirmation && (
        <ProjectSuggestionConfirmation 
          onContinue={handleAISuggestion}
          onCancel={resetAction}
        />
      )}
    </>
  );
};

interface ProjectSuggestionConfirmationProps {
  onContinue: () => void;
  onCancel: () => void;
}

const ProjectSuggestionConfirmation = ({ onContinue, onCancel }: ProjectSuggestionConfirmationProps) => {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>هل أنت متأكد؟</DialogTitle>
          <DialogDescription>
            لقد حاولت توليد اقتراح مشروع مرتين متتاليتين. هل تريد المتابعة؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>إلغاء</Button>
          <Button onClick={onContinue}>
            نعم، المتابعة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSuggestionDialog;
