
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  projectId: string | null;
  onSuccess: () => void;
}

const DeleteProjectDialog = ({ isOpen, setIsOpen, projectId, onSuccess }: DeleteProjectDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!projectId) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "تم حذف المشروع بنجاح",
        description: "تم حذف المشروع من قاعدة البيانات."
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        title: "خطأ في حذف المشروع",
        description: `حدث خطأ أثناء محاولة حذف المشروع: ${error.message || "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="text-right">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف هذا المشروع نهائيًا من قاعدة البيانات ولن تتمكن من استرجاعه.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse sm:justify-end">
          <AlertDialogCancel className="ml-2" disabled={isDeleting}>إلغاء</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-500 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "جار الحذف..." : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;
