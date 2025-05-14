
import React, { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast({
        title: "تم حذف المشروع بنجاح",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "فشل في حذف المشروع",
        description: error.message || "حدث خطأ أثناء محاولة حذف المشروع",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">هل أنت متأكد من رغبتك في حذف هذا المشروع؟</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            لا يمكن التراجع عن هذا الإجراء. سيتم حذف المشروع نهائيًا من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse space-x-reverse space-x-2">
          <AlertDialogCancel disabled={isDeleting} className="mt-0">إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              'تأكيد الحذف'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;
