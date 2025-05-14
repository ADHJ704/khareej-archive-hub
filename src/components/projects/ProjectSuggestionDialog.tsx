
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

interface ProjectSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectSuggestionDialog = ({ open, onOpenChange }: ProjectSuggestionDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectTitle || !projectDescription) {
      toast({
        title: "حقول مطلوبة",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the edge function to get AI response
      const { data, error } = await supabase.functions.invoke('project-suggestion', {
        body: {
          message: `
            عنوان المشروع المقترح: ${projectTitle}
            
            وصف المشروع: ${projectDescription}
            
            يرجى تقييم المشروع المقترح وتقديم ملاحظات تفصيلية حول جدواه ومدى صلاحيته، واقتراح أفكار لتحسينه أو تطويره.
          `
        }
      });

      if (error) {
        throw error;
      }

      // Store the suggestion in the database
      await supabase.from('project_suggestions').insert({
        user_id: user?.id,
        message: `
          عنوان المشروع المقترح: ${projectTitle}
          
          وصف المشروع: ${projectDescription}
        `,
        response: data.response,
      });
      
      // Show success message
      toast({
        title: "تم إرسال الاقتراح",
        description: "سيتم مراجعة اقتراحك من قبل المشرفين.",
      });
      
      // Reset form and close dialog
      setProjectTitle("");
      setProjectDescription("");
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error submitting project suggestion:", error);
      
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال اقتراح المشروع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>اقتراح مشروع جديد</DialogTitle>
          <DialogDescription>
            شارك فكرتك لمشروع جديد وسنقدم لك تقييماً وملاحظات فورية باستخدام الذكاء الاصطناعي
          </DialogDescription>
        </DialogHeader>
          
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="project-title" className="text-sm font-medium">
              عنوان المشروع
            </label>
            <Input
              id="project-title"
              placeholder="أدخل عنوان المشروع المقترح"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="project-description" className="text-sm font-medium">
              وصف المشروع
            </label>
            <Textarea
              id="project-description"
              placeholder="اكتب وصفاً تفصيلياً للمشروع المقترح..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-archive-primary hover:bg-archive-secondary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جارٍ الإرسال..." : "إرسال الاقتراح"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSuggestionDialog;
